import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
//Workouts
import PhysioWorkoutScreen from "../../physio/screens/workouts/workout/PhysioWorkoutScreen";
import AddPhysioWorkoutScreen from "../../physio/screens/workouts/workout/AddPhysioWorkoutScreen";
import EditPhysioWorkoutScreen from "../../physio/screens/workouts/workout/EditPhysioWorkoutScreen";
import ViewPhysioWorkoutScreen from "../../physio/screens/workouts/workout/ViewPhysioWorkoutScreen";
import AddPhysioWorkoutExerciseScreen from "../../physio/screens/workouts/workout/AddPhysioWorkoutExerciseScreen";
import AddPhysioExerciseToWorkoutScreen from "../../physio/screens/workouts/workout/AddPhysioExerciseToWorkoutScreen";
import ViewPhysioWorkoutExerciseScreen from "../../physio/screens/workouts/workout/ViewPhysioWorkoutExerciseScreen";
import EditPhysioWorkoutExerciseScreen from "../../physio/screens/workouts/workout/EditPhysioWorkoutExerciseScreen";
//Bodypart
import PhysioBodyPartScreen from "../../physio/screens/workouts/bodypart/PhysioBodyPartScreen";
import AddPhysioBodyPartScreen from "../../physio/screens/workouts/bodypart/AddPhysioBodyPartScreen";
import EditPhysioBodyPartScreen from "../../physio/screens/workouts/bodypart/EditPhysioBodyPartScreen";
import ViewPhysioBodyPartScreen from "../../physio/screens/workouts/bodypart/ViewPhysioBodyPartScreen";
//Exercise
import PhysioExerciseScreen from "../../physio/screens/workouts/exercise/PhysioExerciseScreen";
import AddPhysioExerciseScreen from "../../physio/screens/workouts/exercise/AddPhysioExerciseScreen";
import EditPhysioExerciseScreen from "../../physio/screens/workouts/exercise/EditPhysioExerciseScreen";
import ViewPhysioExerciseScreen from "../../physio/screens/workouts/exercise/ViewPhysioExerciseScreen";
import AddPhysioExerciseInstructionScreen from "../../physio/screens/workouts/exercise/AddPhysioExerciseInstructionScreen";
import EditPhysioExerciseInstructionScreen from "../../physio/screens/workouts/exercise/EditPhysioExerciseInstructionScreen";
import EditPhysioExerciseEquipmentScreen from "../../physio/screens/workouts/exercise/EditPhysioExerciseEquipmentScreen";
import AddPhysioExerciseEquipmentScreen from "../../physio/screens/workouts/exercise/AddPhysioExerciseEquipmentScreen";
import AddPhysioEquipmentToExerciseScreen from "../../physio/screens/workouts/exercise/AddPhysioEquipmentToExerciseScreen";
//Equipment
import PhysioEquipmentScreen from "../../physio/screens/workouts/equipment/PhysioEquipmentScreen";
import AddPhysioEquipmentScreen from "../../physio/screens/workouts/equipment/AddPhysioEquipmentScreen";
import EditPhysioEquipmentScreen from "../../physio/screens/workouts/equipment/EditPhysioEquipmentScreen";
import ViewPhysioEquipmentScreen from "../../physio/screens/workouts/equipment/ViewPhysioEquipmentScreen";
//Guides
import PhysioGuideScreen from "../../physio/screens/guides/PhysioGuideScreen";
import AddPhysioGuideScreen from "../../physio/screens/guides/AddPhysioGuideScreen";
import EditPhysioGuideScreen from "../../physio/screens/guides/EditPhysioGuideScreen";
import ViewPhysioGuideScreen from "../../physio/screens/guides/ViewPhysioGuideScreen";
//Challenges
import PhysioChallengeScreen from "../../physio/screens/challenges/PhysioChallengeScreen";
import AddPhysioChallengeScreen from "../../physio/screens/challenges/AddPhysioChallengeScreen";
import EditPhysioChallengeScreen from "../../physio/screens/challenges/EditPhysioChallengeScreen";
import ViewPhysioChallengeScreen from "../../physio/screens/challenges/ViewPhysioChallengeScreen";
import AddPhysioWorkoutChallengeScreen from "../../physio/screens/challenges/AddPhysioWorkoutChallengeScreen";
import AddPhysioWorkoutToChallengeScreen from "../../physio/screens/challenges/AddPhysioWorkoutToChallengeScreen";
import ViewPhysioWorkoutInChallengeScreen from "../../physio/screens/challenges/ViewPhysioWorkoutInChallengeScreen";
import ViewPhysioExercisesInWorkoutScreen from "../../physio/screens/challenges/ViewPhysioExercisesInWorkoutScreen";
import EditPhysioWorkoutChallengeScreen from "../../physio/screens/challenges/EditPhysioWorkoutChallengeScreen";

const Stack = createNativeStackNavigator();
const Bottom = createBottomTabNavigator();
const Top = createMaterialTopTabNavigator();

/* 
----------------------------------------------------
Physio
---------------------------------------------------- 
*/

export default function PhysioBottomTabs() {
  const { theme } = useTheme();
  return (
    <Bottom.Navigator
      sceneContainerStyle={{ backgroundColor: theme.colors.background }}
      screenOptions={{
        headerShown: false,
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
        name="PhysioWorkoutTopTabs"
        component={PhysioWorkoutTopTabs}
        options={{ title: "Workouts" }}
      />
      <Bottom.Screen
        name="PhysioGuideStack"
        component={PhysioGuideStack}
        options={{ title: "Guides" }}
      />
      <Bottom.Screen
        name="PhysioChallengeStack"
        component={PhysioChallengeStack}
        options={{ title: "Challenges" }}
      />
    </Bottom.Navigator>
  );
}

function PhysioEquipmentStack() {
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
      initialRouteName="PhysioEquipmenmt"
    >
      <Stack.Screen
        name="PhysioEquipment"
        component={PhysioEquipmentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPhysioEquipment"
        component={AddPhysioEquipmentScreen}
        options={{ title: "Add Equipment" }}
      />
      <Stack.Screen
        name="EditPhysioEquipment"
        component={EditPhysioEquipmentScreen}
        options={{ title: "Edit Equipment" }}
      />
      <Stack.Screen
        name="ViewPhysioEquipment"
        component={ViewPhysioEquipmentScreen}
      />
    </Stack.Navigator>
  );
}

function PhysioBodyPartStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "transparent" },
        headerTintColor: theme.colors.black,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
      initialRouteName="PhysioBodyParts"
    >
      <Stack.Screen name="PhysioBodyParts" component={PhysioBodyPartScreen} />
      <Stack.Screen
        name="AddPhysioBodyParts"
        component={AddPhysioBodyPartScreen}
      />
      <Stack.Screen
        name="EditPhysioBodyParts"
        component={EditPhysioBodyPartScreen}
      />
      <Stack.Screen
        name="ViewPhysioBodyParts"
        component={ViewPhysioBodyPartScreen}
      />
    </Stack.Navigator>
  );
}

function PhysioExerciseStack() {
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
      initialRouteName="PhysioExercises"
    >
      <Stack.Screen
        name="PhysioExercises"
        component={PhysioExerciseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPhysioExercises"
        component={AddPhysioExerciseScreen}
        options={{ title: "Add Exercise" }}
      />
      <Stack.Screen
        name="EditPhysioExercises"
        component={EditPhysioExerciseScreen}
        options={{ title: "Edit Exercise" }}
      />
      <Stack.Screen
        name="ViewPhysioExercises"
        component={ViewPhysioExerciseScreen}
      />
      <Stack.Screen
        name="AddPhysioExerciseInstruction"
        component={AddPhysioExerciseInstructionScreen}
        options={{ title: "Add Exercise Instructions" }}
      />
      <Stack.Screen
        name="EditPhysioExerciseInstruction"
        component={EditPhysioExerciseInstructionScreen}
      />
      <Stack.Screen
        name="AddPhysioExerciseEquipment"
        component={AddPhysioExerciseEquipmentScreen}
        options={{ title: "Equipment in Exercise" }}
      />
      <Stack.Screen
        name="EditPhysioExerciseEquipment"
        component={EditPhysioExerciseEquipmentScreen}
        options={{ title: "Equipment in Exercise" }}
      />
      <Stack.Screen
        name="AddPhysioEquipmentToExercise"
        component={AddPhysioEquipmentToExerciseScreen}
        options={{ title: "Add Equipment to Exercise" }}
      />
    </Stack.Navigator>
  );
}

function PhysioWorkoutStack() {
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
      initialRouteName="PhysioWorkouts"
    >
      <Stack.Screen
        name="PhysioWorkouts"
        component={PhysioWorkoutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPhysioWorkout"
        component={AddPhysioWorkoutScreen}
        options={{ title: "Add Workout" }}
      />
      <Stack.Screen
        name="EditPhysioWorkout"
        component={EditPhysioWorkoutScreen}
      />
      <Stack.Screen
        name="ViewPhysioWorkout"
        component={ViewPhysioWorkoutScreen}
      />
      <Stack.Screen
        name="AddPhysioWorkoutExercise"
        component={AddPhysioWorkoutExerciseScreen}
        options={{ title: "Workout Exercises" }}
      />
      <Stack.Screen
        name="EditPhysioWorkoutExercise"
        component={EditPhysioWorkoutExerciseScreen}
        options={{ title: "Workout Exercises" }}
      />
      <Stack.Screen
        name="AddPhysioExerciseToWorkout"
        component={AddPhysioExerciseToWorkoutScreen}
        options={{ title: "Add Exercise to Workout" }}
      />

      <Stack.Screen
        name="ViewPhysioWorkoutExercise"
        component={ViewPhysioWorkoutExerciseScreen}
      />
    </Stack.Navigator>
  );
}

function PhysioWorkoutTopTabs() {
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
      <Top.Screen
        name="PhysioWorkoutStack"
        component={PhysioWorkoutStack}
        options={{ title: "Workout" }}
      />
      <Top.Screen
        name="PhysioExerciseStack"
        component={PhysioExerciseStack}
        options={{ title: "Exercise" }}
      />
      <Top.Screen
        name="PhysioEquipmentStack"
        component={PhysioEquipmentStack}
        options={{ title: "Equipment" }}
      />
      {/* <Top.Screen
        name="PhysioBodyPartStack"
        component={PhysioBodyPartStack}
        options={{ title: "Bodyparts" }}
      /> */}
    </Top.Navigator>
  );
}

function PhysioGuideStack() {
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
      initialRouteName="PhysioGuides"
    >
      <Stack.Screen
        name="PhysioGuides"
        component={PhysioGuideScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AddPhysioGuides" component={AddPhysioGuideScreen} />
      <Stack.Screen name="EditPhysioGuides" component={EditPhysioGuideScreen} />
      <Stack.Screen name="ViewPhysioGuides" component={ViewPhysioGuideScreen} />
    </Stack.Navigator>
  );
}

function PhysioChallengeStack() {
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
      initialRouteName="PhysioChallenges"
    >
      <Stack.Screen
        name="PhysioChallenges"
        component={PhysioChallengeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPhysioChallenge"
        component={AddPhysioChallengeScreen}
      />
      <Stack.Screen
        name="AddPhysioWorkoutChallenge"
        component={AddPhysioWorkoutChallengeScreen}
        options={{ title: "Workouts in Challenge" }}
      />
      <Stack.Screen
        name="AddPhysioWorkoutToChallenge"
        component={AddPhysioWorkoutToChallengeScreen}
        options={{ title: "Add Workout to Challenge" }}
      />
      <Stack.Screen
        name="EditPhysioChallenge"
        component={EditPhysioChallengeScreen}
        options={{ title: "Edit Challenge" }}
      />
      <Stack.Screen
        name="EditPhysioWorkoutChallenge"
        component={EditPhysioWorkoutChallengeScreen}
        options={{ title: "Edit Workouts in Challenge" }}
      />
      <Stack.Screen
        name="ViewPhysioChallenge"
        component={ViewPhysioChallengeScreen}
      />
      <Stack.Screen
        name="ViewPhysioWorkoutInChallenge"
        component={ViewPhysioWorkoutInChallengeScreen}
      />
      <Stack.Screen
        name="ViewPhysioExercisesInWorkout"
        component={ViewPhysioExercisesInWorkoutScreen}
      />
    </Stack.Navigator>
  );
}
