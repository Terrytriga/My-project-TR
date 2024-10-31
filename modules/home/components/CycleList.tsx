import { useCallback } from "react";
import { TrackingMenstruation } from "../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import CycleListItem from "./CycleListItem";

interface CycleListProps {
  cycles: TrackingMenstruation[];
  selectedCycle: TrackingMenstruation | null;
  onPress: (cycle: TrackingMenstruation) => void;
}

export default function CycleList({
  cycles,
  selectedCycle,
  onPress,
}: CycleListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TrackingMenstruation>) => {
      return (
        <CycleListItem
          cycle={item}
          onPress={() => onPress(item)}
          isSelected={selectedCycle?.id === item.id}
        />
      );
    },
    [cycles, selectedCycle]
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
      data={cycles}
      renderItem={renderItem}
      keyExtractor={(cycle) => cycle.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
