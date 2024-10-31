import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
//Foods
import AddFoodScreen from "../../dietitian/screens/foods/AddFoodScreen";
import EditFoodScreen from "../../dietitian/screens/foods/EditFoodScreen";
//Meals
import ViewMealScreen from "../../dietitian/screens/meals/ViewMealScreen";
import EditMealScreen from "../../dietitian/screens/meals/EditMealScreen";
import EditMealFoodScreen from "../../dietitian/screens/meals/EditMealFoodScreen";
import EditMealInstructionScreen from "../../dietitian/screens/meals/EditMealInstructionScreen";
import AddMealScreen from "../../dietitian/screens/meals/AddMealScreen";
import AddMealFoodScreen from "../../dietitian/screens/meals/AddMealFoodScreen";
import AddMealInstructionScreen from "../../dietitian/screens/meals/AddMealInstructionScreen";
//Guides
import DietitianGuideScreen from "../../dietitian/screens/guides/DietitianGuideScreen";
import AddDietitianGuideScreen from "../../dietitian/screens/guides/AddDietitianGuideScreen";
import EditDietitianGuideScreen from "../../dietitian/screens/guides/EditDietitianGuideScreen";
import ViewDietitianGuideScreen from "../../dietitian/screens/guides/ViewDietitianGuideScreen";
import MealScreen from "../../dietitian/screens/meals/MealScreen";
import AddFoodToMealScreen from "../../dietitian/screens/meals/AddFoodToMealScreen";
import FoodScreen from "../../dietitian/screens/foods/FoodScreen";

const Stack = createNativeStackNavigator();
const Bottom = createBottomTabNavigator();
const Top = createMaterialTopTabNavigator();

/* 
----------------------------------------------------
Dietitian
---------------------------------------------------- 
*/

export default function DietitianBottomTabs() {
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
        name="DietitianMealStack"
        component={DietitianMealStack}
        options={{ title: "Meals" }}
      />
      <Bottom.Screen
        name="DietitianFoodStack"
        component={DietitianFoodStack}
        options={{ title: "Foods" }}
      />
      <Bottom.Screen
        name="Guides"
        component={DietitianGuideStack}
        options={{ title: "Guides" }}
      />
    </Bottom.Navigator>
  );
}

// function DietitianFoodTopTabs() {
//   const { theme } = useTheme();

//   return (
//     <Top.Navigator
//       sceneContainerStyle={{ backgroundColor: theme.colors.background }}
//       screenOptions={{
//         tabBarActiveTintColor: theme.colors.primary,
//         tabBarInactiveTintColor: theme.colors.black,
//         tabBarStyle: { backgroundColor: theme.colors.senary },
//         tabBarIndicatorStyle: { backgroundColor: theme.colors.black },
//       }}
//     >
//       <Top.Screen
//         name="FoodFruit"
//         component={FoodFruitScreen}
//         options={{ title: "Fruits" }}
//       />
//       <Top.Screen
//         name="FoodVegetable"
//         component={FoodVegetableScreen}
//         options={{ title: "Vegetables" }}
//       />
//       <Top.Screen
//         name="FoodProtein"
//         component={FoodProteinScreen}
//         options={{ title: "Proteins" }}
//       />
//       <Top.Screen
//         name="FoodDairy"
//         component={FoodDairyScreen}
//         options={{ title: "Dairy" }}
//       />
//     </Top.Navigator>
//   );
// }

function DietitianFoodStack() {
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
      initialRouteName="Foods"
    >
      <Stack.Screen name="Foods" component={FoodScreen} />
      <Stack.Screen name="AddFood" component={AddFoodScreen} />
      <Stack.Screen name="EditFood" component={EditFoodScreen} />
    </Stack.Navigator>
  );
}

// function DietitianMealFoodTopTabs() {
//   const { theme } = useTheme();
//   return (
//     <Top.Navigator
//       sceneContainerStyle={{ backgroundColor: theme.colors.background }}
//       screenOptions={{
//         tabBarActiveTintColor: theme.colors.primary,
//         tabBarInactiveTintColor: theme.colors.black,
//         tabBarStyle: { backgroundColor: theme.colors.senary },
//         tabBarIndicatorStyle: { backgroundColor: theme.colors.black },
//       }}
//     >
//       <Top.Screen
//         name="AddMealFoodFruit"
//         component={AddMealFoodFruitScreen}
//         options={{ title: "Fruits" }}
//       />
//       <Top.Screen
//         name="AddMealFoodVegetable"
//         component={AddMealFoodVegetableScreen}
//         options={{ title: "Vegetables" }}
//       />
//       <Top.Screen
//         name="AddMealFoodProtein"
//         component={AddMealFoodProteinScreen}
//         options={{ title: "Proteins" }}
//       />
//       <Top.Screen
//         name="AddMealFoodDairy"
//         component={AddMealFoodDairyScreen}
//         options={{ title: "Dairy" }}
//       />
//     </Top.Navigator>
//   );
// }

// function DietitianMealTopTabs() {
//   const { theme } = useTheme();
//   return (
//     <Top.Navigator
//       sceneContainerStyle={{ backgroundColor: theme.colors.background }}
//       screenOptions={{
//         tabBarActiveTintColor: theme.colors.primary,
//         tabBarInactiveTintColor: theme.colors.black,
//         tabBarStyle: { backgroundColor: theme.colors.senary },
//         tabBarIndicatorStyle: { backgroundColor: theme.colors.black },
//       }}
//     >
//       <Top.Screen
//         name="MealBreakfast"
//         component={MealBreakfastScreen}
//         options={{ title: "Breakfast" }}
//       />
//       <Top.Screen
//         name="MealLunch"
//         component={MealLunchScreen}
//         options={{ title: "Lunch" }}
//       />
//       <Top.Screen
//         name="MealDinner"
//         component={MealDinnerScreen}
//         options={{ title: "Dinner" }}
//       />
//       <Top.Screen
//         name="MealSnack"
//         component={MealSnackScreen}
//         options={{ title: "Snack" }}
//       />
//     </Top.Navigator>
//   );
// }

function DietitianMealStack() {
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
      initialRouteName="Meals"
    >
      <Stack.Screen
        name="Meals"
        component={MealScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ViewMeal" component={ViewMealScreen} />
      <Stack.Screen
        name="EditMeal"
        component={EditMealScreen}
        options={{ title: "Edit Meal" }}
      />
      <Stack.Screen
        name="EditMealFood"
        component={EditMealFoodScreen}
        options={{ title: "Edit Meal Food" }}
      />
      <Stack.Screen
        name="EditMealInstruction"
        component={EditMealInstructionScreen}
        options={{ title: "Edit Meal Instruction" }}
      />
      <Stack.Screen
        name="AddMeal"
        component={AddMealScreen}
        options={{ title: "Add Meal" }}
      />
      <Stack.Screen
        name="AddMealFood"
        component={AddMealFoodScreen}
        options={{ title: "Add Meal Foods" }}
      />
      <Stack.Screen
        name="AddMealInstruction"
        component={AddMealInstructionScreen}
        options={{ title: "Add Meal Instructions" }}
      />
      <Stack.Screen
        name="AddFoodToMeal"
        component={AddFoodToMealScreen}
        options={{ title: "Add Food" }}
      />
    </Stack.Navigator>
  );
}

function DietitianGuideStack() {
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
      initialRouteName="Guide"
    >
      <Stack.Screen
        name="DietitianGuides"
        component={DietitianGuideScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddDietitianGuide"
        component={AddDietitianGuideScreen}
        options={{ title: "Add Guide" }}
      />
      <Stack.Screen
        name="EditDietitianGuide"
        component={EditDietitianGuideScreen}
        options={{ title: "Edit Guide" }}
      />
      <Stack.Screen
        name="ViewDietitianGuide"
        component={ViewDietitianGuideScreen}
        options={{ title: "View Guide" }}
      />
    </Stack.Navigator>
  );
}
