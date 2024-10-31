import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
import HomeScreen from "../../home/screens/HomeScreen";
import SelectTrackingScreen from "../../home/screens/SelectTrackingScreen";
import SelectGoalScreen from "../../home/screens/SelectGoalScreen";
import TrackingSleepScreen from "../../home/screens/TrackingSleepScreen";
import TrackingWaterScreen from "../../home/screens/TrackingWaterScreen";
import TrackingStepScreen from "../../home/screens/TrackingStepScreen";
import TrackingWorkoutScreen from "../../home/screens/TrackingWorkoutScreen";
import TrackingMealScreen from "../../home/screens/TrackingMealScreen";
import TrackingCycleScreen from "../../home/screens/TrackingCycleScreen";
import TrackingToDoScreen from "../../home/screens/TrackingToDoScreen";
import SetSleepGoalScreen from "../../home/screens/SetSleepGoalScreen";
import SetCaloryGoalScreen from "../../home/screens/SetCaloryGoalScreen";
import SetStepsGoalScreen from "../../home/screens/SetStepsGoalScreen";
import SetWaterGoalScreen from "../../home/screens/SetWaterGoalScreen";
import SetWorkoutGoalScreen from "../../home/screens/SetWorkoutGoalScreen";
import AddTrackingCycleScreen from "../../home/screens/AddTrackingCycleScreen";
import EditTrackingCycleScreen from "../../home/screens/EditTrackingCycleScreen";
import { Platform } from "react-native";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTintColor: theme.colors.black,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.colors.background },
        headerTransparent: true,
      }}
      initialRouteName="Home"
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectTracking"
        component={SelectTrackingScreen}
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="SelectGoal"
        component={SelectGoalScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="TrackingSleep"
        component={TrackingSleepScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="TrackingWater"
        component={TrackingWaterScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="TrackingSteps"
        component={TrackingStepScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="TrackingWorkouts"
        component={TrackingWorkoutScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="TrackingMeals"
        component={TrackingMealScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="TrackingCycle"
        component={TrackingCycleScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="AddTrackingCycle"
        component={AddTrackingCycleScreen}
        options={{
          title: "Add Cycle Tracking",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="EditTrackingCycle"
        component={EditTrackingCycleScreen}
        options={{
          title: "Update Cycle Tracking",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="TrackingToDo"
        component={TrackingToDoScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="SetSleepGoal"
        component={SetSleepGoalScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_right",
          headerStyle: { backgroundColor: "transparent" },
        }}
      />
      <Stack.Screen
        name="SetCaloryGoal"
        component={SetCaloryGoalScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="SetStepsGoal"
        component={SetStepsGoalScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="SetWaterGoal"
        component={SetWaterGoalScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="SetWorkoutGoal"
        component={SetWorkoutGoalScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_right",
        }}
      />
    </Stack.Navigator>
  );
}
