import { useCallback } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import { NewExerciseInstruction } from "../../../../../utils/Types";
import ExerciseInstructionListItem from "./ExerciseInstructionListItem";

interface ExerciseInstructionListProps {
  exerciseInstructions: NewExerciseInstruction[];
}

export default function ExerciseInstructionList({
  exerciseInstructions,
}: ExerciseInstructionListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NewExerciseInstruction>) => (
      <ExerciseInstructionListItem exerciseInstruction={item} />
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
      alignItems: "center",
      width: Platform.OS === "web" ? "100%" : undefined,
      marginHorizontal: 5,
    },
  });
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={exerciseInstructions}
      renderItem={renderItem}
      keyExtractor={(mealInstruction, index) => index.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
