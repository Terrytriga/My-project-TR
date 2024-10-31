import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import { Pressable, StyleSheet, View, Text } from "react-native";

export default function NavDrawerMenuItem({ label, icon, onPress }: any) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      overflow: "hidden",
      marginHorizontal: 10,
      marginVertical: 4,
      borderRadius: 6,
    },
    menuRow: {},
    menu: {
      backgroundColor: theme.colors.senary,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 12,
    },
    menuItem: {
      backgroundColor: "#2B3040",
    },
    menuTitle: {
      fontSize: 14,
      fontWeight: "bold",
      // paddingLeft: 31,
      color: theme.colors.black,
    },
    pressed: {
      // opacity: 0.75,
      backgroundColor: "red",
    },
  });

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [pressed && styles.pressed, styles.menu]}
        onPress={onPress}
        android_ripple={{ color: "#ADADAD" }}
      >
        {icon && <Ionicons name={icon} color="black" size={25} />}
        <Text style={styles.menuTitle}>{label}</Text>
      </Pressable>
    </View>
  );
}
