import { Text, useTheme } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import {
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
  useNewChallengeStore,
} from "../../../../store/WorkoutStore";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioChallengeStack } from "../../../navigation/Routes";

export default function AddPhysioChallengeScreen() {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioChallengeStack>>();
  const { challenges } = useChallengeStore();
  const { challenge, setChallenge, clearChallenge } = useNewChallengeStore();
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(
      challenge?.picture ? challenge.picture : null
    );

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
    if (!selectedImage) {
      ChallengeAlert("No Image", "Please select an image for the challenge.");
      return;
    }
    const validate = () => {
      const titleIsValid = (title: string) => {
        return title.length > 0;
      };

      const descriptionIsValid = (description: string) => {
        return description.length > 0;
      };

      const doesChallengeExist = challenges.some(
        (challenge) =>
          challenge.title.toLowerCase() === inputs.title.value.toLowerCase()
      );

      if (
        titleIsValid(inputs.title.value) &&
        descriptionIsValid(inputs.description.value) &&
        !doesChallengeExist
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
        if (doesChallengeExist) {
          ChallengeAlert(
            "Challenge already exists",
            "Please enter a different title."
          );
          setInputs((currentValues) => {
            return {
              ...currentValues,
              username: { value: inputs.title.value, isValid: false },
            };
          });
        }
        return false;
      }
    };

    if (validate()) {
      addChallenge();
    }
    return false;
  }

  function addChallenge() {
    if (!selectedImage) return;
    setChallenge({
      title: inputs.title.value,
      description: inputs.description.value,
      picture: selectedImage,
      datecreated: new Date(),
    });
    navigation.navigate("AddPhysioWorkoutChallenge");
  }

  function cancelHandler() {
    setInputs({
      title: {
        value: "",
        isValid: true,
      },
      description: {
        value: "",
        isValid: true,
      },
    });
    navigation.goBack();
    clearChallenge();
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
        onPress={pickImage}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.placeholder}>
          <Image
            source={
              selectedImage?.uri
                ? { uri: selectedImage?.uri }
                : require("../../../../assets/Meal.png")
            }
            style={styles.image}
          />
        </View>
      </Pressable>
      <View style={styles.inputContainer}>
        <Input
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
