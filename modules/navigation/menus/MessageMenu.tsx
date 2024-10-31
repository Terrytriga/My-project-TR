import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
import NavToggleButton from "../components/NavToggleButton";
import { View } from "react-native";
import ChatsScreen from "../../messages/screens/ChatsScreen";
import ContactScreen from "../../messages/screens/ContactScreen";
import MessageScreen from "../../messages/screens/MessageScreen";

const Stack = createNativeStackNavigator();
/* 
----------------------------------------------------
Messages stack
---------------------------------------------------- 
*/

export default function MessageStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.senary },
        headerTintColor: theme.colors.black,
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: theme.colors.background },
        headerRight: () => (
          <View style={{ flexDirection: "row" }}>
            <NavToggleButton />
          </View>
        ),
      }}
    >
      <Stack.Screen
        name="Chats"
        component={ChatsScreen}
        options={{ title: "Chats" }}
      />
      <Stack.Screen
        name="SearchContact"
        component={ContactScreen}
        options={{ title: "Chats" }}
      />
      <Stack.Screen
        name="Message"
        component={MessageScreen}
        options={{ title: "Chats" }}
      />
    </Stack.Navigator>
  );
}
