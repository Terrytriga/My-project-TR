import { Text, useTheme } from "@rneui/themed";
import { Image, Platform, Pressable, StyleSheet, View } from "react-native";
import { Meal } from "../../../utils/Types";

type MealItemProps = Meal & { onPress: () => void };

export default function MealItem({
  name,
  description,
  price,
  pictureurl,
  onPress,
}: MealItemProps) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      padding: 10,
      borderRadius: 10,
      width: Platform.OS !== "web" ? "100%" : 450,
    },
    iconContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    textContainer: {
      flexDirection: "column",
      paddingHorizontal: 15,
      width: "75%",
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
        <Text>{description}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Text>R{(price * 10).toFixed(2)}</Text>
      </View>
    </Pressable>
  );
}
