import { useCallback } from "react";
import { Equipment } from "../../../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import EquipmentListItem from "./EquipmentListItem";

interface EquipmentListProps {
  equipments: Equipment[] | undefined;
}

export default function EquipmentList({ equipments }: EquipmentListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Equipment>) => (
      <EquipmentListItem equipment={item} />
    ),
    [equipments]
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
