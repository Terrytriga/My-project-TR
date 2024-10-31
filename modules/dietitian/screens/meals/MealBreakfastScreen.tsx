import { StyleSheet, View } from "react-native";
import { useMealStore, useMealTypeStore } from "../../../../store/MealStore";
import { useEffect, useState } from "react";
import { Meal } from "../../../../utils/Types";
import MealList from "../../components/meals/MealList";
import FloatingButton from "../../../shared/components/FloatingButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianMealStack } from "../../../navigation/Routes";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MealBreakfastScreen() {
  const { meals } = useMealStore();
  const { mealTypes } = useMealTypeStore();
  const [breakfastMeals, setBreakfastMeals] = useState<Meal[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianMealStack>>();
  useEffect(() => {
    if (!mealTypes) return;
    setBreakfastMeals(
      meals.filter((meal) => {
        return (
          meal.mealtype_id ===
          mealTypes.find((mealType) => mealType.mealtype === "Breakfast")
            ?.mealtype_id
        );
      })
    );
  }, [meals]);

  function navigationHandler() {
    navigation.navigate("AddMeal");
  }
  const style = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return (
    <View style={style.container}>
      <MealList meals={breakfastMeals} />
      <FloatingButton icon={"add-circle-outline"} onPress={navigationHandler} />
    </View>
  );
}
