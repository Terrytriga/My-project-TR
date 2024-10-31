import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { useWorkoutStore } from "../../../../../store/WorkoutStore";
import WorkoutList from "../../../components/workouts/workout/WorkoutList";
import FloatingButton from "../../../../shared/components/FloatingButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioWorkoutStack } from "../../../../navigation/Routes";
import { useLayoutEffect } from "react";
import AddButtonHeader from "../../../../shared/components/AddButtonHeader";

export default function PhysioWorkoutScreen() {
  const { workouts } = useWorkoutStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioWorkoutStack>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AddButtonHeader
          onPress={() => navigation.navigate("AddPhysioWorkout")}
        >
          Add
        </AddButtonHeader>
      ),
      headerShown: true,
      title: "",
    });
  }, [navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      {workouts.length === 0 ? (
        <Text>No Workouts</Text>
      ) : (
        <WorkoutList workouts={workouts} />
      )}
    </View>
  );
}
