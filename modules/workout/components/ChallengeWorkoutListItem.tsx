import { Text, useTheme } from "@rneui/themed";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ChallengeWorkoutItem } from "../../../utils/Types";
import { formatDate } from "../../../utils/FormatDate";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  PhysioChallengeStack,
  WorkoutStackRoutes,
} from "../../navigation/Routes";

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
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<WorkoutStackRoutes>>();

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
      onPress={() =>
        navigation.navigate("ViewWorkout", {
          id: challengeWorkout.workout.id,
          date: challengeWorkout.workoutChallenge.date.toString(),
          challenge: true,
        })
      }
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
