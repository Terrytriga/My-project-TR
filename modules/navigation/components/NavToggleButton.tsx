import { Ionicons } from "@expo/vector-icons";
import { useTheme, useThemeMode } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";

/**
 * ToggleButton component that allows toggling between light and dark theme modes.
 *
 * Uses useThemeMode hook to get and update current theme mode.
 * Renders a Pressable with an Ionicons icon that toggles on press.
 */
export default function NavToggleButton() {
  const { mode, setMode } = useThemeMode();
  const { theme } = useTheme();
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
      style={({ pressed }) => pressed && styles.pressed}
      onPress={() => setMode(mode === "light" ? "dark" : "light")}
    >
      <View style={styles.container}>
        <Ionicons
          name={mode === "light" ? "moon-sharp" : "sunny-sharp"}
          size={24}
          color={theme.colors.black}
        />
      </View>
    </Pressable>
  );
}
