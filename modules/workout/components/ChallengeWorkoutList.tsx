import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import {
  useExerciseStore,
  useWorkoutExerciseStore,
  useWorkoutStore,
} from "../../../store/WorkoutStore";
import {
  ChallengeWorkoutItem,
  NewChallengeWorkout,
} from "../../../utils/Types";
import ChallengeWorkoutListItem from "./ChallengeWorkoutListItem";

interface WorkoutListProps {
  challengeWorkouts: NewChallengeWorkout[];
}

export default function ChallengeWorkoutList({
  challengeWorkouts,
}: WorkoutListProps) {
  const { workoutExercises } = useWorkoutExerciseStore();
  const { exercises } = useExerciseStore();
  const { workouts } = useWorkoutStore();

  const [workoutList, setWorkoutList] = useState<ChallengeWorkoutItem[]>([]);

  useEffect(() => {
    setWorkoutList(
      challengeWorkouts
        .map((challengeWorkout) => {
          const workout = workouts.find(
            (workout) => workout.id === challengeWorkout.workout_id
          );
          if (workout) {
            return {
              workout,
              workoutChallenge: challengeWorkout,
            };
          }
          return undefined;
        })
        .filter((item): item is ChallengeWorkoutItem => item !== undefined)
    );
  }, [challengeWorkouts]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ChallengeWorkoutItem>) => {
      const filteredExercises = workoutExercises.filter(
        (exercise) => exercise.workout_id === item.workout.id
      );

      const totalDuration = filteredExercises.reduce((acc, item) => {
        const exercise = exercises.find((e) => e.id === item.exercise_id);
        if (!exercise) return acc;
        return acc + exercise.duration;
      }, 0);

      return (
        <ChallengeWorkoutListItem
          duration={totalDuration}
          exerciseCount={filteredExercises.length}
          challengeWorkout={item}
        />
      );
    },
    [workoutExercises, challengeWorkouts, workouts, exercises]
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
      data={workoutList}
      renderItem={renderItem}
      keyExtractor={(workout, index) => index.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
