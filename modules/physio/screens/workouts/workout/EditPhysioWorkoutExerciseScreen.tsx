import { Text } from "@rneui/themed";
import { Alert, Platform, StyleSheet, View } from "react-native";
import {
  useEditWorkoutStore,
  useExerciseStore,
  useWorkoutExerciseStore,
} from "../../../../../store/WorkoutStore";
import WorkoutExerciseList from "../../../components/workouts/workout/WorkoutExerciseList";
import FloatingButton from "../../../../shared/components/FloatingButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioWorkoutStack } from "../../../../navigation/Routes";
import Button from "../../../../shared/components/Button";
import { useState } from "react";
import { supabase } from "../../../../../lib/SupaBase";
import LoadingOverlay from "../../../../shared/components/LoadingOverlay";

export default function EditPhysioWorkoutExerciseScreen() {
  const isWeb = Platform.OS === "web";
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioWorkoutStack>>();
  const {
    workoutExercises: editWorkoutExercises,
    workout,
    clearWorkout,
  } = useEditWorkoutStore();
  const { addWorkoutExercise } = useWorkoutExerciseStore();
  const { exercises } = useExerciseStore();
  const [isLoading, setIsLoading] = useState(false);

  async function finishWorkout() {
    if (!editWorkoutExercises || !workout) return;
    setIsLoading(true);

    const newWorkoutExcercises = editWorkoutExercises
      .filter((workoutExercise) => !workoutExercise.id)
      .map((workoutEx) => {
        return {
          workout_id: workout.id,
          exercise_id: workoutEx.exercise_id,
        };
      });
    if (newWorkoutExcercises.length > 0) {
      const { data: workoutExerciseData, error: workoutExerciseError } =
        await supabase
          .from("workoutexercise")
          .insert(newWorkoutExcercises)
          .select();
      if (workoutExerciseError) {
        WorkoutAlert("Error", workoutExerciseError.message);
        setIsLoading(false);
        return;
      }
      workoutExerciseData?.forEach((data) => addWorkoutExercise(data));
    }
    WorkoutAlert("Workout Finished", "Workout has been finished.");
    clearWorkout();
    navigation.navigate("PhysioWorkouts");
    setIsLoading(false);
  }

  async function confirmFinishWorkout() {
    if (isWeb) await finishWorkout();
    Alert.alert(`Finish workout?`, "Confirming will finish the workout.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => await finishWorkout(),
      },
    ]);
  }

  function WorkoutAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 20,
    },
  });
  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : (
    <View style={styles.container}>
      <WorkoutExerciseList workoutExercises={editWorkoutExercises} />
      {exercises.length !== editWorkoutExercises.length && (
        <FloatingButton
          onPress={() => navigation.navigate("AddPhysioExerciseToWorkout")}
          icon={"add-circle-outline"}
        />
      )}
      <Button onPress={confirmFinishWorkout}>Finish</Button>
    </View>
  );
}
