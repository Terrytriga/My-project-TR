import { useCallback } from "react";
import { Exercise } from "../../../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import ExerciseListItem from "./ExerciseListItem";
import {
  useEquipmentStore,
  useExerciseEquipmentStore,
} from "../../../../../store/WorkoutStore";

interface ExerciseListProps {
  exercises: Exercise[] | undefined;
}

export default function ExerciseList({ exercises }: ExerciseListProps) {
  const { equipments } = useEquipmentStore();
  const { exerciseEquipments } = useExerciseEquipmentStore();
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Exercise>) => {
      const filteredExerciseEquipments = exerciseEquipments.filter(
        (exerciseEquipment) => exerciseEquipment.exercise_id === item.id
      );
      const filteredEquipment = filteredExerciseEquipments.map(
        (exerciseEquipment) =>
          equipments?.find(
            (equipment) => equipment.id === exerciseEquipment.equipment_id
          )!
      );
      return (
        <ExerciseListItem exercise={item} equipments={filteredEquipment} />
      );
    },
    [exercises, exerciseEquipments, equipments]
  );

  const styles = StyleSheet.create({
    container: {
      marginVertical: 5,
      width: "100%",
    },
    contentStyle: {
      justifyContent: "center",
      marginHorizontal: 5,
      alignItems: "center",
      width: Platform.OS === "web" ? "100%" : undefined,
    },
  });

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={exercises}
      renderItem={renderItem}
      keyExtractor={(exercise) => exercise.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
