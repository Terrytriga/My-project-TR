import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
import FollowScreen from "../../community/screens/follow/FollowScreen";

const Stack = createNativeStackNavigator();
/* 
----------------------------------------------------
Follow stack
---------------------------------------------------- 
*/
export default function FollowStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Users" component={FollowScreen} />
    </Stack.Navigator>
  );
}
