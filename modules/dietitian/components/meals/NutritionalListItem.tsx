import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "@rneui/themed";

export default function NutritionalListItem({
  item,
}: {
  item: { key: string; value: number };
}) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      padding: 10,
      margin: 5,
      backgroundColor: theme.colors.senary,
      borderRadius: 5,
      alignItems: "center",
      minWidth: 100,
    },
    text: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{item.key}</Text>
      <Text>{item.value}</Text>
    </View>
  );
}
