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
import Button from "../../../../shared/components/Button";
import Input from "../../../../shared/components/Input";
import { supabase } from "../../../../../lib/SupaBase";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioEquipmentStack } from "../../../../navigation/Routes";
import { useTheme } from "@rneui/themed";
import { useState } from "react";
import { useEquipmentStore } from "../../../../../store/WorkoutStore";
import { decode } from "base64-arraybuffer";

export default function EditPhysioEquipmentScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { equipments, updateEquipment } = useEquipmentStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const route =
    useRoute<RouteProp<PhysioEquipmentStack, "EditPhysioEquipment">>();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioEquipmentStack>>();
  const id = route.params.id;
  const equipment = equipments.find((e) => e.id === id);

  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>();

  const [inputs, setInputs] = useState({
    name: {
      value: equipment?.name ? equipment.name : "",
      isValid: true,
    },
    description: {
      value: equipment?.description ? equipment.description : "",
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
    if (!equipment || !selectedImage) return;
    const removeSpaces = equipment.name.replace(/\s/g, "");
    const filePath = `Equipment/${removeSpaces}`;
    const base64 = selectedImage.base64;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Public")
      .upload(filePath, decode(base64!), {
        contentType: selectedImage.mimeType,
      });

    if (uploadError || !uploadData) {
      EquipmentAlert("Error Uploading", uploadError.message);
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
        EquipmentAlert(
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
          EquipmentAlert("Invalid name", "Please enter a name.");
        }
        if (!descriptionIsValid(inputs.description.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              firstname: { value: inputs.description.value, isValid: false },
            };
          });
          EquipmentAlert("Invalid description", "Please enter a description.");
        }
        return false;
      }
    };

    if (validate()) {
      await updateExistingEquipment();
    }
    return false;
  }

  async function updateExistingEquipment() {
    if (!equipment) return;
    setIsLoading(true);
    let pictureurl;
    if (selectedImage) {
      const removeSpaces = equipment.name.replace(/\s/g, "");
      const { error: removeError } = await supabase.storage
        .from("Public")
        .remove([`Equipment/${removeSpaces}`]);

      if (removeError) {
        EquipmentAlert("Error", removeError.message);
        return;
      }
      pictureurl = await uploadImage();
    }

    const { data: equipmentData, error: equipmentError } = await supabase
      .from("equipment")
      .update({
        name: inputs.name.value,
        description: inputs.description.value,
        pictureurl: pictureurl ? pictureurl : equipment.pictureurl,
      })
      .eq("id", id)
      .select();

    if (equipmentError) {
      EquipmentAlert("Error", equipmentError.message);
      setIsLoading(false);
      return;
    }
    updateEquipment(equipmentData[0]);
    navigation.navigate("PhysioEquipment");
  }

  const EquipmentAlert = (title: string, message: string) => {
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
        value: equipment?.name ? equipment.name : "",
        isValid: true,
      },
      description: {
        value: equipment?.description ? equipment.description : "",
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
    descriptionContainer: {
      height: 100,
      width: "90%",
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
                : equipment?.pictureurl
                ? { uri: equipment.pictureurl }
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
          containerStyle={styles.descriptionContainer}
          multiLine={true}
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
        {isEditing && (
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
