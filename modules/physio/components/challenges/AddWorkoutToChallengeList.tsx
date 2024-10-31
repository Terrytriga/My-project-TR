import { useCallback, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  useExerciseStore,
  useWorkoutExerciseStore,
} from "../../../../store/WorkoutStore";
import { Workout } from "../../../../utils/Types";
import AddWorkoutToChallengeListItem from "./AddWorkoutToChallengeListItem";
import Input from "../../../shared/components/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../../../../utils/FormatDate";
import { useTheme } from "@rneui/themed";
import WebDatePicker from "../../../shared/components/web/WebDatePicker";

interface AddWorkoutToChallengeListProps {
  workouts: Workout[];
}

export default function AddWorkoutToChallengeList({
  workouts,
}: AddWorkoutToChallengeListProps) {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { workoutExercises } = useWorkoutExerciseStore();
  const { exercises } = useExerciseStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [workoutDate, setWorkoutDate] = useState(new Date());

  function updateDate(date: Date) {
    setWorkoutDate(date);
    setShowDatePicker(!showDatePicker);
  }

  function toggleDatePicker() {
    setShowDatePicker(!showDatePicker);
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
        <AddWorkoutToChallengeListItem
          workout={item}
          duration={totalDuration}
          exerciseCount={filteredExercises.length}
          workoutDate={workoutDate}
        />
      );
    },
    [workoutExercises, workouts, workoutDate]
  );

  const styles = StyleSheet.create({
    container: {
      marginVertical: 5,
      width: "100%",
      flex: 1,
    },
    contentStyle: {
      justifyContent: "center",
      marginHorizontal: 5,
      alignItems: "center",
      width: Platform.OS === "web" ? "100%" : undefined,
    },
    inputContainer: {
      alignItems: "center",
    },
    input: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      {!isWeb ? (
        <Pressable style={styles.inputContainer} onPress={toggleDatePicker}>
          <Input
            containerStyle={styles.input}
            disabled={true}
            value={formatDate(workoutDate).toString()}
            isValid={true}
            placeholder={"Date of Workout"}
            icon={"calendar-outline"}
          />
        </Pressable>
      ) : (
        <WebDatePicker date={workoutDate} onChange={updateDate} />
      )}
      {showDatePicker && (
        <DateTimePicker
          value={workoutDate}
          onChange={(event, selecteDate) => {
            const date = selecteDate;
            updateDate(new Date(date!));
          }}
          mode="date"
          display="calendar"
        />
      )}
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
    </View>
  );
}
