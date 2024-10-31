import { Ionicons } from "@expo/vector-icons";
import { Text, useTheme } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";

export default function SelectTrackingButton({ onPress }: any) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      top: 0,
      right: 15,
      position: "absolute",
      width: 60,
      height: 60,
      borderWidth: 1,
      borderRadius: 30,
      borderColor: theme.colors.secondary,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      margin: 10,
    },
    text: {
      fontSize: 16,
      color: "white",
    },
    icon: {
      margin: -2.5,
      padding: 0,
    },
    pressed: {
      opacity: 0.5,
    },
  });
  return (
    <Pressable
      style={({ pressed }) => [pressed && styles.pressed, styles.container]}
      onPress={onPress}
    >
      <Ionicons style={styles.icon} name="add" size={26} color={"white"} />
      <Text style={styles.text}>Track</Text>
    </Pressable>
  );
}