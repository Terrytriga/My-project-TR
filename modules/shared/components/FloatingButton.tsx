import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import { Pressable, StyleSheet } from "react-native";

export default function FloatingButton({ onPress, icon }: any) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    button: {
      position: "absolute",
      bottom: 30,
      right: 30,
      borderWidth: 1,
      borderRadius: 25,
      borderColor: theme.colors.black,
      backgroundColor: theme.colors.primary,
      padding: 10,
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={24} color={theme.colors.black} />
    </Pressable>
  );
}
