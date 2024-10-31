import { Text } from "@rneui/themed";
import { Alert, Platform, StyleSheet, View } from "react-native";
import CreateExerciseInstruction from "../../../components/workouts/exercise/CreateExerciseInstruction";
import ExerciseInstructionList from "../../../components/workouts/exercise/ExerciseInstructionList";
import {
  useExerciseEquipmentStore,
  useExerciseInstructionStore,
  useExerciseStore,
  useNewExerciseStore,
} from "../../../../../store/WorkoutStore";
import Button from "../../../../shared/components/Button";
import { supabase } from "../../../../../lib/SupaBase";
import { useState } from "react";
import LoadingOverlay from "../../../../shared/components/LoadingOverlay";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioExerciseStack } from "../../../../navigation/Routes";

export default function AddPhysioExerciseInstructionScreen() {
  const isWeb = Platform.OS === "web";
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioExerciseStack>>();
  const [isLoading, setIsLoading] = useState(false);
  const { exerciseInstructions, exercise, exerciseEquipments, clearExercise } =
    useNewExerciseStore();
  const { addExercise } = useExerciseStore();
  const { addExerciseInstruction } = useExerciseInstructionStore();
  const { addExerciseEquipment } = useExerciseEquipmentStore();

  async function finishExercise() {
    if (!exercise || !exerciseInstructions || !exerciseEquipments) return;
    setIsLoading(true);
    const { data: exerciseData, error: exerciseError } = await supabase
      .from("exercise")
      .insert([
        {
          name: exercise.name,
          description: exercise.description,
          sets: exercise.sets,
          repititions: exercise.repititions,
          duration: exercise.duration,
          weight: exercise.weight === 0 ? null : exercise.weight,
          bodypart_id: exercise.bodypart_id,
        },
      ])
      .select();
    if (exerciseError) {
      ExerciseAlert("Error", exerciseError.message);
      setIsLoading(false);
      return;
    }
    addExercise(exerciseData[0]);

    const exerciseInst = exerciseInstructions.map((instruction) => {
      return {
        ...instruction,
        exercise_id: exerciseData[0].id,
      };
    });
    const { data: exerciseInstructionData, error: exerciseInstructionError } =
      await supabase.from("exerciseinstruction").insert(exerciseInst).select();
    if (exerciseInstructionError) {
      ExerciseAlert("Error", exerciseInstructionError.message);
      setIsLoading(false);
      return;
    }
    exerciseInstructionData.forEach((instruction) => {
      addExerciseInstruction(instruction);
    });

    const exerciseEquip = exerciseEquipments.map((eq) => {
      return {
        ...eq,
        exercise_id: exerciseData[0].id,
      };
    });
    const { data: exerciseEquipmentData, error: exerciseEquipmentError } =
      await supabase.from("exerciseequipment").insert(exerciseEquip).select();
    if (exerciseEquipmentError) {
      ExerciseAlert("Error", exerciseEquipmentError.message);
      setIsLoading(false);
      return;
    }
    exerciseEquipmentData.forEach((equipment) => {
      addExerciseEquipment(equipment);
    });

    ExerciseAlert("Success", "Exercise added successfully.");
    clearExercise();
    navigation.navigate("PhysioExercises");
    setIsLoading(false);
  }

  async function confirmFinishExercise() {
    if (isWeb) await finishExercise();
    Alert.alert(`Finish exercise?`, "Confirming will finish the exercise.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => await finishExercise(),
      },
    ]);
  }
  function ExerciseAlert(title: string, message: string) {
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
    },
  });

  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : (
    <View style={styles.container}>
      <Button onPress={confirmFinishExercise}>Finish</Button>
      <ExerciseInstructionList exerciseInstructions={exerciseInstructions} />
      <CreateExerciseInstruction />
    </View>
  );
}
