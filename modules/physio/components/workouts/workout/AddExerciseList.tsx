import { useCallback } from "react";
import { Exercise } from "../../../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import AddExerciseListItem from "./AddExerciseListItem";

interface AddExerciseListProps {
  exercises: Exercise[];
}

export default function AddExerciseList({ exercises }: AddExerciseListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Exercise>) => (
      <AddExerciseListItem exercise={item} />
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
      data={exercises}
      renderItem={renderItem}
      keyExtractor={(exercise) => exercise.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
