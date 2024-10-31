import { useCallback } from "react";
import { NewMealFood, NewWorkoutExercise } from "../../../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import WorkoutExerciseListItem from "./WorkoutExerciseListItem";

interface WorkoutExerciseListProps {
  workoutExercises: NewWorkoutExercise[];
}

export default function WorkoutExerciseList({
  workoutExercises,
}: WorkoutExerciseListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NewWorkoutExercise>) => (
      <WorkoutExerciseListItem workoutExercise={item} />
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
      marginHorizontal: 5,
      width: Platform.OS === "web" ? "100%" : undefined,
    },
  });

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={workoutExercises}
      renderItem={renderItem}
      keyExtractor={(mealFood, index) => index.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
