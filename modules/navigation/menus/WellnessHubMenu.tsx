import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@rneui/themed";
import CoursesScreen from "../../wellnesshub/screens/CoursesScreen";
import MeditationScreen from "../../wellnesshub/screens/MeditationScreen";

const Bottom = createBottomTabNavigator();
/* 
----------------------------------------------------
WellnessHub bottom tabs
---------------------------------------------------- 
*/
export default function WellnesshubBottomTabs() {
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
      <Bottom.Screen name="Courses" component={CoursesScreen} />
      <Bottom.Screen name="Meditation" component={MeditationScreen} />
    </Bottom.Navigator>
  );
}
