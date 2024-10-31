import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";
import { MainNavigationRoutes } from "../Routes";

export default function NavMessageButton() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainNavigationRoutes>>();
  const { theme } = useTheme();

  function messageButtonPressed() {
    navigation.navigate("MessageStack");
  }
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      borderRadius: 20,
      overflow: "hidden",
      marginHorizontal: 8,
    },
    pressed: {
      opacity: 0.7,
    },
  });
  return (
    <Pressable
      onPress={messageButtonPressed}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.container}>
        <Ionicons name="paper-plane" size={24} color={theme.colors.black} />
      </View>
    </Pressable>
  );
}
