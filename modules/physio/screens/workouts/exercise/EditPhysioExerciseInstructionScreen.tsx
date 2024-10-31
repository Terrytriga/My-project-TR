import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "@rneui/themed";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { PhysioExerciseStack } from "../../../../navigation/Routes";
import { useState } from "react";
import {
  useEditExerciseStore,
  useExerciseEquipmentStore,
  useExerciseInstructionStore,
  useExerciseStore,
} from "../../../../../store/WorkoutStore";
import { supabase } from "../../../../../lib/SupaBase";
import LoadingOverlay from "../../../../shared/components/LoadingOverlay";
import Button from "../../../../shared/components/Button";
import ExerciseInstructionList from "../../../components/workouts/exercise/ExerciseInstructionList";
import CreateExerciseInstruction from "../../../components/workouts/exercise/CreateExerciseInstruction";

export default function EditPhysioExerciseInstructionScreen() {
  const isWeb = Platform.OS === "web";
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioExerciseStack>>();
  const [isLoading, setIsLoading] = useState(false);
  const { exerciseInstructions, exercise, exerciseEquipments, clearExercise } =
    useEditExerciseStore();
  const { addExerciseInstruction } = useExerciseInstructionStore();
  const { addExerciseEquipment } = useExerciseEquipmentStore();

  async function finishExercise() {
    if (!exercise || !exerciseInstructions || !exerciseEquipments) return;
    setIsLoading(true);

    const exerciseInst = exerciseInstructions
      .filter((instruction) => !instruction.id)
      .map((instruction) => {
        return {
          ...instruction,
          exercise_id: exercise.id,
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

    const exerciseEquip = exerciseEquipments
      .filter((eq) => !eq.id)
      .map((eq) => {
        return {
          ...eq,
          exercise_id: exercise.id,
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

    ExerciseAlert("Success", "Exercise updated successfully.");
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
