import { useCallback } from "react";
import { Goal, Medication, Mood } from "../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import GoalListItem from "./GoalListItem";
import MoodListItem from "./MoodListItem";
import MedicationListItem from "./MedicationListItem";

interface MedicationListProps {
  medications: Medication[];
  selectedMedications: Medication[] | [];
  onPress: (medication: Medication) => void;
}

export default function MedicationList({
  medications,
  selectedMedications,
  onPress,
}: MedicationListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Medication>) => {
      const isSelected = selectedMedications.some(
        (medication) => medication.id === item.id
      );
      return (
        <MedicationListItem
          medication={item}
          onPress={() => onPress(item)}
          isSelected={isSelected}
        />
      );
    },
    [medications, selectedMedications]
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
      data={medications}
      renderItem={renderItem}
      keyExtractor={(medication) => medication.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
