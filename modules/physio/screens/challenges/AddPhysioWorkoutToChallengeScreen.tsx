import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { useWorkoutStore } from "../../../../store/WorkoutStore";
import AddWorkoutToChallengeList from "../../components/challenges/AddWorkoutToChallengeList";

export default function AddPhysioWorkoutToChallengeScreen() {
  const { workouts } = useWorkoutStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: workouts.length === 0 ? "center" : undefined,
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      {workouts.length !== 0 ? (
        <AddWorkoutToChallengeList workouts={workouts} />
      ) : (
        <Text>No Workouts</Text>
      )}
    </View>
  );
}
