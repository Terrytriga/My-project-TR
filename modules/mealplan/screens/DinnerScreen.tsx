import { View } from "react-native";
import { Text } from "@rneui/themed";
import { useMealStore } from "../../../store/MealStore";
import { useMealTypeStore } from "../../../store/MealStore";
import { useEffect, useState } from "react";
import { Meal } from "../../../utils/Types";
import MealList from "../components/MealList";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MealPlanStackRoutes } from "../../navigation/Routes";

export default function DinnerScreen() {
  const route = useRoute<RouteProp<MealPlanStackRoutes, "Breakfast">>();
  const date = route.params?.date ? new Date(route.params.date) : undefined;
  const { meals } = useMealStore();
  const { mealTypes } = useMealTypeStore();
  const [breakfasts, setBreakfasts] = useState<Meal[]>([]);
  useEffect(() => {
    if (mealTypes && meals)
      setBreakfasts(
        meals.filter((meal) => meal.mealtype_id === mealTypes[2].mealtype_id)
      );
  }, [meals]);

  return (
    <View>
      <MealList date={date} meals={breakfasts} />
    </View>
  );
}
