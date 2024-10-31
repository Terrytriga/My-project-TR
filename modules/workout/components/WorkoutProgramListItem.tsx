import { Text, useTheme } from "@rneui/themed";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { WorkoutProgramItem } from "../../../utils/Types";
import { formatDate } from "../../../utils/FormatDate";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useChallengeStore } from "../../../store/WorkoutStore";

type WorkoutProgramListItemProps = {
  workoutProgramItem: WorkoutProgramItem;
  exerciseCount: number;
  duration: number;
  onPress: () => void;
};

const { width } = Dimensions.get("window");
const aspect = 12 / 12;

export default function WorkoutProgramListItem({
  workoutProgramItem,
  exerciseCount,
  duration,
  onPress,
}: WorkoutProgramListItemProps) {
  const { theme } = useTheme();
  const { challenges } = useChallengeStore();
  const challenge = challenges.find(
    (challenge) =>
      challenge.id === workoutProgramItem.workoutProgram.challengeworkout_id
  );

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
    challengeIconContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      flexDirection: "row",
    },
    challengeText: {
      color: theme.colors.primary,
      fontSize: 16,
      marginHorizontal: 20,
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      {workoutProgramItem.workoutProgram.challengeworkout_id && (
        <View style={styles.challengeIconContainer}>
          <Text style={styles.challengeText}>{challenge?.title}</Text>
          <FontAwesome6
            name="ranking-star"
            size={24}
            color={theme.colors.primary}
          />
        </View>
      )}
      <View style={{ flexDirection: "row" }}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{workoutProgramItem.workout.name}</Text>
          <Text style={styles.details}>Exercises: {exerciseCount}</Text>
          <Text style={styles.details}>Duration: {duration} mins</Text>
          <Text style={styles.description}>
            {workoutProgramItem.workout.description}
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
              {formatDate(new Date(workoutProgramItem.workout.datecreated))}
            </Text>
          </View>
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: workoutProgramItem.workout.pictureurl }}
          />
        </View>
      </View>
    </Pressable>
  );
}
