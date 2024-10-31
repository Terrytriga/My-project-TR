import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, useTheme } from "@rneui/themed";
import { Equipment } from "../../../utils/Types";

interface ExerciseEquipmentHorizontalListItemProps {
  equipment: Equipment;
}

export default function EquipmentHorizontalListItem({
  equipment,
}: ExerciseEquipmentHorizontalListItemProps) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      padding: 10,
      margin: 5,
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      alignItems: "center",
      minWidth: 100,
      flexDirection: "column",
      justifyContent: "center",
      elevation: 2.5,
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
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{equipment.name}</Text>
      <Image source={{ uri: equipment.pictureurl }} style={styles.image} />
    </View>
  );
}
