import { useCallback } from "react";
import { Goal, Mood } from "../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import GoalListItem from "./GoalListItem";
import MoodListItem from "./MoodListItem";

interface MoodListProps {
  moods: Mood[];
  selectedMood: Mood | null;
  onPress: (goal: Mood) => void;
}

export default function MoodList({
  moods,
  selectedMood,
  onPress,
}: MoodListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Goal>) => {
      return (
        <MoodListItem
          mood={item}
          onPress={() => onPress(item)}
          isSelected={selectedMood?.id === item.id}
        />
      );
    },
    [moods, selectedMood]
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
      data={moods}
      renderItem={renderItem}
      keyExtractor={(mood) => mood.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
