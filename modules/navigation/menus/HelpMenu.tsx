import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "@rneui/themed";
import FAQScreen from "../../help/screens/FAQScreen";
import ContactUsScreen from "../../help/screens/ContactUsScreen";
import HelpTermAndConditionScreen from "../../help/screens/HelpTermAndConditionScreen";

const Top = createMaterialTopTabNavigator();

/* 
----------------------------------------------------
Help top tabs
---------------------------------------------------- 
*/

export default function HelpTopTabs() {
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
      <Top.Screen name="FAQ" component={FAQScreen} />
      <Top.Screen name="Contact" component={ContactUsScreen} />
      <Top.Screen
        name="HelpTermAndConditions"
        component={HelpTermAndConditionScreen}
        options={{ title: "T&Cs" }}
      />
    </Top.Navigator>
  );
}
