import { useTheme } from "@rneui/themed";
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
import { useState } from "react";
import {
  useEditMealStore,
  useMealStore,
  useMealTypeStore,
} from "../../../../store/MealStore";
import { Picker } from "@react-native-picker/picker";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianMealStack } from "../../../navigation/Routes";
import { supabase } from "../../../../lib/SupaBase";
import { decode } from "base64-arraybuffer";

export default function EditMealScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { updateMeal } = useMealStore();
  const { mealTypes } = useMealTypeStore();
  const { meal } = useEditMealStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianMealStack>>();
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>();
  const mealType = mealTypes?.find(
    (mealType) => mealType.mealtype_id === meal?.mealtype_id
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedMealType, setSelectedMealType] = useState<string>();
  const [inputs, setInputs] = useState({
    description: {
      value: meal?.description ? meal.description : "",
      isValid: true,
    },
    price: {
      value: meal?.price ? meal.price : 0,
      isValid: true,
    },
    name: {
      value: meal?.name ? meal.name : "",
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
    if (!meal || !selectedImage) return;
    const mealType = mealTypes.find(
      (type) => type.mealtype_id === meal.mealtype_id
    );
    const filePath = `Meals/${mealType?.mealtype}/${meal.name}`;
    const base64 = selectedImage.base64;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Public")
      .upload(filePath, decode(base64!), {
        contentType: selectedImage.mimeType,
      });

    if (uploadError || !uploadData) {
      mealAlert("Error Uploading", uploadError.message);
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
        mealAlert(
          "Warning",
          "For best quality, please select an image with a minimum resolution of 1080x1080."
        );
      }
      setSelectedImage(result.assets[0]);
    }
    return;
  };

  function selectMealType(selected: string) {
    setSelectedMealType(selected);
  }

  const mealAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  };

  async function submitHandler() {
    const validate = () => {
      const nameIsValid = (name: string) => {
        return name.length > 0;
      };

      const descriptionIsValid = (description: string) => {
        return description.length > 0;
      };

      const priceIsValid = (pirce: number) => {
        return pirce > 0;
      };

      if (
        nameIsValid(inputs.name.value) &&
        descriptionIsValid(inputs.description.value) &&
        priceIsValid(inputs.price.value)
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
          mealAlert("Invalid name", "Please enter a name.");
        }
        if (!descriptionIsValid(inputs.description.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              firstname: { value: inputs.description.value, isValid: false },
            };
          });
          mealAlert("Invalid description", "Please enter a description.");
        }
        if (!priceIsValid(inputs.price.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              lastname: { value: inputs.price.value, isValid: false },
            };
          });
          mealAlert("Invalid price", "Please enter a valid price.");
        }
        return false;
      }
    };

    if (validate()) {
      await updateExistingMeal();
    }
    return false;
  }

  async function updateExistingMeal() {
    setIsLoading(true);
    if (!mealType || !meal) return;

    let pictureurl;
    if (selectedImage) {
      const { error: removeError } = await supabase.storage
        .from("Public")
        .remove([`Meals/${mealType.mealtype}/${meal.name}`]);

      if (removeError) {
        mealAlert("Error", removeError.message);
        return;
      }
      pictureurl = await uploadImage();
    }

    let newMealType = null;
    if (
      selectedMealType &&
      selectedMealType !== mealType.mealtype &&
      selectedMealType.length !== 0
    ) {
      newMealType = mealTypes.find(
        (mealType) => mealType.mealtype === selectedMealType
      );
    }
    const { data: mealData, error: mealError } = await supabase
      .from("meal")
      .update({
        mealtype_id: newMealType ? newMealType.mealtype_id : meal.mealtype_id,
        description: inputs.description.value,
        name: inputs.name.value,
        price: inputs.price.value,
        pictureurl: pictureurl ? pictureurl : meal.pictureurl,
      })
      .eq("meal_id", meal.meal_id)
      .select();

    if (mealError) {
      mealAlert("Error", mealError.message);
      setIsLoading(false);
      return;
    }
    updateMeal(mealData[0]);
    mealAlert("Success", "Meal updated successfully.");
    setIsEditing(!isEditing);
    setIsLoading(false);
  }

  function cancelHandler() {
    setInputs({
      description: {
        value: meal?.description ? meal.description : "",
        isValid: true,
      },
      price: {
        value: meal?.price ? meal.price : 0,
        isValid: true,
      },
      name: {
        value: meal?.name ? meal.name : "",
        isValid: true,
      },
    });
    setSelectedImage(null);
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
      width: !isWeb ? "100%" : "25%",
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
                : meal?.pictureurl
                ? { uri: meal.pictureurl }
                : require("../../../../assets/Meal.png")
            }
            style={styles.image}
          />
        </View>
      </Pressable>

      <Picker
        enabled={isEditing}
        style={{
          width: !isWeb ? "50%" : "25%",
          height: 50,
          color: theme.colors.black,
        }}
        itemStyle={{ color: theme.colors.black }}
        dropdownIconColor={theme.colors.primary}
        selectedValue={selectedMealType}
        onValueChange={(itemValue) => selectMealType(itemValue)}
        prompt="Select Meal Type"
      >
        {mealTypes &&
          mealTypes.map((mealType) => (
            <Picker.Item
              key={mealType.mealtype}
              label={mealType.mealtype}
              value={mealType.mealtype}
            />
          ))}
      </Picker>
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
      <View style={styles.inputContainer}>
        <Input
          disabled={!isEditing}
          isValid={inputs.price.isValid}
          keyboardType="number-pad"
          placeholder={"Price"}
          value={inputs.price.value.toString()}
          onUpdateValue={(value: any) =>
            updateInputValueHandler("price", value)
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
            "Cancel"
          </Button>
        )}
        {!isEditing ? (
          <Button
            style={styles.button}
            onPress={() => navigation.navigate("EditMealFood")}
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
