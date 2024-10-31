import { Text, useTheme } from "@rneui/themed";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  useEquipmentStore,
  useExerciseEquipmentStore,
  useExerciseStore,
  useWorkoutExerciseStore,
  useWorkoutProgramStore,
  useWorkoutStore,
} from "../../../store/WorkoutStore";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  ProgramStackRoutes,
  WorkoutStackRoutes,
} from "../../navigation/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useLayoutEffect, useState } from "react";
import { Equipment, Exercise } from "../../../utils/Types";
import EquipmentHorizontalList from "../components/EquipmentHorizontalList";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "../../../utils/FormatDate";
import Button from "../../shared/components/Button";
import { supabase } from "../../../lib/SupaBase";
import { useUserStore } from "../../../store/UserStore";

const { width, height } = Dimensions.get("window");
const aspect = width / height;

export default function ViewWorkoutScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { workouts } = useWorkoutStore();
  const { workoutExercises } = useWorkoutExerciseStore();
  const { exercises } = useExerciseStore();
  const { equipments } = useEquipmentStore();
  const { exerciseEquipments } = useExerciseEquipmentStore();

  const { addWorkoutProgram, deleteWorkoutProgram } = useWorkoutProgramStore();

  const [exercisesInWorkout, setExercisesInWorkout] = useState<Exercise[]>([]);
  const [equipmentInWorkout, setEquipmentInWorkout] = useState<Equipment[]>([]);
  const [workoutDuration, setWorkoutDuration] = useState<number>(0);
  const navigation =
    useNavigation<NativeStackNavigationProp<WorkoutStackRoutes>>();

  const route = useRoute<RouteProp<WorkoutStackRoutes, "ViewWorkout">>();
  const id = route.params.id;
  const date = route.params.date;
  const workoutProgram_id = route.params.workoutProgram_id;
  const workout = workouts.find((workout) => workout.id === id);
  const challenge = route.params.challenge;

  useEffect(() => {
    if (!exercises || !workoutExercises) return;
    setExercisesInWorkout(
      workoutExercises
        .filter((we) => we.workout_id === id)
        .map((we) => exercises.find((e) => e.id === we.exercise_id)!)
    );
  }, [navigation, route.params]);

  useEffect(() => {
    setWorkoutDuration(
      exercisesInWorkout.reduce((acc, cur) => acc + cur.duration, 0)
    );
  }, [exercisesInWorkout]);

  useEffect(() => {
    if (!exercisesInWorkout || !exerciseEquipments || !equipments) return;

    const equipmentIds = exercisesInWorkout.flatMap((exercise) =>
      exerciseEquipments
        .filter((ee) => ee.exercise_id === exercise.id)
        .map((ee) => ee.equipment_id)
    );
    setEquipmentInWorkout(
      equipments.filter((equipment) => equipmentIds.includes(equipment.id))
    );
  }, [exercisesInWorkout, exerciseEquipments, equipments]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: formatDate(new Date(date)),
    });
  }, [navigation, route.params]);

  async function addToWorkoutProgram() {
    const { data, error } = await supabase
      .from("workoutprogram")
      .insert([
        {
          user_id: user?.id,
          workout_id: id,
          date: new Date(date),
        },
      ])
      .select("*")
      .single();
    if (error) {
      WorkoutAlert("Error", error.message);
      return;
    }
    addWorkoutProgram(data);
    navigation.navigate("WorkoutTopTabs");
  }

  async function removeFromWorkoutProgram() {
    const { data, error } = await supabase
      .from("workoutprogram")
      .delete()
      .eq("id", workoutProgram_id)
      .select()
      .single();
    if (error) {
      WorkoutAlert("Error", error.message);
      return;
    }
    deleteWorkoutProgram(data.id);
    navigation.navigate("WorkoutTopTabs");
  }
  const WorkoutAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    iconRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      width: 100,
    },
    iconPressable: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      width: 36,
      height: 36,
      marginHorizontal: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      flex: 1,
      width: height * aspect,
      height: width,
      justifyContent: "flex-start",
    },
    scrollContent: {
      paddingTop: 300,
    },
    contentContainer: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 16,
      color: "gray",
    },
    section: {
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
    },
    exerciseContainer: {
      padding: 5,
      marginVertical: 5,
      width: "100%",
      borderBottomWidth: 1,
      // borderTopWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    exerciseContent: {
      width: "90%",
    },
    exerciseRow: {
      flexDirection: "row",
      width: "75%",
      justifyContent: "space-between",
      paddingVertical: 10,
    },
    exerciseTitle: {
      fontSize: 15,
      fontWeight: "bold",
    },
    buttonContainer: {
      paddingVertical: 10,
      width: "100%",
    },
    button: {
      marginVertical: 15,
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
  });

  const webStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
    iconRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      width: 100,
    },
    iconPressable: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      width: 36,
      height: 36,
      marginHorizontal: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContent: {},
    contentContainer: {
      padding: 20,
    },
    titleHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "75%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 16,
      color: "gray",
    },
    section: {
      marginTop: 20,
      width: "75%",
      justifyContent: "space-between",
      // alignItems: "center",
    },
    exerciseSection: {
      marginTop: 20,
      width: "75%",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
    },
    exerciseContainer: {
      padding: 5,
      marginVertical: 5,
      width: "100%",
      borderBottomWidth: 1,
      // borderTopWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    exerciseContent: {
      width: "90%",
    },
    exerciseRow: {
      flexDirection: "row",
      width: "75%",
      justifyContent: "space-between",
      paddingVertical: 10,
    },
    exerciseTitle: {
      fontSize: 15,
      fontWeight: "bold",
    },
    button: {
      marginVertical: 15,
    },
    block: {
      width: "50%",
      alignItems: "center",
      justifyContent: "center",
    },
    blockContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    image: {
      width: width / 5,
      height: width / 5,
      borderRadius: 20,
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
  });

  return !isWeb ? (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        resizeMode="cover"
        source={
          workout?.pictureurl
            ? { uri: workout.pictureurl }
            : require("../../../assets/icon.png")
        }
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>{workout?.name}</Text>
              <Text style={styles.subtitle}>
                {exercisesInWorkout.length} Exercises | {workoutDuration} mins
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{workout?.description}</Text>
            </View>
            <View style={styles.section}></View>
            <View style={styles.section}>
              <View style={styles.header}>
                <Text style={styles.sectionTitle}>You'll need</Text>
                <Text style={styles.subtitle}>
                  {equipmentInWorkout.length} Items
                </Text>
              </View>
              <EquipmentHorizontalList equipments={equipmentInWorkout} />
            </View>
            <View style={styles.section}>
              <View style={styles.header}>
                <Text style={styles.sectionTitle}>Exercises</Text>
              </View>
              {exercisesInWorkout.map((exercise) => {
                return (
                  <Pressable
                    key={exercise.id.toString()}
                    style={({ pressed }) => [
                      styles.exerciseContainer,
                      pressed && styles.pressed,
                    ]}
                    onPress={() =>
                      navigation.navigate("ViewExercise", {
                        id: exercise.id,
                      })
                    }
                  >
                    <View style={styles.exerciseContent}>
                      <View style={styles.exerciseRow}>
                        <Text style={styles.exerciseTitle}>
                          {exercise.name}
                        </Text>
                        <Text style={styles.subtitle}>
                          {exercise.duration} mins
                        </Text>
                      </View>
                      <Text>{exercise.description}</Text>
                      <View style={styles.exerciseRow}>
                        <Text>Sets: {exercise.sets}</Text>
                        <Text>Reps: {exercise.repititions}</Text>
                        {exercise.weight && (
                          <Text>Weight: {exercise.weight}Kg</Text>
                        )}
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward-circle-outline"
                      size={24}
                      color={theme.colors.black}
                    />
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.buttonContainer}>
              {challenge ? null : !workoutProgram_id ? (
                <Button onPress={async () => await addToWorkoutProgram()}>
                  Add Workout
                </Button>
              ) : (
                <Button onPress={async () => await removeFromWorkoutProgram()}>
                  Remove Workout
                </Button>
              )}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  ) : (
    <View style={webStyles.container}>
      <ScrollView contentContainerStyle={webStyles.scrollContent}>
        <View style={webStyles.contentContainer}>
          <View style={webStyles.blockContainer}>
            <View style={webStyles.block}>
              <View style={webStyles.titleHeader}>
                <Text style={webStyles.title}>{workout?.name}</Text>
                <Text style={webStyles.subtitle}>
                  {exercisesInWorkout.length} Exercises | {workoutDuration} mins
                </Text>
              </View>
              <View style={webStyles.section}>
                <Text style={webStyles.sectionTitle}>Description</Text>
                <Text style={webStyles.description}>
                  {workout?.description}
                </Text>
              </View>
              <View style={webStyles.section}></View>
              <View style={webStyles.section}>
                <View style={webStyles.header}>
                  <Text style={webStyles.sectionTitle}>You'll need</Text>
                  <Text style={webStyles.subtitle}>
                    {equipmentInWorkout.length} Items
                  </Text>
                </View>
              </View>
              <EquipmentHorizontalList equipments={equipmentInWorkout} />
            </View>
            <View style={webStyles.block}>
              <Image
                style={webStyles.image}
                source={
                  workout?.pictureurl
                    ? { uri: workout.pictureurl }
                    : require("../../../assets/icon.png")
                }
              />
            </View>
          </View>
          <View style={webStyles.exerciseSection}>
            <View style={webStyles.header}>
              <Text style={webStyles.sectionTitle}>Exercises</Text>
            </View>
            {exercisesInWorkout.map((exercise) => {
              return (
                <Pressable
                  key={exercise.id.toString()}
                  style={({ pressed }) => [
                    webStyles.exerciseContainer,
                    pressed && webStyles.pressed,
                  ]}
                  onPress={() =>
                    navigation.navigate("ViewExercise", {
                      id: exercise.id,
                    })
                  }
                >
                  <View style={webStyles.exerciseContent}>
                    <View style={webStyles.exerciseRow}>
                      <Text style={webStyles.exerciseTitle}>
                        {exercise.name}
                      </Text>
                      <Text style={webStyles.subtitle}>
                        {exercise.duration} mins
                      </Text>
                    </View>
                    <Text>{exercise.description}</Text>
                    <View style={webStyles.exerciseRow}>
                      <Text>Sets: {exercise.sets}</Text>
                      <Text>Reps: {exercise.repititions}</Text>
                      {exercise.weight && (
                        <Text>Weight: {exercise.weight}Kg</Text>
                      )}
                    </View>
                  </View>
                  <Ionicons
                    name="chevron-forward-circle-outline"
                    size={24}
                    color={theme.colors.black}
                  />
                </Pressable>
              );
            })}
          </View>
          <View style={styles.buttonContainer}>
            {challenge ? null : !workoutProgram_id ? (
              <Button onPress={async () => await addToWorkoutProgram()}>
                Add Workout
              </Button>
            ) : (
              <Button onPress={async () => await removeFromWorkoutProgram()}>
                Remove Workout
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
