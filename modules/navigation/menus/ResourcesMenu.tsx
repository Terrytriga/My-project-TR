import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
import ViewGuideScreen from "../../community/screens/resources/ViewGuideScreen";
import AllDietitianGuideScreen from "../../community/screens/resources/AllDietitianGuideScreen";
import AllPhysioGuideScreen from "../../community/screens/resources/AllPhysioGuideScreen";
import AllPsychologistGuideScreen from "../../community/screens/resources/AllPsychologistGuideScreen";
import VideosScreen from "../../community/screens/resources/VideosScreen";

const Stack = createNativeStackNavigator();
const Top = createMaterialTopTabNavigator();

/* 
----------------------------------------------------
Resources top tabs
---------------------------------------------------- 
*/

export default function ResourcesTopTabs() {
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
      <Top.Screen name="Videos" component={VideosScreen} />
      <Top.Screen
        name="ResourcesGuideStack"
        component={ResourcesGuideStack}
        options={{ title: "Articles & Tips" }}
      />
    </Top.Navigator>
  );
}

function ResourcesGuideStack() {
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
      initialRouteName="ResourcesGuidesTopTabs"
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="ResourcesGuidesTopTabs"
        component={ResourcesGuidesTopTabs}
      />
      <Stack.Screen name="ViewGuide" component={ViewGuideScreen} />
    </Stack.Navigator>
  );
}

function ResourcesGuidesTopTabs() {
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
        name="AllDietitianGuides"
        component={AllDietitianGuideScreen}
        options={{ title: "Dietitian" }}
      />
      <Top.Screen
        name="AllPhysioGuides"
        component={AllPhysioGuideScreen}
        options={{ title: "Physio" }}
      />
      <Top.Screen
        name="AllPsychologistGuides"
        component={AllPsychologistGuideScreen}
        options={{ title: "Psychologist" }}
      />
    </Top.Navigator>
  );
}
