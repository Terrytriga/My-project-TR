import { Text, useTheme } from "@rneui/themed";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { BodyPart, Exercise } from "../../../../../utils/Types";
import { useEffect, useState } from "react";
import {
  useBodyPartStore,
  useEditWorkoutStore,
  useNewWorkoutStore,
} from "../../../../../store/WorkoutStore";

interface FoodItemProps {
  exercise: Exercise;
}

export default function AddExerciseListItem({ exercise }: FoodItemProps) {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { workout: newWorkout, addWorkoutExercise: addNewWorkoutExercise } =
    useNewWorkoutStore();
  const { workout: editWorkout, addWorkoutExercise: editAddWorkoutExercise } =
    useEditWorkoutStore();
  useEditWorkoutStore();
  const { bodyparts } = useBodyPartStore();
  const [bodyPart, setBodyPart] = useState<BodyPart | null>();

  useEffect(() => {
    setBodyPart(bodyparts.find((part) => part.id === exercise.bodypart_id));
  }, [exercise]);

  function addExerciseToWorkout() {
    if (newWorkout) {
      addNewWorkoutExercise({
        exercise_id: exercise.id,
      });
      ExcerciseItemAlert(`${exercise.name} added to workout`, "");
    } else if (editWorkout) {
      editAddWorkoutExercise({
        workout_id: editWorkout.id,
        exercise_id: exercise.id,
      });
      ExcerciseItemAlert(`${exercise.name} added to workout`, "");
    }
  }
  function ExcerciseItemAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  }

  function confirmAddExercise() {
    if (isWeb) addExerciseToWorkout();
    Alert.alert(
      `Add ${exercise.name} to workout?`,
      "Confirming will add this exercise to the workout.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => addExerciseToWorkout(),
        },
      ]
    );
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      alignItems: "center",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      padding: 10,
      borderRadius: 10,
      width: Platform.OS !== "web" ? "100%" : 700,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      borderBottomWidth: 1,
      marginBottom: 10,
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => confirmAddExercise()}
    >
      <Text style={styles.title}>Name: {exercise.name}</Text>
      <Text>Body Part: {bodyPart?.name}</Text>
      <Text>Description: {exercise.description}</Text>
      <Text>Duration: {exercise.duration}</Text>
      <Text>Sets: {exercise.sets}</Text>
      <Text>Reps: {exercise.repititions}</Text>
      <Text>Weight: {exercise.weight}</Text>
    </Pressable>
  );
}
