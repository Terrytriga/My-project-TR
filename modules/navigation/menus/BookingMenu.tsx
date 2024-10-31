import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
import MyBookingScreen from "../../booking/screens/MyBookingScreen";
import ProfessionalScreen from "../../booking/screens/ProfessionalScreen";
import TherapyScreen from "../../booking/screens/TherapyScreen";

const Stack = createNativeStackNavigator();
const Bottom = createBottomTabNavigator();
const Top = createMaterialTopTabNavigator();

/* 
----------------------------------------------------
Booking top tabs
---------------------------------------------------- 
*/

export default function BookingBottomTabs() {
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
        name="BookingStack"
        component={BookingStack}
        options={{ title: "Bookings" }}
      />
      <Bottom.Screen
        name="MyBooking"
        component={MyBookingScreen}
        options={{ title: "My Bookings" }}
      />
    </Bottom.Navigator>
  );
}

function BookingStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
      initialRouteName="Bookings"
    >
      <Stack.Screen name="Bookings" component={BookingTopTabs} />
      <Stack.Screen name="Professsional" component={ProfessionalScreen} />
    </Stack.Navigator>
  );
}
function BookingTopTabs() {
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
      <Top.Screen name="Therapy" component={TherapyScreen} />
    </Top.Navigator>
  );
}
