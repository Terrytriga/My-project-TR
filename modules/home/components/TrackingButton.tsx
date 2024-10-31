import { Text, useTheme } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";

export default function TrackingButton({ emoji, children, onPress }: any) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      width: "40%",
      height: 55,
      borderRadius: 37.5,
      backgroundColor: theme.colors.senary,

      padding: 10,
    },
    shadow: {
      elevation: 5,
      shadowColor: "#171717",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
    },
    emoji: {
      fontSize: 23,
      marginVertical: -2,
    },
    title: {
      fontSize: 18,
      // fontFamily: "Archivo",
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
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{children}</Text>
    </Pressable>
  );
}
