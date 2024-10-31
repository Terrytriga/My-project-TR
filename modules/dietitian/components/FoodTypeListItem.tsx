import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Text, useTheme } from "@rneui/themed";
import { FoodCategory } from "../../../utils/Types";

interface FoodTypeListItemProps {
  foodType: FoodCategory;
  isSelected: boolean;
  onPress: () => void;
}

export default function FoodTypeListItem({
  foodType,
  isSelected,
  onPress,
}: FoodTypeListItemProps) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      padding: 10,
      margin: 5,
      backgroundColor: isSelected
        ? theme.colors.primary
        : theme.colors.background,
      borderRadius: 20,
      borderColor: isSelected ? theme.colors.secondary : theme.colors.primary,
      borderWidth: 1,
      alignItems: "center",
      minWidth: 100,
      flexDirection: "column",
      justifyContent: "center",
    },
    image: {
      width: 100,
      height: 100,
      marginHorizontal: 10,
    },
    text: {
      fontSize: 16,
      fontWeight: "bold",
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
      <Text style={styles.text}>{foodType.name}</Text>
    </Pressable>
  );
}