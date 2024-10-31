import { Text, useTheme } from "@rneui/themed";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import {
  useChallengeStore,
  useChallengeWorkoutStore,
  useEditChallengeStore,
  useNewChallengeStore,
  useWorkoutProgramStore,
} from "../../../../store/WorkoutStore";
import ChallengeList from "../../components/challenges/ChallengeList";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { PhysioChallengeStack } from "../../../navigation/Routes";
import { useEffect, useLayoutEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ChallengeWorkoutList from "../../components/challenges/ChallengeWorkoutList";
import ViewChallengeWorkoutList from "../../components/challenges/ViewChallengeWorkoutList";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../../lib/SupaBase";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import { Challenge, ChallengeWorkout } from "../../../../utils/Types";

export default function ViewPhysioChallengeScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioChallengeStack>>();
  const route =
    useRoute<RouteProp<PhysioChallengeStack, "ViewPhysioChallenge">>();
  const id = route.params.id;
  const { challenges, deleteChallenge } = useChallengeStore();
  const { challengeWorkouts: challengeWorkoutStore, deleteChallengeWorkout } =
    useChallengeWorkoutStore();
  const { deleteWorkoutProgram } = useWorkoutProgramStore();
  const { clearChallenge } = useNewChallengeStore();

  const {
    setChallenge: setEditChallenge,
    setChallengeWorkouts: setEditChallengeWorkouts,
  } = useEditChallengeStore();

  const [challenge, setChallenge] = useState<Challenge>();
  const [challengeWorkouts, setChallengeWorkouts] = useState<
    ChallengeWorkout[]
  >([]);

  useEffect(() => {
    if (!challenges) return;
    setChallenge(challenges.find((challenge) => challenge.id === id));
    setChallengeWorkouts(
      challengeWorkoutStore.filter(
        (challengeWorkout) => challengeWorkout.challenge_id === id
      )
    );
  }, [challengeWorkoutStore, challenges, navigation, route]);

  function navigateEditChallenge() {
    if (!challenge) return;
    clearChallenge();
    setEditChallenge(challenge);
    setEditChallengeWorkouts(challengeWorkouts);
    navigation.navigate("EditPhysioChallenge");
  }

  async function deleteTheChallenge() {
    if (!challengeWorkouts || !challenge) return;
    setIsLoading(true);
    const { data: challengeWorkoutsData, error: challengeWorkoutsError } =
      await supabase
        .from("challengeworkout")
        .delete()
        .eq("challenge_id", id)
        .select();
    if (challengeWorkoutsError) {
      ChalleneAlert("Error", challengeWorkoutsError.message);
      setIsLoading(false);
      return;
    }
    challengeWorkoutsData.forEach((item) => {
      deleteChallengeWorkout(item.id);
    });

    const challengeWorkoutIds = challengeWorkoutsData.map((item) => item.id);
    const { data: workoutProgramData, error: workoutProgramError } =
      await supabase
        .from("workoutprogram")
        .delete()
        .in("challengeworkout_id", challengeWorkoutIds)
        .select();
    if (workoutProgramError) {
      ChalleneAlert("Error", workoutProgramError.message);
      setIsLoading(false);
      return;
    }
    workoutProgramData.forEach((item) => {
      deleteWorkoutProgram(item.id);
    });

    const { data: challengeData, error: challengeError } = await supabase
      .from("challenge")
      .delete()
      .eq("id", id)
      .select()
      .single();
    if (challengeError) {
      ChalleneAlert("Error", challengeError.message);
      setIsLoading(false);
      return;
    }
    const removeSpaces = challenge.title.replace(/\s/g, "");
    const { error: removeError } = await supabase.storage
      .from("Public")
      .remove([`Challenges/${removeSpaces}`]);

    if (removeError) {
      ChalleneAlert("Error", removeError.message);
      setIsLoading(false);
      return;
    }

    ChalleneAlert(
      "Challenge Deleted",
      `Successfully deleted challenge ${challenge.title}.`
    );

    deleteChallenge(challengeData.id);
    navigation.navigate("PhysioChallenges");
    setIsLoading(false);
  }

  function confirmDelete() {
    if (isWeb) deleteTheChallenge();
    Alert.alert(
      "Delete Challenge",
      "Are you sure you want to delete this challenge?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTheChallenge(),
        },
      ]
    );
  }

  function ChalleneAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "OK", style: "default" }]);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: challenge?.title,
      headerRight: () => {
        return (
          <View style={styles.iconRow}>
            <Pressable
              style={({ pressed }) => [
                pressed && styles.pressed,
                styles.iconPressable,
              ]}
              onPress={navigateEditChallenge}
            >
              <Ionicons name="pencil" size={24} color={theme.colors.primary} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.iconPressable,
                pressed && styles.pressed,
              ]}
              onPress={confirmDelete}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
        );
      },
    });
  }, [route, navigation, challenge]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: challenges.length === 0 ? "center" : undefined,
      alignItems: "center",
    },
    iconRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      width: 100,
    },
    iconPressable: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      width: 36,
      height: 36,
      marginHorizontal: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
  });

  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : (
    <View style={styles.container}>
      {challenges.length !== 0 ? (
        <ViewChallengeWorkoutList challengeWorkouts={challengeWorkouts} />
      ) : (
        <Text>No challenges found</Text>
      )}
    </View>
  );
}
