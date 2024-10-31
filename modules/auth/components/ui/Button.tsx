import { useTheme } from "@rneui/themed";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

export default function Button({ children, onPress, style, disabled }: any) {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    button: {
      borderRadius: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.primary,
      elevation: 2,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      minWidth: !isWeb ? "50%" : 200,
      alignSelf: "center",
    },
    pressed: {
      opacity: 0.7,
    },
    buttonText: {
      textAlign: "center",
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}
