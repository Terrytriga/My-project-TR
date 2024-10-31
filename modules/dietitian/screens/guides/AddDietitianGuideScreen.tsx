import { useTheme } from "@rneui/themed";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { supabase } from "../../../../lib/SupaBase";
import { decode } from "base64-arraybuffer";
import Input from "../../../shared/components/Input";
import { useUserStore } from "../../../../store/UserStore";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import Button from "../../../shared/components/Button";
import { useDietitianGuideStore } from "../../../../store/CommunityStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianGuideStack } from "../../../navigation/Routes";

const { width, height } = Dimensions.get("window");

export default function AddDietitianGuideScreen() {
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { addGuide, dietitianGuides } = useDietitianGuideStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<
    ImagePicker.ImagePickerAsset | undefined
  >();
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianGuideStack>>();
  const [inputs, setInputs] = useState({
    title: {
      value: "",
      isValid: true,
    },
    description: {
      value: "",
      isValid: true,
    },
    content: {
      value: "",
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
    if (!selectedImage || !user) return;
    const index =
      dietitianGuides.filter((guide) => guide.user_id === user.id).length + 1;
    const filePath = `Guides/Dietitian/${user.id}-GuideID-${index}`;
    const base64 = selectedImage.base64;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Public")
      .upload(filePath, decode(base64!), {
        contentType: selectedImage.mimeType,
      });

    if (uploadError || !uploadData) {
      guideAlert("Error Uploading", uploadError.message);
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
        guideAlert(
          "Warning",
          "For best quality, please select an image with a minimum resolution of 1080x1080."
        );
      }
      setSelectedImage(result.assets[0]);
    }
    return;
  };
  const guideAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  };
  async function submitHandler() {
    const validate = () => {
      const titleIsValid = (title: string) => {
        return title.length > 0;
      };

      const descriptionIsValid = (description: string) => {
        return description.length > 0;
      };

      const contentIsValid = (content: string) => {
        return content.length > 0;
      };

      if (
        titleIsValid(inputs.title.value) &&
        descriptionIsValid(inputs.description.value) &&
        contentIsValid(inputs.content.value) &&
        selectedImage
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
          guideAlert("Invalid title", "Please enter a title.");
        }
        if (!descriptionIsValid(inputs.description.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              firstname: { value: inputs.description.value, isValid: false },
            };
          });
          guideAlert("Invalid description", "Please enter a description.");
        }
        if (!contentIsValid(inputs.content.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              lastname: { value: inputs.content.value, isValid: false },
            };
          });
          guideAlert("Invalid content", "Please enter valid content.");
        }
        if (!selectedImage) {
          guideAlert("No image selected", "Please select an image.");
        }
        return false;
      }
    };

    if (validate()) {
      await addNewGuide();
    }
    return false;
  }

  async function addNewGuide() {
    if (!user) return;
    setIsLoading(true);
    const pictureurl = await uploadImage();
    if (!pictureurl) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("dietitianguide")
      .insert([
        {
          user_id: user.id,
          title: inputs.title.value,
          description: inputs.description.value,
          content: inputs.content.value,
          pictureurl: pictureurl,
          datecreated: new Date(),
        },
      ])
      .select();

    if (error) {
      guideAlert("Error", error.message || "An error occurred.");
      setIsLoading(false);
      return;
    }
    addGuide(data[0]);
    guideAlert("Success", "Guide added successfully.");
    navigation.navigate("DietitianGuides");
    setIsLoading(false);
  }

  function confirmHandler() {
    Alert.alert("Add Guide", "Are you sure you want to add the guide?", [
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
    inputContentContainer: {
      marginVertical: 5,
      width: Platform.OS !== "web" ? "100%" : "50%",
      alignItems: "center",
      justifyContent: "center",
      padding: 5,
    },
    contentContainer: {
      width: "100%",
      padding: 10,
    },
    contentInput: {
      marginVertical: 5,
      // minHeight: height,
      width: "100%",
    },
    pressable: {
      paddingVertical: 20,
      alignItems: "center",
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : (
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
          keyboardType="default"
          placeholder={"Title"}
          value={inputs.title.value}
          onUpdateValue={(value: any) =>
            updateInputValueHandler("title", value)
          }
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
      <View style={styles.inputContentContainer}>
        <Input
          isValid={inputs.content.isValid}
          keyboardType="default"
          placeholder={"Content"}
          value={inputs.content.value}
          onUpdateValue={(value: any) =>
            updateInputValueHandler("content", value)
          }
          multiLine={true}
        />
      </View>
      <Button onPress={confirmHandler}>Add Guide</Button>
    </ScrollView>
  );
}
