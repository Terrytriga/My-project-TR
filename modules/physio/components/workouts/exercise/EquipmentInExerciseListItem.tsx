import { Text, useTheme } from "@rneui/themed";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Equipment } from "../../../../../utils/Types";
import {
  useEditExerciseStore,
  useExerciseEquipmentStore,
  useNewExerciseStore,
} from "../../../../../store/WorkoutStore";
import { supabase } from "../../../../../lib/SupaBase";

interface EquipmentItemProps {
  equipment: Equipment;
}

export default function EquipmentInExcerciseListItem({
  equipment,
}: EquipmentItemProps) {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const {
    deleteExerciseEquipment: deleteNewExerciseEquipment,
    exercise: newExercise,
  } = useNewExerciseStore();
  const {
    exerciseEquipments: editExerciseEquipments,
    deleteExerciseEquipment: deleteEditExerciseEquipment,
    exercise: editExercise,
  } = useEditExerciseStore();
  const { deleteExerciseEquipment } = useExerciseEquipmentStore();

  async function deleteEquipmentFromExercise() {
    if (newExercise) deleteNewExerciseEquipment(equipment.id);
    if (editExercise) {
      const eq_id = editExerciseEquipments.find(
        (exerciseEquip) =>
          exerciseEquip.exercise_id === editExercise.id &&
          exerciseEquip.equipment_id === equipment.id
      )?.id;
      if (!eq_id) return;
      if (equipment.id && editExercise.id) {
        const { data, error } = await supabase
          .from("exerciseequipment")
          .delete()
          .eq("id", eq_id)
          .select();
        if (error) {
          ItemAlert("Error", error.message);
          return;
        }
        deleteExerciseEquipment(data[0]);
      }
      deleteEditExerciseEquipment(eq_id);
    }
  }

  function ItemAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "OK", style: "default" }]);
  }

  function confirmDelete() {
    if (isWeb) deleteEquipmentFromExercise();
    Alert.alert(
      "Remove Equipment",
      "Are you sure you want to remove this equipment?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: deleteEquipmentFromExercise },
      ]
    );
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
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
      borderColor: theme.colors.black,
      marginBottom: 10,
    },
    description: {
      // width: "1%",
    },
    textContainer: {
      flexDirection: "column",
      width: "65%",
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
    imageContainer: {
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      padding: 10,
    },
    image: {
      width: 100,
      height: 100,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={confirmDelete}
    >
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: equipment.pictureurl }} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{equipment.name}</Text>
        <Text style={styles.description}>{equipment.description}</Text>
      </View>
    </Pressable>
  );
}
