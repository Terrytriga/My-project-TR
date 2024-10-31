import { Text, useTheme } from "@rneui/themed";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { NewMealInstruction } from "../../../../utils/Types";
import {
  useEditMealStore,
  useMealInstructionStore,
  useNewMealStore,
} from "../../../../store/MealStore";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../../lib/SupaBase";

type MealItemProps = {
  mealInstruction: NewMealInstruction;
};

export default function MealInstructionListItem({
  mealInstruction,
}: MealItemProps) {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { meal: NewMeal, deleteMealInstruction: newDeleteMealInstruction } =
    useNewMealStore();
  const { meal: EditMeal, deleteMealInstruction: editDeleteMealInstruction } =
    useEditMealStore();
  const { deleteMealInstruction: deleteMealinstructionStore } =
    useMealInstructionStore();
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      padding: 10,
      borderRadius: 10,
      width: !isWeb ? "100%" : 400,
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
    if (NewMeal) {
      newDeleteMealInstruction(mealInstruction);
    } else if (EditMeal) {
      if (mealInstruction.mealinstruction_id) {
        const { error: deleteInstructionError } = await supabase
          .from("mealinstruction")
          .delete()
          .eq("mealinstruction_id", mealInstruction.mealinstruction_id);
        if (deleteInstructionError) {
          ItemAlert("Error", deleteInstructionError.message);
          return;
        }
        deleteMealinstructionStore(mealInstruction.mealinstruction_id);
      }
      editDeleteMealInstruction(mealInstruction);
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
      "Delete Meal Instruction",
      "Are you sure you want to delete this meal instruction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => await deleteMealInstruction(),
        },
      ]
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{mealInstruction.instruction}</Text>
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
