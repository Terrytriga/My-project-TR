import { useTheme } from "@rneui/themed";
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
import { useState } from "react";
import { supabase } from "../../../../lib/SupaBase";
import { decode } from "base64-arraybuffer";
import Input from "../../../shared/components/Input";
import { useUserStore } from "../../../../store/UserStore";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianGuideStack } from "../../../navigation/Routes";
import { useDietitianGuideStore } from "../../../../store/CommunityStore";
import Button from "../../../shared/components/Button";

export default function EditDietitianGuideScreen() {
  const isWeb = Platform.OS === "web";
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianGuideStack>>();
  const route =
    useRoute<RouteProp<DietitianGuideStack, "EditDietitianGuide">>();
  const id = route.params.id;
  const { updateGuide, dietitianGuides } = useDietitianGuideStore();
  const guide = dietitianGuides.find((findGuide) => findGuide.id === id);
  const { theme } = useTheme();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset>();
  const [inputs, setInputs] = useState({
    title: {
      value: guide?.title ? guide.title : "",
      isValid: true,
    },
    description: {
      value: guide?.description ? guide.description : "",
      isValid: true,
    },
    content: {
      value: guide?.content ? guide.content : "",
      isValid: true,
    },
  });
  const index = dietitianGuides
    .filter((guide) => guide.user_id === user?.id)
    .sort(
      (a, b) =>
        new Date(a.datecreated).getTime() - new Date(b.datecreated).getTime()
    )
    .findIndex((guide) => guide.id === id);

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
    const filePath = `Guides/Dietitian/${user.id}-GuideID-${index + 1}`;
    const base64 = selectedImage.base64;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Public")
      .upload(filePath, decode(base64!), {
        contentType: selectedImage.mimeType,
      });

    if (uploadError || !uploadData) {
      GuideAlert("Error Uploading", uploadError.message);
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
        GuideAlert(
          "Warning",
          "For best quality, please select an image with a minimum resolution of 1080x1080."
        );
      }
      setSelectedImage(result.assets[0]);
    }
    return;
  };
  const GuideAlert = (title: string, message: string) => {
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
        contentIsValid(inputs.content.value)
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
          GuideAlert("Invalid title", "Please enter a title.");
        }
        if (!descriptionIsValid(inputs.description.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              firstname: { value: inputs.description.value, isValid: false },
            };
          });
          GuideAlert("Invalid description", "Please enter a description.");
        }
        if (!contentIsValid(inputs.content.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              lastname: { value: inputs.content.value, isValid: false },
            };
          });
          GuideAlert("Invalid content", "Please enter valid content.");
        }
        return false;
      }
    };

    if (validate()) {
      await updateTheGuide();
    }
    return false;
  }

  async function updateTheGuide() {
    if (!user || !guide) return;
    setIsLoading(true);

    let pictureurl;
    if (selectedImage) {
      const { error: removeError } = await supabase.storage
        .from("Public")
        .remove([`Guides/Dietitian/${user.id}-GuideID-${index + 1}`]);

      if (removeError) {
        GuideAlert("Error", removeError.message);
        return;
      }
      pictureurl = await uploadImage();
    }

    const { data: updateData, error: updateError } = await supabase
      .from("dietitianguide")
      .update({
        title: inputs.title.value,
        description: inputs.description.value,
        content: inputs.content.value,
        pictureurl: pictureurl ? pictureurl : guide.pictureurl,
      })
      .eq("id", id)
      .select();

    if (updateError) {
      GuideAlert("Error", updateError.message || "An error occurred.");
      setIsLoading(false);
      return;
    }
    updateGuide(updateData[0]);
    setIsEditing(!isEditing);
    GuideAlert("Success", "Guide updated successfully.");
    setIsLoading(false);
  }

  function ConfirmHandler() {
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

  function CancelHandler() {
    setInputs({
      title: {
        value: guide?.title ? guide.title : "",
        isValid: true,
      },
      description: {
        value: guide?.description ? guide.description : "",
        isValid: true,
      },
      content: {
        value: guide?.content ? guide.content : "",
        isValid: true,
      },
    });
    setSelectedImage(undefined);
    setIsEditing(!isEditing);
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
    <ScrollView contentContainerStyle={styles.container}>
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
                : guide?.pictureurl
                ? { uri: guide.pictureurl }
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
      <View style={styles.inputContentContainer}>
        <Input
          disabled={!isEditing}
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
      <View>
        {!isEditing ? (
          <Button onPress={() => setIsEditing(!isEditing)}>Edit</Button>
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              style={[styles.button, styles.cancelButton]}
              onPress={CancelHandler}
            >
              Cancel
            </Button>
            <Button
              style={[styles.button, styles.saveButton]}
              onPress={ConfirmHandler}
            >
              Save
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
