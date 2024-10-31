import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { useWorkoutStore } from "../../../store/WorkoutStore";
import WorkoutList from "../components/WorkoutList";
import { RouteProp, useRoute } from "@react-navigation/native";
import { WorkoutStackRoutes } from "../../navigation/Routes";

export default function ViewAllWorkoutScreen() {
  const route = useRoute<RouteProp<WorkoutStackRoutes, "ViewAllWorkouts">>();
  const date = route.params.date;
  const { workouts } = useWorkoutStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: workouts.length === 0 ? "center" : undefined,
    },
  });
  return (
    <View style={styles.container}>
      {workouts.length !== 0 ? (
        <WorkoutList workouts={workouts} date={new Date(date)} />
      ) : (
        <Text>No Workouts.</Text>
      )}
    </View>
  );
}
