import { Alert, Platform, StyleSheet, View } from "react-native";
import MealInstructionList from "../../components/meals/MealInstructionList";
import {
  useMealFoodStore,
  useMealInstructionStore,
  useMealStore,
  useMealTypeStore,
  useNewMealStore,
} from "../../../../store/MealStore";
import CreateMealInstruction from "../../components/meals/CreateMealInstruction";
import Button from "../../../shared/components/Button";
import { supabase } from "../../../../lib/SupaBase";
import { decode } from "base64-arraybuffer";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { DietitianMealStack } from "../../../navigation/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";

export default function AddMealInstructionScreen() {
  const isWeb = Platform.OS === "web";
  const { meal, mealFoods, mealInstructions, clearMeal } = useNewMealStore();
  const { addMeal } = useMealStore();
  const { addMealFood } = useMealFoodStore();
  const { addMealInstruction } = useMealInstructionStore();
  const { mealTypes } = useMealTypeStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianMealStack>>();

  function mealAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
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
    if (!meal) return;
    const mealType = mealTypes.find(
      (type) => type.mealtype_id === meal.mealtype_id
    );
    const filePath = `Meals/${mealType?.mealtype}/${meal.name}`;
    const base64 = meal.picture.base64;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Public")
      .upload(filePath, decode(base64!), {
        contentType: meal.picture.mimeType,
      });

    if (uploadError || !uploadData) {
      mealAlert("Error Uploading", uploadError.message);
      return;
    }

    return await getPublicUrl(uploadData.path);
  };

  function confirmFinish() {
    if (isWeb) submitHandler();
    if (mealInstructions.length <= 2)
      mealAlert("Too few instructions", "Please add at least 3 instructions.");

    Alert.alert(
      "Confirm Meal Finish",
      "Are you sure you want to add this meal?",
      [
        {
          text: "No",
          style: "destructive",
        },
        {
          text: "Yes",
          style: "default",
          onPress: () => submitHandler(),
        },
      ]
    );
  }

  async function submitHandler() {
    if (!meal || mealFoods.length == 0 || mealInstructions.length == 0) return;
    const pictureurl = await uploadImage();
    const { data: mealData, error: mealError } = await supabase
      .from("meal")
      .insert([
        {
          mealtype_id: meal.mealtype_id,
          description: meal.description,
          name: meal.name,
          price: meal.price,
          pictureurl: pictureurl,
        },
      ])
      .select();
    if (mealError) {
      setIsLoading(false);
      mealAlert("Error Meal", mealError.message);
      return;
    }
    addMeal(mealData[0]);

    const newMealFoods = mealFoods.map((mealFood) => {
      return {
        meal_id: mealData[0].meal_id,
        food_id: mealFood.food_id,
        quantity: mealFood.quantity,
      };
    });

    const { data: mealFoodData, error: mealFoodError } = await supabase
      .from("mealfood")
      .insert(newMealFoods)
      .select();
    if (mealFoodError) {
      setIsLoading(false);
      mealAlert("Error MealFood", mealFoodError.message);
      return;
    }
    mealFoodData.forEach((data) => addMealFood(data));

    const newMealInstructions = mealInstructions.map((mealInstruction) => {
      return {
        meal_id: mealData[0].meal_id,
        instruction: mealInstruction.instruction,
      };
    });

    const { data: instructionData, error: instructionError } = await supabase
      .from("mealinstruction")
      .insert(newMealInstructions)
      .select();
    if (instructionError) {
      setIsLoading(false);
      mealAlert("Error Instruction", instructionError.message);
      return;
    }
    instructionData.forEach((mealInstructions) =>
      addMealInstruction(mealInstructions)
    );
    mealAlert("Meal Added", "Your meal has been added successfully.");
    clearMeal();
    navigation.navigate("Meals");
    setIsLoading(false);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
    },
  });
  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : (
    <View style={styles.container}>
      <Button onPress={confirmFinish}>Finish</Button>
      <MealInstructionList mealInstructions={mealInstructions} />
      <CreateMealInstruction />
    </View>
  );
}
