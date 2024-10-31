import { Text, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../../../utils/FormatDate";
import Input from "../../shared/components/Input";
import {
  useWorkoutProgramStore,
  useWorkoutStore,
} from "../../../store/WorkoutStore";
import { WorkoutProgramItem } from "../../../utils/Types";
import WorkoutProgramList from "../components/WorkoutProgramList";
import FloatingButton from "../../shared/components/FloatingButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { WorkoutStackRoutes } from "../../navigation/Routes";
import WebDatePicker from "../../shared/components/web/WebDatePicker";
import AddButton from "../../shared/components/AddButton";

export default function WorkoutProgramScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<WorkoutStackRoutes>>();
  const { workoutPrograms } = useWorkoutProgramStore();
  const { workouts } = useWorkoutStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(new Date());

  const [currentWorkoutProgram, setCurrentWorkoutPrograms] = useState<
    WorkoutProgramItem[]
  >([]);

  useEffect(() => {
    if (!workoutPrograms) return;
    const filteredPrograms = workoutPrograms.filter((program) => {
      const programDate = new Date(program.date);
      const selectedDate = new Date(dateSelected);
      return (
        programDate.getDate() === selectedDate.getDate() &&
        programDate.getMonth() === selectedDate.getMonth() &&
        programDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    const workoutProgramItems = filteredPrograms
      .map((program) => {
        const workout = workouts.find(
          (workout) => workout.id === program.workout_id
        );
        if (!workout) return null;

        return {
          workout: workout,
          workoutProgram: program,
        };
      })
      .filter((item) => item !== null);

    setCurrentWorkoutPrograms(workoutProgramItems as WorkoutProgramItem[]);
  }, [dateSelected, workoutPrograms, workouts]);

  function toggleDatePicker() {
    setShowDatePicker(!showDatePicker);
  }

  function updateDate(date: Date) {
    setDateSelected(date);
    setShowDatePicker(!showDatePicker);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
    },
    contentContainer: {
      flex: 2,
      alignItems: "center",
      justifyContent: currentWorkoutProgram.length === 0 ? "center" : undefined,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.colors.primary,
      width: "100%",
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      width: "100%",
      paddingHorizontal: 10,
    },
    dateContainer: {
      width: "75%",
      alignItems: "center",
      alignSelf: "flex-start",
      marginTop: 5,
    },
    pressed: {
      opacity: 0.5,
    },
    addButtonText: {
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {!isWeb ? (
          <Pressable
            onPress={toggleDatePicker}
            style={({ pressed }) => [
              pressed && styles.pressed,
              styles.dateContainer,
            ]}
          >
            <Input
              containerStyle={styles.inputContainer}
              disabled={true}
              value={formatDate(dateSelected).toString()}
              isValid={true}
              placeholder={"Date"}
              icon={"calendar-outline"}
            />
          </Pressable>
        ) : (
          <WebDatePicker date={dateSelected} onChange={updateDate} />
        )}
        {showDatePicker && (
          <DateTimePicker
            value={dateSelected}
            onChange={(event, selecteDate) => {
              const date = selecteDate;
              updateDate(new Date(date!));
            }}
            mode="date"
            display="calendar"
          />
        )}
        <AddButton
          onPress={() =>
            navigation.navigate("ViewAllWorkouts", {
              date: dateSelected.toString(),
            })
          }
          textStyle={styles.addButtonText}
        >
          Workout
        </AddButton>
      </View>
      <View style={styles.contentContainer}>
        {currentWorkoutProgram.length > 0 ? (
          <WorkoutProgramList
            workoutProgramItems={currentWorkoutProgram}
            date={dateSelected}
          />
        ) : (
          <Text>No workout programs for this date</Text>
        )}
      </View>
    </View>
  );
}
