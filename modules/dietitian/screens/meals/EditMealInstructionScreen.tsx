import { Text } from "@rneui/themed";
import { Alert, Platform, StyleSheet, View } from "react-native";
import {
  useEditMealStore,
  useMealFoodStore,
  useMealInstructionStore,
} from "../../../../store/MealStore";
import MealInstructionList from "../../components/meals/MealInstructionList";
import Button from "../../../shared/components/Button";
import CreateMealInstruction from "../../components/meals/CreateMealInstruction";
import { useState } from "react";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import { supabase } from "../../../../lib/SupaBase";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianMealStack } from "../../../navigation/Routes";

export default function EditMealInstructionScreen() {
  const isWeb = Platform.OS === "web";
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianMealStack>>();
  const { mealInstructions, mealFoods, meal } = useEditMealStore();
  const { addMealFood } = useMealFoodStore();
  const { addMealInstruction } = useMealInstructionStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
    },
  });
  function MealAlert(titlel: string, message: string) {
    Alert.alert(titlel, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  }
  async function updateMeal() {
    if (!meal?.meal_id) return;
    setIsLoading(false);
    const updateMealFood = mealFoods
      .filter((mealFood) => !mealFood.mealfood_id)
      .map((mealFood) => ({
        meal_id: mealFood.meal_id,
        food_id: mealFood.food_id,
        quantity: mealFood.quantity,
      }));
    if (updateMealFood.length !== 0) {
      const { data: mealFoodData, error: mealFoodError } = await supabase
        .from("mealfood")
        .insert(updateMealFood)
        .select();
      if (mealFoodError) {
        MealAlert("Error", mealFoodError.message);
        setIsLoading(false);
        return;
      }

      mealFoodData.forEach((mealFood) => {
        addMealFood(mealFood);
      });
    }

    const updateMealInstruction = mealInstructions
      .filter((mealInstruction) => !mealInstruction.mealinstruction_id)
      .map((mealInstruction) => ({
        meal_id: mealInstruction.meal_id,
        instruction: mealInstruction.instruction,
      }));
    if (updateMealInstruction.length !== 0) {
      const { data: mealInstructionData, error: mealInstructionError } =
        await supabase
          .from("mealinstruction")
          .insert(updateMealInstruction)
          .select();
      if (mealInstructionError) {
        MealAlert("Error", mealInstructionError.message);
        setIsLoading(false);
        return;
      }

      mealInstructionData.forEach((mealInstruction) => {
        addMealInstruction(mealInstruction);
      });
    }
    navigation.navigate("ViewMeal", { meal_id: meal.meal_id });
    setIsLoading(false);
  }

  function confirmChanges() {
    if (isWeb) updateMeal();
    Alert.alert("Confirm Changes", "Are you sure you want to save changes?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        style: "default",
        onPress: updateMeal,
      },
    ]);
  }

  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : (
    <View style={styles.container}>
      <Button onPress={confirmChanges}>Finish</Button>
      <MealInstructionList mealInstructions={mealInstructions} />
      <CreateMealInstruction />
    </View>
  );
}
