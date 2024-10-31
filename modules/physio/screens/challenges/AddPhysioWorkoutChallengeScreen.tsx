import { Text } from "@rneui/themed";
import { Alert, Platform, StyleSheet, View } from "react-native";
import {
  useChallengeStore,
  useChallengeWorkoutStore,
  useNewChallengeStore,
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
import { decode } from "base64-arraybuffer";

export default function AddPhysioWorkoutChallengeScreen() {
  const isWeb = Platform.OS === "web";
  const { challengeWorkouts, challenge, clearChallenge } =
    useNewChallengeStore();
  const { addChallenge } = useChallengeStore();
  const { addChallengeWorkout } = useChallengeWorkoutStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioChallengeStack>>();

  const getPublicUrl = async (filePath: string) => {
    if (!filePath) return;
    const { data: publicUrlData } = supabase.storage
      .from("Public")
      .getPublicUrl(filePath);
    if (publicUrlData) {
      return publicUrlData.publicUrl;
    }
  };

  const uploadImage = async () => {
    if (!challenge) return;
    const removeSpaces = challenge.title.replace(/\s/g, "");
    const filePath = `Challenges/${removeSpaces}`;
    const base64 = challenge.picture.base64;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Public")
      .upload(filePath, decode(base64!), {
        contentType: challenge.picture.mimeType,
      });

    if (uploadError || !uploadData) {
      ChallengeAlert("Error Uploading", uploadError.message);
      return;
    }

    return await getPublicUrl(uploadData.path);
  };

  async function finishChallenge() {
    if (!challenge) return;
    setIsLoading(true);

    const challengeDetails = {
      title: challenge.title,
      description: challenge.description,
      pictureurl: await uploadImage(),
      datecreated: new Date(),
    };
    const { data: challengeData, error: challengeError } = await supabase
      .from("challenge")
      .insert([challengeDetails])
      .select("*")
      .single();
    if (challengeError) {
      ChallengeAlert("Error", challengeError.message);
      return;
    }
    addChallenge(challengeData);

    const challengeWorkoutDetails = challengeWorkouts.map(
      (challengeWorkout) => {
        return {
          challenge_id: challengeData.id,
          workout_id: challengeWorkout.workout_id,
          date: challengeWorkout.date,
        };
      }
    );
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

  async function confirmFinish() {
    if (isWeb) await finishChallenge();
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
