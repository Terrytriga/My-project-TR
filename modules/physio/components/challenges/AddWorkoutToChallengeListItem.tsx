import { Text, useTheme } from "@rneui/themed";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Workout } from "../../../../utils/Types";
import {
  useEditChallengeStore,
  useNewChallengeStore,
} from "../../../../store/WorkoutStore";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "../../../../utils/FormatDate";

interface AddWorkoutToChallengeListItemProps {
  workout: Workout;
  workoutDate: Date;
  duration: number;
  exerciseCount: number;
}

const { width } = Dimensions.get("window");
const aspect = 12 / 12;

export default function AddWorkoutToChallengeListItem({
  workout,
  workoutDate,
  duration,
  exerciseCount,
}: AddWorkoutToChallengeListItemProps) {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();

  const {
    challenge: newChallenge,
    addChallengeWorkout: addNewChallengeWorkout,
  } = useNewChallengeStore();

  const {
    challenge: editChallenge,
    addChallengeWorkout: addEditChallengeWorkout,
  } = useEditChallengeStore();

  function addWorkoutToChallenge() {
    if (newChallenge) {
      addNewChallengeWorkout({
        workout_id: workout.id,
        date: workoutDate,
      });
      ExcerciseItemAlert(`${workout.name} added to challenge.`, "");
    } else if (editChallenge) {
      addEditChallengeWorkout({
        workout_id: workout.id,
        challenge_id: editChallenge.id,
        date: workoutDate,
      });
      ExcerciseItemAlert(`${workout.name} added to challenge.`, "");
    }
  }

  function ExcerciseItemAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  }

  function confirmAddExercise() {
    if (isWeb) addWorkoutToChallenge();
    Alert.alert(
      `Add ${workout.name} to challenge?`,
      `Confirming will add this workout to the challenge on the ${formatDate(
        workoutDate
      )}.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => addWorkoutToChallenge(),
        },
      ]
    );
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 10,
      width: Platform.OS !== "web" ? "100%" : 700,
    },
    textContainer: {
      width: "50%",
      padding: 10,
    },
    imageContainer: {
      alignItems: "flex-end",
      justifyContent: "center",
      width: "50%",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      alignSelf: "center",
    },

    description: {
      fontSize: 15,
      marginVertical: 10,
    },
    details: {
      fontSize: 13,
    },
    image: {
      width: Platform.OS !== "web" ? width / 2 : width / 7,
      height: Platform.OS !== "web" ? width / 2 / aspect : width / 7 / aspect,
      borderRadius: 10,
    },
    icon: {
      marginRight: 5,
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
    },
    date: {
      fontSize: 10,
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={confirmAddExercise}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{workout.name}</Text>
        <Text style={styles.details}>Exercises: {exerciseCount}</Text>
        <Text style={styles.details}>Duration: {duration} mins</Text>
        <Text style={styles.description}>{workout.description}</Text>
        <View style={styles.dateContainer}>
          <Ionicons
            style={styles.icon}
            name="ellipse-sharp"
            size={16}
            color={theme.colors.primary}
          />
          <Text style={styles.date}>
            Published: {formatDate(new Date(workout.datecreated))}
          </Text>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: workout.pictureurl }} />
      </View>
    </Pressable>
  );
}
