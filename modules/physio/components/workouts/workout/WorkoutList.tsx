import { useCallback } from "react";
import { Meal, Workout } from "../../../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  DietitianMealStack,
  PhysioWorkoutStack,
} from "../../../../navigation/Routes";
import WorkoutListItem from "./WorkoutListItem";
import {
  useExerciseStore,
  useWorkoutExerciseStore,
} from "../../../../../store/WorkoutStore";

interface WorkoutListProps {
  workouts: Workout[];
}

export default function WorkoutList({ workouts }: WorkoutListProps) {
  const { workoutExercises } = useWorkoutExerciseStore();
  const { exercises } = useExerciseStore();

  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioWorkoutStack>>();

  function navigationHandler(workout: Workout) {
    if (!workout || !workout.id) return;
    navigation.navigate("ViewPhysioWorkout", { id: workout.id });
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
      marginHorizontal: 5,
      alignItems: "center",
      width: Platform.OS === "web" ? "100%" : undefined,
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
