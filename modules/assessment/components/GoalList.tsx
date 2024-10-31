import { useCallback } from "react";
import { Goal } from "../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import GoalListItem from "./GoalListItem";

interface GoalListProps {
  goals: Goal[];
  selectedGoal: Goal | null;
  onPress: (goal: Goal) => void;
}

export default function GoalList({
  goals,
  selectedGoal,
  onPress,
}: GoalListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Goal>) => {
      return (
        <GoalListItem
          goal={item}
          onPress={() => onPress(item)}
          isSelected={selectedGoal?.id === item.id}
        />
      );
    },
    [goals, selectedGoal]
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
      data={goals}
      renderItem={renderItem}
      keyExtractor={(goal) => goal.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
