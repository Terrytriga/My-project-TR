import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
import MealScheduleScreen from "../../mealplan/screens/MealScheduleScreen";
import BreakfastScreen from "../../mealplan/screens/BreakfastScreen";
import LunchScreen from "../../mealplan/screens/LunchScreen";
import DinnerScreen from "../../mealplan/screens/DinnerScreen";
import MealScreen from "../../mealplan/screens/MealScreen";
import SnackScreen from "../../mealplan/screens/SnackScreen";

const Stack = createNativeStackNavigator();
/* 
----------------------------------------------------
Meal Plan stack
---------------------------------------------------- 
*/

export default function MealPlanStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "transparent" },
        headerTintColor: theme.colors.black,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="MealSchedule" component={MealScheduleScreen} />
      <Stack.Screen name="Breakfast" component={BreakfastScreen} />
      <Stack.Screen name="Lunch" component={LunchScreen} />
      <Stack.Screen name="Dinner" component={DinnerScreen} />
      <Stack.Screen name="Meal" component={MealScreen} />
      <Stack.Screen name="Snack" component={SnackScreen} />
    </Stack.Navigator>
  );
}
