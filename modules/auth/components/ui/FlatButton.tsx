import { useTheme } from "@rneui/themed";
import { Pressable, StyleSheet, Text, View } from "react-native";

function FlatButton({ children, onPress }: any) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    button: {
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    pressed: {
      opacity: 0.7,
    },
    buttonText: {
      textAlign: "center",
      color: theme.colors.black,
    },
  });
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default FlatButton;
