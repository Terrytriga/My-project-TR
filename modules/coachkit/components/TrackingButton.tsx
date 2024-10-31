import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, useTheme } from "@rneui/themed";
import { Pressable, StyleSheet } from "react-native";

export default function TrackingButton({ onPress, icon, disabled }: any) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      margin: 10,
      borderColor: theme.colors.secondary,
      borderWidth: 1,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      width: 60,
      height: 60,
    },
    pressed: {
      opacity: 0.5,
    },
  });
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={26}
        color={theme.colors.secondary}
      />
    </Pressable>
  );
}
