import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@rneui/themed";
//Threads
import ThreadScreen from "../../community/screens/threads/ThreadScreen";
import ViewThreadScreen from "../../community/screens/threads/ViewThreadScreen";
import CreateThreadScreen from "../../community/screens/threads/CreateThreadScreen";
//Resources
import VideosScreen from "../../community/screens/resources/VideosScreen";
import ViewGuideScreen from "../../community/screens/resources/ViewGuideScreen";
//Follow
import FollowScreen from "../../community/screens/follow/FollowScreen";
import GuideScreen from "../../community/screens/resources/GuideScreen";
import ProfileScreen from "../../community/screens/follow/ProfileScreen";

const Stack = createNativeStackNavigator();
const Top = createMaterialTopTabNavigator();
const Bottom = createBottomTabNavigator();

/* 
----------------------------------------------------
Community Bottom tabs
---------------------------------------------------- 
*/

export default function CommunityBottomTabs() {
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
        name="ThreadStack"
        component={ThreadStack}
        options={{ title: "Threads" }}
      />
      <Bottom.Screen
        name="ResourcesTopTabs"
        component={ResourcesTopTabs}
        options={{ title: "Resources" }}
      />
      <Bottom.Screen
        name="FollowStack"
        component={FollowStack}
        options={{ title: "Follow" }}
      />
    </Bottom.Navigator>
  );
}

/* 
----------------------------------------------------
  Threads
---------------------------------------------------- 
*/

function ThreadStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        contentStyle: { backgroundColor: theme.colors.background },
        headerStyle: { backgroundColor: theme.colors.senary },
        headerTintColor: theme.colors.black,
      }}
      initialRouteName="Threads"
    >
      <Stack.Screen
        name="Threads"
        component={ThreadScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="ViewThread" component={ViewThreadScreen} />
      <Stack.Screen name="CreateThread" component={CreateThreadScreen} />
    </Stack.Navigator>
  );
}

/* 
----------------------------------------------------
  Resources
---------------------------------------------------- 
*/

function ResourcesTopTabs() {
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
        name="Guides"
        component={GuideScreen}
      />
      <Stack.Screen name="ViewGuide" component={ViewGuideScreen} />
    </Stack.Navigator>
  );
}

// function ResourcesGuidesTopTabs() {
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
//         name="AllDietitianGuides"
//         component={AllDietitianGuideScreen}
//         options={{ title: "Dietitian" }}
//       />
//       <Top.Screen
//         name="AllPhysioGuides"
//         component={AllPhysioGuideScreen}
//         options={{ title: "Physio" }}
//       />
//       <Top.Screen
//         name="AllPsychologistGuides"
//         component={AllPsychologistGuideScreen}
//         options={{ title: "Psychologist" }}
//       />
//     </Top.Navigator>
//   );
// }

/* 
----------------------------------------------------
  Follow
---------------------------------------------------- 
*/

function FollowStack() {
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
        name="Users"
        component={FollowScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
