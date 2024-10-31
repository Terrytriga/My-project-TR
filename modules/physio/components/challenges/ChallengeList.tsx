import { useCallback } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ChallengeListItem from "./ChallengeListItem";
import { Challenge } from "../../../../utils/Types";
import { PhysioChallengeStack } from "../../../navigation/Routes";
import {
  useChallengeWorkoutStore,
  useWorkoutStore,
} from "../../../../store/WorkoutStore";

interface ChallengeListProps {
  challenges: Challenge[];
}

export default function ChallengeList({ challenges }: ChallengeListProps) {
  const { workouts } = useWorkoutStore();
  const { challengeWorkouts } = useChallengeWorkoutStore();

  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioChallengeStack>>();

  function navigationHandler(challenge: Challenge) {
    if (!challenge || !challenge.id) return;
    navigation.navigate("ViewPhysioChallenge", { id: challenge.id });
  }

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Challenge>) => {
      const filteredWorkouts = challengeWorkouts.filter((challengeWorkout) =>
        workouts.find((workout) => workout.id === challengeWorkout.workout_id)
      );

      return (
        <ChallengeListItem
          workoutCount={filteredWorkouts.length}
          onPress={() => navigationHandler(item)}
          challenge={item}
        />
      );
    },
    [challengeWorkouts, challenges]
  );

  const styles = StyleSheet.create({
    container: {
      marginVertical: 5,
      width: "100%",
    },
    contentStyle: {
      justifyContent: "center",
      alignItems: "center",
      width: Platform.OS === "web" ? "100%" : undefined,
      marginHorizontal: 5,
    },
  });

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={challenges}
      renderItem={renderItem}
      keyExtractor={(challenge) => challenge.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
