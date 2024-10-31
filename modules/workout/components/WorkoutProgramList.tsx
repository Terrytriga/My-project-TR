import { useCallback } from "react";
import { WorkoutProgramItem } from "../../../utils/Types";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { WorkoutStackRoutes } from "../../navigation/Routes";
import {
  useExerciseStore,
  useWorkoutExerciseStore,
} from "../../..//store/WorkoutStore";
import WorkoutProgramListItem from "./WorkoutProgramListItem";

interface WorkoutProgramListProps {
  workoutProgramItems: WorkoutProgramItem[];
  date: Date;
}

export default function WorkoutProgramList({
  workoutProgramItems,
  date,
}: WorkoutProgramListProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<WorkoutStackRoutes>>();
  const { workoutExercises } = useWorkoutExerciseStore();
  const { exercises } = useExerciseStore();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<WorkoutProgramItem>) => {
      const filteredExercises = workoutExercises.filter(
        (exercise) => exercise.workout_id === item.workout.id
      );

      const totalDuration = filteredExercises.reduce((acc, item) => {
        const exercise = exercises.find((e) => e.id === item.exercise_id);
        if (!exercise) return acc;
        return acc + exercise.duration;
      }, 0);
      return (
        <WorkoutProgramListItem
          workoutProgramItem={item}
          duration={totalDuration}
          exerciseCount={filteredExercises.length}
          onPress={() =>
            navigateToViewWorkout(item.workout.id, item.workoutProgram.id)
          }
        />
      );
    },
    [workoutExercises, workoutProgramItems, exercises]
  );

  function navigateToViewWorkout(
    workout_id: number,
    workoutProgram_id: number
  ) {
    if (!workout_id) return;
    navigation.navigate("ViewWorkout", {
      id: workout_id,
      date: date.toString(),
      workoutProgram_id: workoutProgram_id,
    });
  }

  const styles = StyleSheet.create({
    container: {
      marginVertical: 5,
      width: "100%",
    },
    contentStyle: {
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 5,
    },
  });

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={workoutProgramItems}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
