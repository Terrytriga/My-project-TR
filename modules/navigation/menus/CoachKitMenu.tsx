import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
import CoachKitScreen from "../../coachkit/screens/CoachKitScreen";

const Stack = createNativeStackNavigator();
/* 
----------------------------------------------------
Follow stack
---------------------------------------------------- 
*/
export default function CoackKitStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        contentStyle: { backgroundColor: theme.colors.background },
        headerTransparent: true,
        title: "",
      }}
    >
      <Stack.Screen name="CoachKit" component={CoachKitScreen} />
    </Stack.Navigator>
  );
}
