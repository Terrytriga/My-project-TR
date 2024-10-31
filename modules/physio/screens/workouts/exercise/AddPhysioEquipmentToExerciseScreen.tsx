import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import AddEquipmentExerciseList from "../../../components/workouts/exercise/AddEquipmentExerciseList";
import {
  useEditExerciseStore,
  useEquipmentStore,
  useNewExerciseStore,
} from "../../../../../store/WorkoutStore";
import { useEffect, useState } from "react";
import { Equipment } from "../../../../../utils/Types";

export default function AddPhysioEquipmentToExerciseScreen() {
  const { equipments } = useEquipmentStore();
  const { exerciseEquipments: newExerciseEquipments, exercise: newExercise } =
    useNewExerciseStore();
  const { exerciseEquipments: editExerciseEquipments, exercise: editExercise } =
    useEditExerciseStore();
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    if (newExercise) {
      setEquipment(
        equipments.filter(
          (equipment) =>
            !newExerciseEquipments.some(
              (exEq) => exEq.equipment_id === equipment.id
            )
        )
      );
    }
    if (editExercise) {
      setEquipment(
        equipments.filter(
          (equipment) =>
            !editExerciseEquipments.some(
              (exEq) => exEq.equipment_id === equipment.id
            )
        )
      );
    }
  }, [newExerciseEquipments, editExerciseEquipments]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
    },
  });
  return (
    <View style={styles.container}>
      {equipment.length !== 0 ? (
        <AddEquipmentExerciseList equipments={equipment} />
      ) : (
        <Text>No equipment left.</Text>
      )}
    </View>
  );
}
