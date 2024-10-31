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

const Bottom = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Top = createMaterialTopTabNavigator();

/* 
----------------------------------------------------
Workout Stack
---------------------------------------------------- 
*/
export default function WorkoutStack() {
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
      <Bottom.Screen name="Program" component={WorkoutProgramScreen} />
      <Bottom.Screen name="Challenges" component={ChallengeScreen} />
    </Bottom.Navigator>
  );
}
