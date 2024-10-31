import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import { Pressable, StyleSheet } from "react-native";

export default function IconButton({ onPress, disabled = false }: any) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      width: 40,
      height: 40,
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 5,
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed, styles.container]}
    >
      <Ionicons name="send" size={30} color={"white"} />
    </Pressable>
  );
}
