import { useCallback } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { Equipment } from "../../../utils/Types";
import ExerciseEquipmentHorizontalListItem from "./EquipmentHorizontalListItem";

interface ExerciseEquipmentHorizontalListProps {
  equipments: Equipment[];
}

export default function EquipmentHorizontalList({
  equipments,
}: ExerciseEquipmentHorizontalListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Equipment>) => (
      <ExerciseEquipmentHorizontalListItem equipment={item} />
    ),
    []
  );

  const styles = StyleSheet.create({
    container: {
      marginVertical: 5,
      width: "100%",
    },
    contentStyle: {
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 5,
    },
  });
  return (
    <FlatList
      horizontal={true}
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={equipments}
      renderItem={renderItem}
      keyExtractor={(equipment) => equipment.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
