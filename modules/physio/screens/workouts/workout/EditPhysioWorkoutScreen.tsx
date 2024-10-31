import { Text, useTheme } from "@rneui/themed";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  useEditWorkoutStore,
  useWorkoutStore,
} from "../../../../../store/WorkoutStore";
import Input from "../../../../shared/components/Input";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioWorkoutStack } from "../../../../navigation/Routes";
import Button from "../../../../shared/components/Button";
import { supabase } from "../../../../../lib/SupaBase";
import { decode } from "base64-arraybuffer";

export default function EditPhysioWorkoutScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioWorkoutStack>>();
  const { updateWorkout } = useWorkoutStore();
  const { workout, clearWorkout, setWorkout } = useEditWorkoutStore();

  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>();
  const [inputs, setInputs] = useState({
    name: {
      value: workout?.name ? workout.name : "",
      isValid: true,
    },
    description: {
      value: workout?.description ? workout.description : "",
      isValid: true,
    },
  });

  function updateInputValueHandler(inputType: any, enteredValue: any) {
    setInputs((previousValues) => ({
      ...previousValues,
      [inputType]: {
        value: enteredValue,
        isValid: true,
      },
    }));
  }

  const getPublicUrl = async (filePath: string) => {
    if (!filePath) return;
    const { data: publicUrlData } = supabase.storage
      .from("Public")
      .getPublicUrl(filePath);
    if (publicUrlData) {
      return publicUrlData.publicUrl;
    }
  };

  const uploadImage = async () => {
    if (!workout || !selectedImage) return;
    const removeSpaces = workout.name.replace(/\s/g, "");
    const filePath = `Workouts/${removeSpaces}`;
    const base64 = selectedImage.base64;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Public")
      .upload(filePath, decode(base64!), {
        contentType: selectedImage.mimeType,
      });

    if (uploadError || !uploadData) {
      WorkoutAlert("Error Uploading", uploadError.message);
      return;
    }

    return await getPublicUrl(uploadData.path);
  };

  const pickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Open the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      base64: true,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      if (result.assets[0].height < 1080 || result.assets[0].width < 1080) {
        WorkoutAlert(
          "Warning",
          "For best quality, please select an image with a minimum resolution of 1080x1080."
        );
      }
      setSelectedImage(result.assets[0]);
    }
    return;
  };

  async function submitHandler() {
    const validate = () => {
      const nameIsValid = (name: string) => {
        return name.length > 0;
      };

      const descriptionIsValid = (description: string) => {
        return description.length > 0;
      };

      if (
        nameIsValid(inputs.name.value) &&
        descriptionIsValid(inputs.description.value)
      ) {
        return true;
      } else {
        if (!nameIsValid(inputs.name.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              username: { value: inputs.name.value, isValid: false },
            };
          });
          WorkoutAlert("Invalid name", "Please enter a name.");
        }
        if (!descriptionIsValid(inputs.description.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              firstname: { value: inputs.description.value, isValid: false },
            };
          });
          WorkoutAlert("Invalid description", "Please enter a description.");
        }
        return false;
      }
    };

    if (validate()) {
      await updateExistingWorkout();
    }
    return false;
  }

  async function updateExistingWorkout() {
    if (!workout) return;
    setIsLoading(true);
    let pictureurl;
    if (selectedImage) {
      const removeSpaces = workout.name.replace(/\s/g, "");
      const { error: removeError } = await supabase.storage
        .from("Public")
        .remove([`Workouts/${removeSpaces}`]);

      if (removeError) {
        WorkoutAlert("Error", removeError.message);
        return;
      }
      pictureurl = await uploadImage();
    }

    const { data: workoutData, error: workoutError } = await supabase
      .from("workout")
      .update({
        name: inputs.name.value,
        description: inputs.description.value,
        pictureurl: pictureurl ? pictureurl : workout.pictureurl,
      })
      .eq("id", workout.id)
      .select();

    if (workoutError) {
      WorkoutAlert("Error", workoutError.message);
      setIsLoading(false);
      return;
    }
    updateWorkout(workoutData[0]);
    navigation.navigate("EditPhysioWorkoutExercise");
  }

  const WorkoutAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  };

  function cancelHandler() {
    setInputs({
      name: {
        value: workout?.name ? workout.name : "",
        isValid: true,
      },
      description: {
        value: workout?.description ? workout.description : "",
        isValid: true,
      },
    });
    setIsEditing(!isEditing);
  }

  function confirmHandler() {
    if (isWeb) submitHandler();
    Alert.alert("Save Changes", "Are you sure you want to save changes?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Save",
        style: "default",
        onPress: () => submitHandler(),
      },
    ]);
  }

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      paddingBottom: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      marginHorizontal: 10,
    },
    cancelButton: {
      backgroundColor: theme.colors.grey5,
    },
    saveButton: {
      backgroundColor: "green",
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    placeholder: {
      width: 200,
      height: 200,
      backgroundColor: "#e1e1e1",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 100,
    },
    inputContainer: {
      marginVertical: 5,
      width: Platform.OS !== "web" ? "100%" : "25%",
      alignItems: "center",
      justifyContent: "center",
    },
    pressable: {
      paddingVertical: 20,
      alignItems: "center",
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      contentContainerStyle={styles.container}
    >
      <Pressable
        disabled={!isEditing}
        onPress={pickImage}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.placeholder}>
          <Image
            source={
              selectedImage?.uri
                ? { uri: selectedImage?.uri }
                : workout?.pictureurl
                ? { uri: workout.pictureurl }
                : require("../../../../../assets/Meal.png")
            }
            style={styles.image}
          />
        </View>
      </Pressable>
      <View style={styles.inputContainer}>
        <Input
          disabled={!isEditing}
          isValid={inputs.name.isValid}
          keyboardType="default"
          placeholder={"Name"}
          value={inputs.name.value}
          onUpdateValue={(value: any) => updateInputValueHandler("name", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          disabled={!isEditing}
          isValid={inputs.description.isValid}
          keyboardType="default"
          placeholder={"Description"}
          value={inputs.description.value}
          onUpdateValue={(value: any) =>
            updateInputValueHandler("description", value)
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        {!isEditing ? (
          <Button
            onPress={() => setIsEditing(!isEditing)}
            style={[styles.button, styles.cancelButton]}
          >
            Edit
          </Button>
        ) : (
          <Button
            disabled={isLoading}
            style={[styles.button, styles.cancelButton]}
            onPress={cancelHandler}
          >
            Cancel
          </Button>
        )}
        {!isEditing ? (
          <Button
            style={styles.button}
            onPress={() => navigation.navigate("EditPhysioWorkoutExercise")}
          >
            Next
          </Button>
        ) : (
          <Button
            disabled={isLoading}
            style={[styles.button, styles.saveButton]}
            onPress={confirmHandler}
          >
            {isLoading ? (
              <ActivityIndicator size={"small"} color={theme.colors.primary} />
            ) : (
              "Save"
            )}
          </Button>
        )}
      </View>
    </ScrollView>
  );
}
