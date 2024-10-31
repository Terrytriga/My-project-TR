import { Text, useTheme } from "@rneui/themed";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { BodyPart, Equipment, Exercise } from "../../../../../utils/Types";
import { useEffect, useState } from "react";
import { useBodyPartStore } from "../../../../../store/WorkoutStore";
import ExerciseEquipmentHorizontalList from "../ExerciseEquipmentHorizontalList";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioExerciseStack } from "../../../../navigation/Routes";

interface ExerciseListItemProps {
  exercise: Exercise;
  equipments: Equipment[];
}

export default function ExerciseListItem({
  exercise,
  equipments,
}: ExerciseListItemProps) {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioExerciseStack>>();

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
      width: Platform.OS !== "web" ? "100%" : 700,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      borderBottomWidth: 1,
      marginBottom: 10,
      borderColor: theme.colors.black,
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() =>
        navigation.navigate("ViewPhysioExercises", { id: exercise.id })
      }
    >
      <Text style={styles.title}>{exercise.name}</Text>
      <Text>{exercise.description}</Text>
      <Text>Duration: {exercise.duration}</Text>
      <Text>Sets: {exercise.sets}</Text>
      <Text>Reps: {exercise.repititions}</Text>
      <Text>Weight: {exercise.weight}</Text>
      <ExerciseEquipmentHorizontalList equipments={equipments} />
    </Pressable>
  );
}
