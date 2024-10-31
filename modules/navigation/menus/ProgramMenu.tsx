import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
//Workouts
import WorkoutProgramScreen from "../../workout/screens/WorkoutProgramScreen";
import ChallengeScreen from "../../workout/screens/ChallengeScreen";
import ViewWorkoutScreen from "../../workout/screens/ViewWorkoutScreen";
import ViewChallengeScreen from "../../workout/screens/ViewChallengeScreen";
import ViewAllWorkoutScreen from "../../workout/screens/ViewAllWorkoutScreen";
import ViewExerciseScreen from "../../workout/screens/ViewExerciseScreen";
//Meal Plan
import MealScheduleScreen from "../../mealplan/screens/MealScheduleScreen";
import BreakfastScreen from "../../mealplan/screens/BreakfastScreen";
import LunchScreen from "../../mealplan/screens/LunchScreen";
import DinnerScreen from "../../mealplan/screens/DinnerScreen";
import MealScreen from "../../mealplan/screens/MealScreen";
import SnackScreen from "../../mealplan/screens/SnackScreen";

const Bottom = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Top = createMaterialTopTabNavigator();

export default function ProgramBottomTabs() {
  const { theme } = useTheme();
  return (
    <Bottom.Navigator
      sceneContainerStyle={{ backgroundColor: theme.colors.background }}
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        tabBarActiveTintColor: theme.colors.black,
        tabBarStyle: { backgroundColor: theme.colors.senary },
        tabBarIconStyle: { display: "none" },
        tabBarLabelPosition: "below-icon",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: 17.5,
        },
        tabBarActiveBackgroundColor: theme.colors.primary,
        tabBarInactiveBackgroundColor: theme.colors.background,
        tabBarHideOnKeyboard: true,
        tabBarAllowFontScaling: true,
      }}
    >
      <Bottom.Screen
        name="WorkoutProgram"
        component={WorkoutStack}
        options={{ title: "Workouts" }}
      />
      <Bottom.Screen
        name="MealProgram"
        component={MealPlanStack}
        options={{ title: "Meals" }}
      />
    </Bottom.Navigator>
  );
}

/* 
----------------------------------------------------
Workout Stack
---------------------------------------------------- 
*/
function WorkoutStack() {
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
      initialRouteName="WorkoutBottomTabs"
    >
      <Stack.Screen
        name="WorkoutTopTabs"
        component={WorkoutTopTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewAllWorkouts"
        component={ViewAllWorkoutScreen}
        options={{ title: "All Workouts" }}
      />
      <Stack.Screen name="ViewWorkout" component={ViewWorkoutScreen} />
      <Stack.Screen name="ViewExercise" component={ViewExerciseScreen} />
      <Stack.Screen name="ViewChallenge" component={ViewChallengeScreen} />
    </Stack.Navigator>
  );
}

function WorkoutTopTabs() {
  const { theme } = useTheme();
  return (
    <Top.Navigator
      sceneContainerStyle={{ backgroundColor: theme.colors.background }}
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.black,
        tabBarStyle: { backgroundColor: theme.colors.senary },
        tabBarIndicatorStyle: { backgroundColor: theme.colors.black },
      }}
    >
      <Top.Screen name="Program" component={WorkoutProgramScreen} />
      <Top.Screen name="Challenges" component={ChallengeScreen} />
    </Top.Navigator>
  );
}

/* 
----------------------------------------------------
Meal Plan stack
---------------------------------------------------- 
*/

function MealPlanStack() {
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
      <Stack.Screen
        name="MealSchedule"
        component={MealScheduleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Breakfast" component={BreakfastScreen} />
      <Stack.Screen name="Lunch" component={LunchScreen} />
      <Stack.Screen name="Dinner" component={DinnerScreen} />
      <Stack.Screen name="Meal" component={MealScreen} />
      <Stack.Screen name="Snack" component={SnackScreen} />
    </Stack.Navigator>
  );
}
