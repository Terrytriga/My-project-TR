import { Text, useTheme } from "@rneui/themed";
import { useState } from "react";
import {
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
  useNewWorkoutStore,
  useWorkoutStore,
} from "../../../../../store/WorkoutStore";
import Input from "../../../../shared/components/Input";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioWorkoutStack } from "../../../../navigation/Routes";
import Button from "../../../../shared/components/Button";

export default function AddPhysioWorkoutScreen() {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioWorkoutStack>>();
  const { workouts } = useWorkoutStore();
  const { workout, clearWorkout, setWorkout } = useNewWorkoutStore();
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(
      workout?.picture ? workout.picture : null
    );
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
    if (!selectedImage) {
      WorkoutAlert("No Image", "Please select an image for the meal.");
      return;
    }
    const validate = () => {
      const nameIsValid = (name: string) => {
        return name.length > 0;
      };

      const descriptionIsValid = (description: string) => {
        return description.length > 0;
      };

      const doesWorkoutExist = workouts.some(
        (workout) =>
          workout.name.toLowerCase() === inputs.name.value.toLowerCase()
      );

      if (
        nameIsValid(inputs.name.value) &&
        descriptionIsValid(inputs.description.value) &&
        !doesWorkoutExist
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
        if (doesWorkoutExist) {
          WorkoutAlert(
            "Workout already exists",
            "Please enter a different name."
          );
          setInputs((currentValues) => {
            return {
              ...currentValues,
              username: { value: inputs.name.value, isValid: false },
            };
          });
        }
        return false;
      }
    };

    if (validate()) {
      addNewWorkout();
    }
    return false;
  }

  function addNewWorkout() {
    if (!selectedImage) return;
    setWorkout({
      name: inputs.name.value,
      description: inputs.description.value,
      picture: selectedImage,
      datecreated: new Date(),
    });
    navigation.navigate("AddPhysioWorkoutExercise");
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
        value: "",
        isValid: true,
      },
      description: {
        value: "",
        isValid: true,
      },
    });
    navigation.goBack();
    clearWorkout();
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
        onPress={pickImage}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.placeholder}>
          <Image
            source={
              selectedImage?.uri
                ? { uri: selectedImage?.uri }
                : require("../../../../../assets/Meal.png")
            }
            style={styles.image}
          />
        </View>
      </Pressable>
      <View style={styles.inputContainer}>
        <Input
          isValid={inputs.name.isValid}
          keyboardType="default"
          placeholder={"Name"}
          value={inputs.name.value}
          onUpdateValue={(value: any) => updateInputValueHandler("name", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
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
        <Button
          onPress={cancelHandler}
          style={[styles.button, styles.cancelButton]}
        >
          Cancel
        </Button>
        <Button style={styles.button} onPress={submitHandler}>
          Next
        </Button>
      </View>
    </ScrollView>
  );
}
