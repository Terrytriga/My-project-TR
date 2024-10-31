import { Pressable, StyleSheet, Text } from "react-native";

export default function Button({ children, onPress, style }: any) {
  const styles = StyleSheet.create({
    button: {
      borderRadius: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      elevation: 2,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      minWidth: "50%",
      alignSelf: "center",
      alignItems: "center",
      backgroundColor: "#E70696",
      marginVertical: 30,
    },
    pressed: {
      opacity: 0.5,
    },
  });
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      onPress={onPress}
    >
      <Text>{children}</Text>
    </Pressable>
  );
}
