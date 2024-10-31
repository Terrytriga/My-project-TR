import { useCallback } from "react";
import { SleepQuality, TakingMedication } from "../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import SleepQualityListItem from "./SleepQualityListItem";
import TakeMedicationListItem from "./TakeMedicationListItem";

interface TakeMedicationListProps {
  takeMedications: TakingMedication[];
  selectedTakeMedication: TakingMedication | null;
  onPress: (takeMedication: TakingMedication) => void;
}

export default function TakingMedicationList({
  takeMedications,
  selectedTakeMedication,
  onPress,
}: TakeMedicationListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TakingMedication>) => {
      return (
        <TakeMedicationListItem
          takeMedication={item}
          isSelected={selectedTakeMedication?.id === item.id}
          onPress={() => onPress(item)}
        />
      );
    },
    [takeMedications, selectedTakeMedication]
  );

  const styles = StyleSheet.create({
    container: {
      marginVertical: 5,
      width: "100%",
    },
    contentStyle: {
      justifyContent: "center",
      marginHorizontal: 5,
      width: "100%",
      alignItems: Platform.OS === "web" ? "center" : undefined,
    },
  });

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={takeMedications}
      renderItem={renderItem}
      keyExtractor={(takeMedication) => takeMedication.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
