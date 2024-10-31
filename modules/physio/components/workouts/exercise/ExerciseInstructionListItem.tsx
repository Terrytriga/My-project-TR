import { Text, useTheme } from "@rneui/themed";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import {
  NewExerciseInstruction,
  NewMealInstruction,
} from "../../../../../utils/Types";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../../../lib/SupaBase";
import {
  useEditExerciseStore,
  useExerciseInstructionStore,
  useNewExerciseStore,
} from "../../../../../store/WorkoutStore";

type ExerciseInstructionListItemProps = {
  exerciseInstruction: NewExerciseInstruction;
};

export default function ExerciseInstructionListItem({
  exerciseInstruction,
}: ExerciseInstructionListItemProps) {
  const { theme } = useTheme();

  const {
    exercise: NewExercise,
    deleteExerciseInstruction: newDeleteExerciseInstruction,
  } = useNewExerciseStore();
  const {
    exercise: EditExercise,
    deleteExerciseInstruction: editDeleteExerciseInstruction,
  } = useEditExerciseStore();
  const { deleteExerciseInstruction: deleteExerciseInstructionStore } =
    useExerciseInstructionStore();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      padding: 10,
      borderRadius: 10,
      width: Platform.OS !== "web" ? "100%" : 700,
    },
    textContainer: {
      flexDirection: "column",
      paddingHorizontal: 15,
      width: "80%",
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

  async function deleteMealInstruction() {
    if (NewExercise) {
      newDeleteExerciseInstruction(exerciseInstruction);
    }
    if (EditExercise) {
      if (exerciseInstruction.exercise_id) {
        const { error: deleteInstructionError } = await supabase
          .from("exerciseinstruction")
          .delete()
          .eq("exercise_id", exerciseInstruction.exercise_id);
        if (deleteInstructionError) {
          ItemAlert("Error", deleteInstructionError.message);
          return;
        }
        deleteExerciseInstructionStore(exerciseInstruction.exercise_id);
      }
      editDeleteExerciseInstruction(exerciseInstruction);
    }
  }
  function ItemAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  }

  function confirmDelete() {
    Alert.alert(
      "Delete Exercise Instruction",
      "Are you sure you want to delete this exercise instruction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: async () => await deleteMealInstruction(),
        },
      ]
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={confirmDelete}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{exerciseInstruction.instruction}</Text>
      </View>
    </Pressable>
  );
}
