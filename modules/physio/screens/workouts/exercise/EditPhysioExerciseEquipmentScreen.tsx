import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { PhysioExerciseStack } from "../../../../navigation/Routes";
import {
  useEditExerciseStore,
  useEquipmentStore,
} from "../../../../../store/WorkoutStore";
import { useEffect, useState } from "react";
import { Equipment } from "../../../../../utils/Types";
import EquipmentInExcerciseList from "../../../components/workouts/exercise/EquipmentInExerciseList";
import FloatingButton from "../../../../shared/components/FloatingButton";
import Button from "../../../../shared/components/Button";

export default function EditPhysioExerciseEquipmentScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioExerciseStack>>();
  const { exerciseEquipments } = useEditExerciseStore();
  const { equipments } = useEquipmentStore();
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    if (!exerciseEquipments || !equipments) return;
    setEquipment(
      equipments.filter((equipment) =>
        exerciseEquipments.some((exEq) => exEq.equipment_id === equipment.id)
      )
    );
  }, [exerciseEquipments]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: equipment.length === 0 ? "center" : undefined,
      paddingBottom: 20,
    },
  });
  return (
    <View style={styles.container}>
      {equipment.length > 0 ? (
        <EquipmentInExcerciseList equipments={equipment} />
      ) : (
        <Text>No Equipment.</Text>
      )}
      <FloatingButton
        icon={"add-circle-outline"}
        onPress={() => navigation.navigate("AddPhysioEquipmentToExercise")}
      />
      {exerciseEquipments.length > 0 && (
        <Button
          onPress={() => navigation.navigate("EditPhysioExerciseInstruction")}
        >
          Next
        </Button>
      )}
    </View>
  );
}
