import { Ionicons } from "@expo/vector-icons";
import { Text, useTheme } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";

export default function AddButtonHeader({
  onPress,
  children,
  textStyle,
  iconStyle,
  containerStyle,
  noText,
}: any) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      right: 15,
      position: "absolute",
      width: 45,
      height: 45,
      borderWidth: 1,
      borderRadius: 22.5,
      borderColor: theme.colors.secondary,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      margin: 10,
    },
    text: {
      fontSize: 14,
      color: "white",
    },
    icon: {
      margin: -6,
      padding: 0,
    },
    pressed: {
      opacity: 0.5,
    },
  });
  return (
    <Pressable
      style={({ pressed }) => [
        pressed && styles.pressed,
        styles.container,
        containerStyle,
      ]}
      onPress={onPress}
    >
      <Ionicons
        style={[styles.icon, iconStyle]}
        name="add"
        size={24}
        color={"white"}
      />
      {!noText && <Text style={[styles.text, textStyle]}>{children}</Text>}
    </Pressable>
  );
}
