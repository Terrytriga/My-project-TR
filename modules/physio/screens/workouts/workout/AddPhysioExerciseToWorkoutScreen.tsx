import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import {
  useEditWorkoutStore,
  useExerciseStore,
  useNewWorkoutStore,
} from "../../../../../store/WorkoutStore";
import AddExerciseList from "../../../components/workouts/workout/AddExerciseList";
import { Exercise, WorkoutExercise } from "../../../../../utils/Types";
import { useEffect, useState } from "react";

export default function AddPhysioExerciseToWorkoutScreen() {
  const { exercises: excerciseStore } = useExerciseStore();
  const { workoutExercises: editWorkoutExercises, workout: editWorkout } =
    useEditWorkoutStore();
  const { workoutExercises: newWorkoutExercises, workout: newWorkout } =
    useNewWorkoutStore();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (editWorkout) {
      setExercises(
        excerciseStore.filter(
          (exercise) =>
            !editWorkoutExercises.some((we) => we.exercise_id === exercise.id)
        )
      );
    }
    if (newWorkout) {
      setExercises(
        excerciseStore.filter(
          (exercise) =>
            !newWorkoutExercises.some((we) => we.exercise_id === exercise.id)
        )
      );
    }
  }, [excerciseStore, editWorkoutExercises, newWorkoutExercises]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: exercises.length === 0 ? "center" : undefined,
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <AddExerciseList exercises={exercises} />
    </View>
  );
}
