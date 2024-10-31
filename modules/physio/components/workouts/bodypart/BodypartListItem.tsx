import { Text, useTheme } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";
import { BodyPart, Exercise } from "../../../../../utils/Types";
import { useEffect, useState } from "react";
import { useBodyPartStore } from "../../../../../store/WorkoutStore";

interface BodypartItemProps {
  bodypart: BodyPart;
}

export default function BodypartListItem({ bodypart }: BodypartItemProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      alignItems: "center",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      width: "100%",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      borderBottomWidth: 1,
      borderColor: theme.colors.black,
      marginBottom: 10,
    },
    description: {
      // width: "1%",
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Text style={styles.title}>{bodypart.name}</Text>
      <Text style={styles.description}>{bodypart.description}</Text>
    </Pressable>
  );
}
