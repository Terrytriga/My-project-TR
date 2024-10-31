import { Text, useTheme } from "@rneui/themed";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import {
  BodyPart,
  Exercise,
  NewWorkoutExercise,
} from "../../../../../utils/Types";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../../../lib/SupaBase";
import {
  useBodyPartStore,
  useEditWorkoutStore,
  useExerciseStore,
  useNewWorkoutStore,
  useWorkoutExerciseStore,
} from "../../../../../store/WorkoutStore";
import { useEffect, useState } from "react";

type WorkoutExerciseListProps = {
  workoutExercise: NewWorkoutExercise;
};

export default function WorkoutExerciseListItem({
  workoutExercise,
}: WorkoutExerciseListProps) {
  const { theme } = useTheme();
  const { exercises } = useExerciseStore();
  const { bodyparts } = useBodyPartStore();
  const [exercise, setExercise] = useState<Exercise>();
  const [bodyPart, setBodyPart] = useState<BodyPart>();
  useEffect(() => {
    if (!exercises || !bodyparts) return;
    setExercise(
      exercises.find((exercise) => exercise.id === workoutExercise.exercise_id)
    );
  }, [workoutExercise]);

  useEffect(() => {
    setBodyPart(
      bodyparts.find((bodypart) => bodypart.id === exercise?.bodypart_id)
    );
  }, [exercise]);

  const {
    deleteWorkoutExercise: newDeleteWorkoutExercise,
    workout: newWorkout,
  } = useNewWorkoutStore();
  const {
    deleteWorkoutExercise: editDeleteWorkoutExercise,
    workout: editWorkout,
  } = useEditWorkoutStore();
  const { deleteWorkoutExercise } = useWorkoutExerciseStore();

  async function handleDelete() {
    if (newWorkout) {
      newDeleteWorkoutExercise(workoutExercise);
    }
    if (editWorkout) {
      if (workoutExercise.id) {
        const { error } = await supabase
          .from("workoutexercise")
          .delete()
          .eq("id", workoutExercise.id);
        if (error) {
          ItemAlert("Error", error.message);
          return;
        }
        deleteWorkoutExercise(workoutExercise.id);
      }
      editDeleteWorkoutExercise(workoutExercise);
    }
  }

  function ItemAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "OK", style: "default" }]);
  }

  function confirmDelete() {
    Alert.alert(
      `Delete ${exercise?.name}?`,
      "Are you sure you want to delete this Exercise?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          style: "destructive",
          onPress: handleDelete,
        },
      ]
    );
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      justifyContent: "space-between",
      padding: 10,
      borderRadius: 10,
      width: Platform.OS !== "web" ? "90%" : 700,
    },
    iconContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    textContainer: {
      alignItems: "center",
      flexDirection: "column",
      // paddingHorizontal: 15,
      width: "30%",
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
    iconPressable: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      width: 36,
      height: 36,
      marginHorizontal: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{exercise?.name}</Text>
        <Text>{bodyPart?.name}</Text>
      </View>
      <View>
        <Text>Sets: {exercise?.sets}</Text>
        <Text>Reps: {exercise?.repititions}</Text>
      </View>
      <View>
        <Text>Duration: {exercise?.duration} mins</Text>
        <Text>Weight: {exercise?.weight}Kg</Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.iconPressable,
          pressed && styles.pressed,
        ]}
        onPress={confirmDelete}
      >
        <Ionicons name="trash-outline" size={24} color={theme.colors.primary} />
      </Pressable>
    </Pressable>
  );
}
