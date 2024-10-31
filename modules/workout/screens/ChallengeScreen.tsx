import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import ChallengeList from "../components/ChallengeList";
import { useChallengeStore } from "../../../store/WorkoutStore";

export default function ChallengeScreen() {
  const { challenges } = useChallengeStore();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: challenges.length === 0 ? "center" : undefined,
    },
  });
  return (
    <View style={styles.container}>
      {challenges.length !== 0 ? (
        <ChallengeList challenges={challenges} />
      ) : (
        <Text>No challenges</Text>
      )}
    </View>
  );
}
