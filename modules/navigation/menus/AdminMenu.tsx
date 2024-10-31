import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
import AdminDashboardScreen from "../../admin/screens/AdminDashboardScreen";
import AllUserScreen from "../../admin/screens/AllUserScreen";
import ViewUserScreen from "../../admin/screens/ViewUserScreen";
import ApproveDietitianScreen from "../../admin/screens/ApproveDietitianScreen";
import ApprovePhysioScreen from "../../admin/screens/ApprovePhysioScreen";
import ApprovePsychologistScreen from "../../admin/screens/ApprovePsychologistScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Stack = createNativeStackNavigator();
const Bottom = createBottomTabNavigator();
const Top = createMaterialTopTabNavigator();
/* 
----------------------------------------------------
Admin
---------------------------------------------------- 
*/

export default function AdminStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerTintColor: theme.colors.black,
        headerStyle: { backgroundColor: theme.colors.background },
        contentStyle: { backgroundColor: theme.colors.background },
      }}
      initialRouteName="AdminBottomTabs"
    >
      <Stack.Screen name="AdminBottomTabs" component={AdminBottomTabs} />
      <Stack.Screen name="ViewUser" component={ViewUserScreen} />
    </Stack.Navigator>
  );
}

function ApproveStack() {
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
        name="ApproveDietitian"
        component={ApproveDietitianScreen}
        options={{ title: "Dietitian" }}
      />
      <Top.Screen
        name="ApprovePhysio"
        component={ApprovePhysioScreen}
        options={{ title: "Physio" }}
      />
      <Top.Screen
        name="ApprovePsychologist"
        component={ApprovePsychologistScreen}
        options={{ title: "Psychologist" }}
      />
    </Top.Navigator>
  );
}

function AdminBottomTabs() {
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
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: "Dashboard" }}
      />
      <Bottom.Screen
        name="AllUsers"
        component={AllUserScreen}
        options={{ title: "Users" }}
      />
      <Bottom.Screen
        name="Requests"
        component={ApproveStack}
        options={{ title: "Requests" }}
      />
    </Bottom.Navigator>
  );
}
