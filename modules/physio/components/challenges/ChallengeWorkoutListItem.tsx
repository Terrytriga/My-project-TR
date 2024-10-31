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
import { Ionicons } from "@expo/vector-icons";
import {
  ChallengeWorkoutItem,
  NewChallengeWorkout,
  Workout,
} from "../../../../utils/Types";
import { formatDate } from "../../../../utils/FormatDate";
import {
  useChallengeWorkoutStore,
  useEditChallengeStore,
  useNewChallengeStore,
} from "../../../../store/WorkoutStore";
import { supabase } from "../../../../lib/SupaBase";

type ChallengeWorkoutItemProps = {
  challengeWorkout: ChallengeWorkoutItem;
  exerciseCount: number;
  duration: number;
};

const { width } = Dimensions.get("window");
const aspect = 12 / 12;

export default function ChallengeWorkoutListItem({
  challengeWorkout,
  exerciseCount,
  duration,
}: ChallengeWorkoutItemProps) {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();

  const {
    challenge: newChallenge,
    deleteChallengeWorkout: deleteNewChallengeWorkout,
  } = useNewChallengeStore();
  const {
    challenge: editChallenge,
    deleteChallengeWorkout: deleteEditChallengeWorkout,
  } = useEditChallengeStore();
  const { deleteChallengeWorkout } = useChallengeWorkoutStore();

  async function deleteChallengeWorkoutItem() {
    if (newChallenge) {
      deleteNewChallengeWorkout(challengeWorkout.workoutChallenge);
    }
    if (editChallenge) {
      if (challengeWorkout.workoutChallenge.id) {
        const { error } = await supabase
          .from("challengeworkout")
          .delete()
          .eq("id", challengeWorkout.workoutChallenge.id);
        if (error) {
          ChallengeAlert("Error", error.message);
          return;
        }
        deleteChallengeWorkout(challengeWorkout.workoutChallenge.id);
      }
      deleteEditChallengeWorkout(challengeWorkout.workoutChallenge);
    }
  }
  function ChallengeAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "OK", style: "default" }]);
  }

  function confirmDelete() {
    if (isWeb) deleteChallengeWorkoutItem();
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout from the challenge?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: deleteChallengeWorkoutItem,
        },
      ]
    );
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
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
    scheduledText: {
      fontSize: 15,
      marginVertical: 10,
      color: theme.colors.primary,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 10,
      padding: 5,
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
      onPress={confirmDelete}
    >
      <Text style={styles.scheduledText}>
        Scheduled:{" "}
        {formatDate(new Date(challengeWorkout.workoutChallenge.date))}
      </Text>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{challengeWorkout.workout.name}</Text>
          <Text style={styles.details}>Exercises: {exerciseCount}</Text>
          <Text style={styles.details}>Duration: {duration} mins</Text>
          <Text style={styles.description}>
            {challengeWorkout.workout.description}
          </Text>
          <View style={styles.dateContainer}>
            <Ionicons
              style={styles.icon}
              name="ellipse-sharp"
              size={16}
              color={theme.colors.primary}
            />
            <Text style={styles.date}>
              Published:{" "}
              {formatDate(new Date(challengeWorkout.workout.datecreated))}
            </Text>
          </View>
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: challengeWorkout.workout.pictureurl }}
          />
        </View>
      </View>
    </Pressable>
  );
}
