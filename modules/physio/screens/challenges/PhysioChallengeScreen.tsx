import { Text } from "@rneui/themed";
import { Platform, StyleSheet, View } from "react-native";
import ChallengeList from "../../components/challenges/ChallengeList";
import {
  useChallengeStore,
  useEditChallengeStore,
} from "../../../../store/WorkoutStore";
import FloatingButton from "../../../shared/components/FloatingButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioChallengeStack } from "../../../navigation/Routes";
import { useLayoutEffect } from "react";
import AddButtonHeader from "../../../shared/components/AddButtonHeader";

export default function PhysioChallengeScreen() {
  const isWeb = Platform.OS === "web";
  const { challenges } = useChallengeStore();
  const { clearChallenge } = useEditChallengeStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioChallengeStack>>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: challenges.length === 0 ? "center" : undefined,
      alignItems: "center",
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AddButtonHeader onPress={() => navigateAddChallenge()}>
          Add
        </AddButtonHeader>
      ),
      headerShown: true,
      title: "",
    });
  }, [navigation]);

  function navigateAddChallenge() {
    clearChallenge();
    navigation.navigate("AddPhysioChallenge");
  }

  return (
    <View style={styles.container}>
      {challenges.length !== 0 ? (
        <ChallengeList challenges={challenges} />
      ) : (
        <Text>No challenges found</Text>
      )}
    </View>
  );
}
