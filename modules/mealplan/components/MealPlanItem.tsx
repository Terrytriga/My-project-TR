import { Feather } from "@expo/vector-icons";
import { Text, useTheme } from "@rneui/themed";
import { Image, Platform, Pressable, StyleSheet, View } from "react-native";

export default function MealPlanItem({ name, pictureurl, time, onPress }: any) {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      padding: 10,
      borderRadius: 10,
      width: isWeb ? 400 : "100%",
    },
    iconContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    textContainer: {
      flexDirection: "column",
      paddingHorizontal: 15,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 5,
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Image
        style={styles.image}
        source={
          pictureurl ? { uri: pictureurl } : require("../../../assets/icon.png")
        }
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text>{time}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Feather
          name="arrow-right-circle"
          size={24}
          color={theme.colors.black}
        />
      </View>
    </Pressable>
  );
}
