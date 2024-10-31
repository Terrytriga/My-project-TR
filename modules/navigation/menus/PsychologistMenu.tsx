import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
import PsychologistBookingScreen from "../../psychologist/screens/PsychologistBookingScreen";

const Stack = createNativeStackNavigator();
const Bottom = createBottomTabNavigator();

/* 
----------------------------------------------------
Psychologist
---------------------------------------------------- 
*/
export default function PsychologistStack() {
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
      initialRouteName="PsychologistoBottomTabs"
    >
      <Stack.Screen
        name="PsychologistoBottomTabs"
        component={PsychologistoBottomTabs}
      />
    </Stack.Navigator>
  );
}

function PsychologistoBottomTabs() {
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
        name="PsychologistBooking"
        component={PsychologistBookingScreen}
      />
    </Bottom.Navigator>
  );
}
