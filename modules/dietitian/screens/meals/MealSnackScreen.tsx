import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { useMealStore, useMealTypeStore } from "../../../../store/MealStore";
import { useEffect, useState } from "react";
import { Meal } from "../../../../utils/Types";
import MealList from "../../components/meals/MealList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { DietitianMealStack } from "../../../navigation/Routes";
import FloatingButton from "../../../shared/components/FloatingButton";

export default function MealSnackScreen() {
  const { meals } = useMealStore();
  const { mealTypes } = useMealTypeStore();
  const [snackMeals, setSnackMeals] = useState<Meal[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianMealStack>>();
  useEffect(() => {
    if (!mealTypes) return;
    setSnackMeals(
      meals.filter((meal) => {
        return (
          meal.mealtype_id ===
          mealTypes.find((mealType) => mealType.mealtype === "Snack")
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
      <MealList meals={snackMeals} />
      <FloatingButton icon={"add-circle-outline"} onPress={navigationHandler} />
    </View>
  );
}
