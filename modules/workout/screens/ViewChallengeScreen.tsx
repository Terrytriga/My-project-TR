import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Text } from "@rneui/themed";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { WorkoutStackRoutes } from "../../navigation/Routes";
import {
  useChallengeStore,
  useChallengeWorkoutStore,
  useWorkoutProgramStore,
  useWorkoutStore,
} from "../../../store/WorkoutStore";
import WorkoutList from "../components/WorkoutList";
import ChallengeWorkoutList from "../components/ChallengeWorkoutList";
import { useLayoutEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../shared/components/Button";
import { supabase } from "../../../lib/SupaBase";
import { useUserStore } from "../../../store/UserStore";
import LoadingOverlay from "../../shared/components/LoadingOverlay";

export default function ViewChallengeScreen() {
  const isWeb = Platform.OS === "web";
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<WorkoutStackRoutes>>();
  const route = useRoute<RouteProp<WorkoutStackRoutes, "ViewChallenge">>();
  const id = route.params.id;
  const { challengeWorkouts: challengeWorkoutStore } =
    useChallengeWorkoutStore();
  const { challenges } = useChallengeStore();
  const { addWorkoutProgram, workoutPrograms } = useWorkoutProgramStore();

  const challenge = challenges.find((challenge) => challenge.id === id);
  const challengeWorkouts = challengeWorkoutStore.filter(
    (challengeWorkout) => challengeWorkout.challenge_id === id
  );
  const alreadyJoined = workoutPrograms.some(
    (workoutProgram) => workoutProgram.challengeworkout_id === id
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      title: challenge?.title || "Challenge",
    });
  }, [route]);

  async function joinChallenge() {
    if (!user) return;
    setIsLoading(true);
    const insertData = challengeWorkouts.map((challengeWorkout) => {
      return {
        workout_id: challengeWorkout.workout_id,
        date: challengeWorkout.date,
        challengeworkout_id: challengeWorkout.id,
        user_id: user.id,
      };
    });
    const { data, error } = await supabase
      .from("workoutprogram")
      .insert(insertData)
      .select("*");
    if (error) {
      ChallengeAlert("Error", error.message);
      setIsLoading(false);
      return;
    }
    data.forEach((item) => addWorkoutProgram(item));

    ChallengeAlert("Success", "You have joined the challenge successfully");
    setIsLoading(false);
    navigation.navigate("WorkoutTopTabs");
  }

  async function confirmChallenge() {
    if (isWeb) await joinChallenge();
    Alert.alert(
      "Confirm Challenge",
      "Are you sure you want to join this challenge?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Join",
          onPress: async () => await joinChallenge(),
        },
      ]
    );
  }
  function ChallengeAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "Ok", style: "default" }]);
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : (
    <View style={styles.container}>
      {!alreadyJoined && (
        <Button onPress={confirmChallenge}>Join Challenge</Button>
      )}
      <ChallengeWorkoutList challengeWorkouts={challengeWorkouts} />
    </View>
  );
}
