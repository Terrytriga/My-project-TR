import { Text } from "@rneui/themed";
import { Alert, Platform, StyleSheet, View } from "react-native";
import {
  useChallengeWorkoutStore,
  useEditChallengeStore,
} from "../../../../store/WorkoutStore";
import ChallengeWorkoutList from "../../components/challenges/ChallengeWorkoutList";
import FloatingButton from "../../../shared/components/FloatingButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioChallengeStack } from "../../../navigation/Routes";
import Button from "../../../shared/components/Button";
import { supabase } from "../../../../lib/SupaBase";
import { useState } from "react";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";

export default function EditPhysioWorkoutChallengeScreen() {
  const isWeb = Platform.OS === "web";
  const { challengeWorkouts, challenge, clearChallenge } =
    useEditChallengeStore();
  const { addChallengeWorkout } = useChallengeWorkoutStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioChallengeStack>>();

  async function finishChallenge() {
    if (!challenge) return;
    setIsLoading(true);

    const challengeWorkoutDetails = challengeWorkouts
      .filter((challengeWorkout) => !challengeWorkout.id)
      .map((challengeWorkout) => {
        return {
          challenge_id: challenge.id,
          workout_id: challengeWorkout.workout_id,
          date: challengeWorkout.date,
        };
      });
    const { data: challengeWorkoutData, error: challengeWorkoutError } =
      await supabase
        .from("challengeworkout")
        .insert(challengeWorkoutDetails)
        .select("*");
    if (challengeWorkoutError) {
      ChallengeAlert("Error", challengeWorkoutError.message);
      return;
    }
    challengeWorkoutData.forEach((item) => {
      addChallengeWorkout(item);
    });
    navigation.navigate("PhysioChallenges");
    clearChallenge();
    setIsLoading(false);
  }

  function ChallengeAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "OK", style: "default" }]);
  }

  function confirmFinish() {
    if (isWeb) finishChallenge();
    Alert.alert(
      "Finish Challenge",
      "Are you sure you want to finish this challenge?",
      [
        {
          text: "Cancel",
          onPress: () => {},
        },
        {
          text: "Confirm",
          onPress: async () => await finishChallenge(),
        },
      ]
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: challengeWorkouts.length === 0 ? "center" : undefined,
      alignItems: "center",
      paddingBottom: 20,
    },
  });

  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : (
    <View style={styles.container}>
      {challengeWorkouts.length > 0 ? (
        <ChallengeWorkoutList challengeWorkouts={challengeWorkouts} />
      ) : (
        <Text>No workouts added yet.</Text>
      )}
      <FloatingButton
        icon={"add-circle-outline"}
        onPress={() => navigation.navigate("AddPhysioWorkoutToChallenge")}
      />
      {challengeWorkouts.length !== 0 && (
        <Button onPress={confirmFinish}>Finish</Button>
      )}
    </View>
  );
}
