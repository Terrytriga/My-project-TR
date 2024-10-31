import DateTimePicker from "@react-native-community/datetimepicker";
import { Text, useTheme } from "@rneui/themed";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  useWorkoutProgramStore,
  useWorkoutStore,
} from "../../../store/WorkoutStore";
import Input from "../../shared/components/Input";
import { useEffect, useState } from "react";
import { formatDate } from "../../../utils/FormatDate";
import { WorkoutProgramItem } from "../../../utils/Types";
import Button from "../../shared/components/Button";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../lib/SupaBase";
import { useTrackingStore } from "../../../store/TrackingStore";
import WebDatePicker from "../../shared/components/web/WebDatePicker";

export default function TrackingWorkoutScreen() {
  const { theme } = useTheme();
  const { workoutPrograms, updateWorkoutProgram } = useWorkoutProgramStore();
  const { workouts } = useWorkoutStore();

  const { addTrackingWorkout, deleteTrackingGoalWorkout } = useTrackingStore();

  const [currentWorkouts, setCurrentWorkouts] = useState<WorkoutProgramItem[]>(
    []
  );
  const [completedCount, setCompletedCount] = useState(0);
  const [workoutSelectedList, setWorkoutSelectedList] = useState<
    WorkoutProgramItem[]
  >([]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(new Date());

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

    const workoutProgramitems = filteredPrograms
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

    setCompletedCount(
      filteredPrograms.filter((program) => program.completed).length
    );
    setCurrentWorkouts(workoutProgramitems as WorkoutProgramItem[]);
  }, [dateSelected, workoutPrograms, workouts]);

  function addWorkoutToFinishList(workoutItem: WorkoutProgramItem) {
    if (workoutItem.workoutProgram.completed) return;
    const workoutExist = workoutSelectedList.some(
      (item) => item === workoutItem
    );
    if (!workoutExist) {
      setWorkoutSelectedList((items) => [...items, workoutItem]);
    } else {
      setWorkoutSelectedList(
        workoutSelectedList.filter((removeItem) => removeItem !== workoutItem)
      );
    }
  }

  async function trackWorkout() {
    if (workoutSelectedList.length === 0) return;
    const programIdList = workoutSelectedList.map(
      (workoutItem) => workoutItem.workoutProgram.id
    );
    const { data: programData, error: programError } = await supabase
      .from("workoutprogram")
      .update({ completed: true })
      .in("id", programIdList)
      .select("*");

    if (programError) {
      TrackingAlert("Error", programError.message);
      return;
    }
    programData.forEach((item) => {
      updateWorkoutProgram(item);
    });
    const trackingDetails = programData.map((item) => {
      return {
        user_id: item.user_id,
        workoutprogram_id: item.id,
        datecreated: dateSelected,
      };
    });

    const { data: workoutTrackingData, error: workoutTrackingError } =
      await supabase
        .from("trackingworkout")
        .insert(trackingDetails)
        .select("*");

    if (workoutTrackingError) {
      TrackingAlert("Error", workoutTrackingError.message);
      return;
    }

    workoutTrackingData.forEach((item) => {
      addTrackingWorkout(item);
    });

    setWorkoutSelectedList([]);
  }

  function toggleDatePicker() {
    setShowDatePicker(!showDatePicker);
  }

  function updateDate(date: Date) {
    setDateSelected(date);
    setShowDatePicker(!showDatePicker);
  }

  async function removeTracking(workoutItem: WorkoutProgramItem) {
    if (!workoutItem.workoutProgram.id) return;
    const { data: programData, error: programError } = await supabase
      .from("workoutprogram")
      .update({ completed: false })
      .eq("id", workoutItem.workoutProgram.id)
      .select("*")
      .single();

    if (programError) {
      TrackingAlert("Error", programError.message);
      return;
    }
    updateWorkoutProgram(programData);

    const { data: trackingData, error: trackingError } = await supabase
      .from("trackingworkout")
      .delete()
      .eq("workoutprogram_id", workoutItem.workoutProgram.id)
      .select("*")
      .single();
    if (trackingError) {
      TrackingAlert("Error", trackingError.message);
      return;
    }

    deleteTrackingGoalWorkout(trackingData);
  }

  function confirmRemoveTracking(workoutItem: WorkoutProgramItem) {
    Alert.alert("Delete", "Are you sure you want to delete this tracking?", [
      {
        text: "Cancel",
      },
      {
        text: "Confirm",
        onPress: async () => await removeTracking(workoutItem),
      },
    ]);
  }

  function TrackingAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "OK",
      },
    ]);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
    },
    title: {
      fontSize: 24,
      fontFamily: "Bebas",
      marginBottom: 30,
    },
    subTitle: {
      fontSize: 18,
      borderBottomColor: theme.colors.primary,
      borderBottomWidth: 1,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.colors.primary,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    buttonContainer: {
      paddingVertical: 20,
      width: "100%",
    },
    workoutContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollView: {
      height: 250,
      marginVertical: 15,
    },
    scrollViewContent: {
      alignItems: "center",
      justifyContent: "center",
    },
    workoutTitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
    workoutDescription: {
      fontSize: 14,
      marginHorizontal: 2,
    },
    workoutItemContainer: {
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      width: "95%",
      padding: 10,
      marginVertical: 5,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 10,
    },
    contentContainer: {
      flexDirection: "row",
      width: "70%",
      alignItems: "center",
      justifyContent: "center",
    },
    textContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "80%",
    },
    iconContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    deleteIcon: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "red",
    },
    workoutSelected: {
      borderColor: "green",
      borderWidth: 2,
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your workouts for today!</Text>
      {Platform.OS !== "web" ? (
        <Pressable
          onPress={toggleDatePicker}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Input
            containerStyle={styles.inputContainer}
            disabled={true}
            value={formatDate(dateSelected).toString()}
            isValid={true}
            placeholder={"Select Date"}
            icon={"calendar-outline"}
          />
        </Pressable>
      ) : (
        <WebDatePicker
          date={dateSelected}
          onChange={(value: any) => updateDate(value)}
        />
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
      <View style={styles.workoutContainer}>
        <Text style={styles.subTitle}>
          {completedCount} / {currentWorkouts.length} Workouts Tracked
        </Text>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {currentWorkouts.length > 0 ? (
            currentWorkouts.map((workoutItem) => {
              const isSelected = workoutSelectedList.some(
                (item) => item === workoutItem
              );
              return (
                <Pressable
                  key={workoutItem.workout.id}
                  style={({ pressed }) => [
                    pressed && styles.pressed,
                    styles.workoutItemContainer,
                    isSelected && styles.workoutSelected,
                  ]}
                  onPress={() => addWorkoutToFinishList(workoutItem)}
                >
                  <Image
                    source={{ uri: workoutItem.workout.pictureurl }}
                    style={styles.image}
                  />
                  <View style={styles.contentContainer}>
                    <View style={styles.textContainer}>
                      <Text style={styles.workoutTitle}>
                        {workoutItem.workout.name}{" "}
                        {workoutItem.workoutProgram.challengeworkout_id && (
                          <FontAwesome6
                            name="ranking-star"
                            size={12}
                            color={theme.colors.primary}
                          />
                        )}
                      </Text>
                      <Text style={styles.workoutDescription}>
                        {workoutItem.workout.description}
                      </Text>
                    </View>
                    <View style={styles.iconContainer}>
                      {workoutItem.workoutProgram.completed ? (
                        <Pressable
                          style={({ pressed }) => [
                            pressed && styles.pressed,
                            styles.deleteIcon,
                          ]}
                          onPress={() => confirmRemoveTracking(workoutItem)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={24}
                            color={"red"}
                          />
                        </Pressable>
                      ) : !isSelected ? (
                        <Feather
                          name="circle"
                          size={24}
                          color={theme.colors.black}
                        />
                      ) : (
                        <Feather
                          name="check-circle"
                          size={24}
                          color={"green"}
                        />
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })
          ) : (
            <Text>Add some workouts to your program!</Text>
          )}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        {workoutSelectedList.length > 0 && (
          <Button onPress={async () => trackWorkout()}>Add Tracking</Button>
        )}
      </View>
    </View>
  );
}
