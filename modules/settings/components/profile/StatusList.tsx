import { useCallback } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { ProfessionalStatus } from "../../../../utils/Types";
import StatusListItem from "./StatusListItem";

interface StatusListProps {
  statuses: ProfessionalStatus[];
  selectedStatus: ProfessionalStatus;
  onPress: (status: ProfessionalStatus) => void;
}

export default function StatusList({
  statuses,
  selectedStatus,
  onPress,
}: StatusListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ProfessionalStatus>) => {
      const isSelected =
        selectedStatus.professionalstatus_id === item.professionalstatus_id;
      return (
        <StatusListItem
          status={item}
          isSelected={isSelected}
          onPress={() => onPress(item)}
        />
      );
    },
    [statuses, selectedStatus]
  );

  const styles = StyleSheet.create({
    container: {
      marginVertical: 5,
      width: "100%",
      minHeight: 75,
      maxHeight: 75,
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
      data={statuses}
      renderItem={renderItem}
      keyExtractor={(status) => status.professionalstatus_id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
