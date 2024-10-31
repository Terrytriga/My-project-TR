import { useCallback } from "react";
import { SleepQuality } from "../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import SleepQualityListItem from "./SleepQualityListItem";

interface SleepQualityListProps {
  sleepQualities: SleepQuality[];
  selectedSleep: SleepQuality | null;
  onPress: (sleepQuality: SleepQuality) => void;
}

export default function SleepQualityList({
  sleepQualities,
  selectedSleep,
  onPress,
}: SleepQualityListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SleepQuality>) => {
      return (
        <SleepQualityListItem
          sleepQuality={item}
          onPress={() => onPress(item)}
          isSelected={selectedSleep?.id === item.id}
        />
      );
    },
    [sleepQualities, selectedSleep]
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
      data={sleepQualities}
      renderItem={renderItem}
      keyExtractor={(sleep) => sleep.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
