import { useCallback } from "react";
import { Workout } from "../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  PhysioWorkoutStack,
  WorkoutStackRoutes,
} from "../../navigation/Routes";
import WorkoutListItem from "./WorkoutListItem";
import {
  useExerciseStore,
  useWorkoutExerciseStore,
} from "../../..//store/WorkoutStore";

interface WorkoutListProps {
  workouts: Workout[];
  date: Date;
}

export default function WorkoutList({ workouts, date }: WorkoutListProps) {
  const { workoutExercises } = useWorkoutExerciseStore();
  const { exercises } = useExerciseStore();

  const navigation =
    useNavigation<NativeStackNavigationProp<WorkoutStackRoutes>>();

  function navigationHandler(workout: Workout) {
    if (!workout || !workout.id) return;
    navigation.navigate("ViewWorkout", {
      id: workout.id,
      date: date.toString(),
    });
  }

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Workout>) => {
      const filteredExercises = workoutExercises.filter(
        (exercise) => exercise.workout_id === item.id
      );

      const totalDuration = filteredExercises.reduce((acc, item) => {
        const exercise = exercises.find((e) => e.id === item.exercise_id);
        if (!exercise) return acc;
        return acc + exercise.duration;
      }, 0);
      return (
        <WorkoutListItem
          duration={totalDuration}
          exerciseCount={filteredExercises.length}
          onPress={() => navigationHandler(item)}
          workout={item}
        />
      );
    },
    [workoutExercises]
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
      data={workouts}
      renderItem={renderItem}
      keyExtractor={(workout) => workout.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
