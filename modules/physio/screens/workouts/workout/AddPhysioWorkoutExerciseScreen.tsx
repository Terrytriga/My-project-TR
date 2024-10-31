import { Alert, Platform, StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";
import {
  useNewWorkoutStore,
  useWorkoutExerciseStore,
  useWorkoutStore,
} from "../../../../../store/WorkoutStore";
import { useState } from "react";
import WorkoutExerciseList from "../../../components/workouts/workout/WorkoutExerciseList";
import Button from "../../../../shared/components/Button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioWorkoutStack } from "../../../../navigation/Routes";
import FloatingButton from "../../../../shared/components/FloatingButton";
import { supabase } from "../../../../../lib/SupaBase";
import { decode } from "base64-arraybuffer";
import LoadingOverlay from "../../../../shared/components/LoadingOverlay";

export default function AddPhysioWorkoutExerciseScreen() {
  const isWeb = Platform.OS === "web";
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioWorkoutStack>>();
  const { workoutExercises, workout, clearWorkout } = useNewWorkoutStore();
  const { addWorkout } = useWorkoutStore();
  const { addWorkoutExercise } = useWorkoutExerciseStore();
  const [isLoading, setIsLoading] = useState(false);

  const getPublicUrl = async (filePath: string) => {
    if (!filePath) return;
    const { data: publicUrlData } = supabase.storage
      .from("Public")
      .getPublicUrl(filePath);
    if (publicUrlData) {
      return publicUrlData.publicUrl;
    }
  };

  const uploadImage = async () => {
    if (!workout) return;
    const removeSpaces = workout.name.replace(/\s/g, "");
    const filePath = `Workouts/${removeSpaces}`;
    const base64 = workout.picture.base64;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Public")
      .upload(filePath, decode(base64!), {
        contentType: workout.picture.mimeType,
      });

    if (uploadError || !uploadData) {
      WorkoutAlert("Error Uploading", uploadError.message);
      return;
    }

    return await getPublicUrl(uploadData.path);
  };

  async function finishWorkout() {
    if (!workout) return;
    setIsLoading(true);
    const { data: workoutData, error: workoutError } = await supabase
      .from("workout")
      .insert([
        {
          name: workout.name,
          description: workout.description,
          pictureurl: await uploadImage(),
          datecreated: new Date(),
        },
      ])
      .select();
    if (workoutError) {
      WorkoutAlert("Error", workoutError.message);
      setIsLoading(false);
      return;
    }
    addWorkout(workoutData[0]);

    const newWorkoutExcercises = workoutExercises.map((workoutExercise) => {
      return {
        workout_id: workoutData[0].id,
        exercise_id: workoutExercise.exercise_id,
      };
    });
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
      justifyContent: workoutExercises.length === 0 ? "center" : undefined,
      alignItems: "center",
      paddingBottom: 20,
    },
  });

  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : (
    <View style={styles.container}>
      {workoutExercises.length === 0 ? (
        <Text>No Exercises</Text>
      ) : (
        <WorkoutExerciseList workoutExercises={workoutExercises} />
      )}
      <FloatingButton
        onPress={() => navigation.navigate("AddPhysioExerciseToWorkout")}
        icon={"add-circle-outline"}
      />
      {workoutExercises.length !== 0 && (
        <Button onPress={confirmFinishWorkout}>Finish</Button>
      )}
    </View>
  );
}
