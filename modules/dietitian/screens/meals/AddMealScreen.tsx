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
import { useEffect, useState } from "react";
import {
  useEditMealStore,
  useMealStore,
  useMealTypeStore,
  useNewMealStore,
} from "../../../../store/MealStore";
import { Picker } from "@react-native-picker/picker";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianMealStack } from "../../../navigation/Routes";

export default function AddMealScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { clearMeal: editClearMeal } = useEditMealStore();
  const { setMeal, meal, clearMeal } = useNewMealStore();
  const { meals } = useMealStore();

  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianMealStack>>();
  const route = useRoute<RouteProp<DietitianMealStack, "AddMeal">>();
  const mealtype_id = route.params.mealtype_id;

  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(
      meal?.picture ? meal.picture : null
    );
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  useEffect(() => {
    editClearMeal();
  }, [navigation]);

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
        mealAlert(
          "Warning",
          "For best quality, please select an image with a minimum resolution of 1080x1080."
        );
      }
      setSelectedImage(result.assets[0]);
    }
    return;
  };

  const mealAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  };

  async function submitHandler() {
    if (!selectedImage) {
      mealAlert("No Image", "Please select an image for the meal.");
      return;
    }
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
      const doesMealExist = meals.some(
        (meal) => meal.name.toLowerCase() === inputs.name.value.toLowerCase()
      );

      if (
        nameIsValid(inputs.name.value) &&
        descriptionIsValid(inputs.description.value) &&
        priceIsValid(inputs.price.value) &&
        !doesMealExist
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
        if (doesMealExist) {
          mealAlert("Meal already exists", "Please enter a different name.");
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
      addNewMeal();
    }
    return false;
  }

  function addNewMeal() {
    setIsLoading(true);
    if (!selectedImage) return;

    setMeal({
      mealtype_id: mealtype_id,
      description: inputs.description.value,
      name: inputs.name.value,
      price: inputs.price.value,
      picture: selectedImage,
    });
    navigationHandler();
    setIsLoading(false);
  }

  function cancelHandler() {
    setInputs({
      description: {
        value: "",
        isValid: true,
      },
      price: {
        value: 0,
        isValid: true,
      },
      name: {
        value: "",
        isValid: true,
      },
    });
    navigation.goBack();
    clearMeal();
  }

  function navigationHandler() {
    navigation.navigate("AddMealFood");
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
      <View style={styles.inputContainer}>
        <Input
          isValid={inputs.price.isValid}
          keyboardType="number-pad"
          placeholder={"Price"}
          value={isWeb ? inputs.price.value.toString() : inputs.price.value}
          onUpdateValue={(value: any) =>
            updateInputValueHandler("price", value)
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
          {isLoading ? (
            <ActivityIndicator size={"small"} color={theme.colors.primary} />
          ) : (
            "Next"
          )}
        </Button>
      </View>
    </ScrollView>
  );
}
