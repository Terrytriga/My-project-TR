import { Text, useTheme } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
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
import {
  useChallengeStore,
  useEditChallengeStore,
} from "../../../../store/WorkoutStore";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioChallengeStack } from "../../../navigation/Routes";
import { supabase } from "../../../../lib/SupaBase";
import { decode } from "base64-arraybuffer";

export default function EditPhysioChallengeScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioChallengeStack>>();
  const { updateChallenge } = useChallengeStore();
  const { challenge, setChallenge } = useEditChallengeStore();
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>();

  const [inputs, setInputs] = useState({
    title: {
      value: challenge?.title ? challenge.title : "",
      isValid: true,
    },
    description: {
      value: challenge?.description ? challenge.description : "",
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
    if (!challenge || !selectedImage) return;
    const removeSpaces = challenge.title.replace(/\s/g, "");
    const filePath = `Challenges/${removeSpaces}`;
    const base64 = selectedImage.base64;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Public")
      .upload(filePath, decode(base64!), {
        contentType: selectedImage.mimeType,
      });

    if (uploadError || !uploadData) {
      ChallengeAlert("Error Uploading", uploadError.message);
      return;
    }

    return await getPublicUrl(uploadData.path);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

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
        ChallengeAlert(
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
      const titleIsValid = (title: string) => {
        return title.length > 0;
      };

      const descriptionIsValid = (description: string) => {
        return description.length > 0;
      };

      if (
        titleIsValid(inputs.title.value) &&
        descriptionIsValid(inputs.description.value)
      ) {
        return true;
      } else {
        if (!titleIsValid(inputs.title.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              username: { value: inputs.title.value, isValid: false },
            };
          });
          ChallengeAlert("Invalid name", "Please enter a name.");
        }
        if (!descriptionIsValid(inputs.description.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              firstname: { value: inputs.description.value, isValid: false },
            };
          });
          ChallengeAlert("Invalid description", "Please enter a description.");
        }
        return false;
      }
    };

    if (validate()) {
      updateTheChallenge();
    }
    return false;
  }

  async function updateTheChallenge() {
    if (!challenge) return;
    setIsLoading(true);
    let pictureurl;
    if (selectedImage) {
      const removeSpaces = challenge.title.replace(/\s/g, "");
      const { error: removeError } = await supabase.storage
        .from("Public")
        .remove([`Challenges/${removeSpaces}`]);

      if (removeError) {
        ChallengeAlert("Error", removeError.message);
        setIsLoading(false);
        return;
      }
      pictureurl = await uploadImage();
    }

    const { data: challengeData, error: challengeError } = await supabase
      .from("challenge")
      .update({
        title: inputs.title.value,
        description: inputs.description.value,
        pictureurl: selectedImage ? pictureurl : challenge?.pictureurl,
      })
      .eq("id", challenge.id)
      .select("*")
      .single();

    if (challengeError) {
      ChallengeAlert("Error", challengeError.message);
      setIsLoading(false);
      return;
    }

    setChallenge(challengeData);
    updateChallenge(challengeData);
    setIsEditing(false);
    setIsLoading(false);
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

  function cancelHandler() {
    setInputs({
      title: {
        value: challenge ? challenge.title : "",
        isValid: true,
      },
      description: {
        value: challenge ? challenge.description : "",
        isValid: true,
      },
    });
    setSelectedImage(null);
  }

  const ChallengeAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  };

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
      padding: 5,
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
                : challenge?.pictureurl
                ? { uri: challenge.pictureurl }
                : require("../../../../assets/Meal.png")
            }
            style={styles.image}
          />
        </View>
      </Pressable>
      <View style={styles.inputContainer}>
        <Input
          disabled={!isEditing}
          isValid={inputs.title.isValid}
          value={inputs.title.value}
          keyboardType="default"
          placeholder={"Title"}
          onUpdateValue={(value: any) =>
            updateInputValueHandler("title", value)
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          disabled={!isEditing}
          isValid={inputs.description.isValid}
          value={inputs.description.value}
          keyboardType="default"
          placeholder={"Description"}
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
            onPress={() => navigation.navigate("EditPhysioWorkoutChallenge")}
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
