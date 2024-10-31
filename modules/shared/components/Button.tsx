import { useTheme } from "@rneui/themed";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

export default function Button({ children, onPress, style, disable }: any) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    button: {
      borderRadius: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.primary,
      elevation: 2,
      shadowColor: "black",
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      minWidth: Platform.OS !== "web" ? "40%" : 200,
      alignSelf: "center",
    },
    pressed: {
      opacity: 0.7,
    },
    buttonText: {
      textAlign: "center",
      color: theme.colors.black,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <Pressable
      disabled={disable}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
}
