import { useCallback } from "react";
import { Equipment } from "../../../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import EquipmentInExcerciseListItem from "./EquipmentInExerciseListItem";

interface EquipmentListProps {
  equipments: Equipment[] | undefined;
}

export default function EquipmentInExcerciseList({
  equipments,
}: EquipmentListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Equipment>) => (
      <EquipmentInExcerciseListItem equipment={item} />
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
      marginHorizontal: 5,
      alignItems: "center",
      width: Platform.OS === "web" ? "100%" : undefined,
    },
  });

  return (
    <FlatList
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
