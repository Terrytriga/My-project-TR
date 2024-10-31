import { Text, useTheme } from "@rneui/themed";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import MealPlanItem from "./MealPlanItem";
import { useMealPlanStore } from "../../../store/MealStore";
import { useEffect, useState } from "react";
import { Meal, MealPlan } from "../../../utils/Types";
import { useMealStore } from "../../../store/MealStore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MealPlanStackRoutes } from "../../navigation/Routes";

const { width } = Dimensions.get("window");
export default function MealPlans({ name, date, type }: any) {
  const isWeb = Platform.OS === "web";
  const navigation =
    useNavigation<NativeStackNavigationProp<MealPlanStackRoutes>>();
  const { theme } = useTheme();
  const { mealPlans } = useMealPlanStore();
  const { meals } = useMealStore();
  const [filteredMealPlans, setFilteredMealPlans] = useState<MealPlan[]>([]);
  const [mealPlanMeals, setMealPlanMeals] = useState<Meal[]>([]);

  useEffect(() => {
    if (mealPlans) {
      const compareDate = new Date(date);
      const filtered = mealPlans.filter((mealPlan) => {
        const mealPlanDate = new Date(mealPlan.mealtime);
        return (
          mealPlanDate.getDate() === compareDate.getDate() &&
          mealPlanDate.getMonth() === compareDate.getMonth() &&
          mealPlanDate.getFullYear() === compareDate.getFullYear()
        );
      });
      setFilteredMealPlans(filtered);
    } else {
      setFilteredMealPlans([]);
    }
  }, [mealPlans, date]);

  useEffect(() => {
    if (filteredMealPlans.length > 0) {
      const mealsForPlans = filteredMealPlans
        .map((mealPlan) =>
          meals.find((meal) => meal.meal_id === mealPlan.meal_id)
        )
        .filter((meal) => meal?.mealtype_id === type) as Meal[];
      setMealPlanMeals(mealsForPlans);
    } else {
      setMealPlanMeals([]);
    }
  }, [filteredMealPlans, meals]);

  function navigateMealList() {
    if (type === 1) navigation.navigate("Breakfast", { date: date.toString() });
    if (type === 2) navigation.navigate("Lunch", { date: date.toString() });
    if (type === 3) navigation.navigate("Dinner", { date: date.toString() });
    if (type === 4) navigation.navigate("Snack", { date: date.toString() });
  }

  function navigateMeal(meal: Meal) {
    const mealPlan_id = filteredMealPlans.find(
      (mealPlan) => mealPlan.meal_id === meal.meal_id
    )?.mealplan_id;
    navigation.navigate("Meal", {
      meal,
      date: date.toString(),
      mealplan_id: mealPlan_id,
    });
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      flexDirection: "column",
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
      minHeight: isWeb ? 230 : undefined,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    titleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: Platform.OS !== "web" ? "100%" : 700,
    },
    pressed: {
      opacity: 0.5,
    },
    grid: {
      width: width / 3,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.grid}>
          <Text style={styles.title}>{name}</Text>
        </View>

        {mealPlanMeals.length < 2 && (
          <Pressable
            style={({ pressed }) => [pressed && styles.pressed]}
            onPress={navigateMealList}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={theme.colors.black}
            />
          </Pressable>
        )}
      </View>
      {mealPlanMeals ? (
        mealPlanMeals.map((meal) => {
          const mealTime = new Date(
            filteredMealPlans.find(
              (mealPlan) => mealPlan.meal_id === meal.meal_id
            )?.mealtime!
          );
          const timeOfDay = mealTime.getHours() > 12 ? "PM" : "AM";
          const time = mealTime.getHours() + " " + timeOfDay;
          return (
            <MealPlanItem
              onPress={() => navigateMeal(meal)}
              key={meal.meal_id}
              {...meal}
              time={time}
            />
          );
        })
      ) : (
        <Text>No Meal yet!</Text>
      )}
    </View>
  );
}
