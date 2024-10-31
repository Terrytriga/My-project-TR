import { useCallback } from "react";
import { MentalHealthSymptom } from "../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import MedicationListItem from "./MedicationListItem";
import HealthSymptomListItem from "./HealthSymptomListItem";

interface HealthSymptomListProps {
  mentalHealthSymptoms: MentalHealthSymptom[];
  selectedHealthSymptoms: MentalHealthSymptom[] | [];
  onPress: (medication: MentalHealthSymptom) => void;
}

export default function HealthSymptomList({
  mentalHealthSymptoms,
  selectedHealthSymptoms,
  onPress,
}: HealthSymptomListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MentalHealthSymptom>) => {
      const isSelected = selectedHealthSymptoms.some(
        (healthSymptom) => healthSymptom.id === item.id
      );
      return (
        <HealthSymptomListItem
          healthSymptom={item}
          onPress={() => onPress(item)}
          isSelected={isSelected}
        />
      );
    },
    [mentalHealthSymptoms, selectedHealthSymptoms]
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
      data={mentalHealthSymptoms}
      renderItem={renderItem}
      keyExtractor={(healthSymptom) => healthSymptom.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
