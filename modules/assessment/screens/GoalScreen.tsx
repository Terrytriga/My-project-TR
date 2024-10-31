import { Text, useTheme } from "@rneui/themed";
import { Alert, Platform, StyleSheet, View } from "react-native";
import {
  useNewAssessmentStore,
  useGoalStore,
} from "../../../store/AssessmentStore";
import GoalList from "../components/GoalList";
import { Goal } from "../../../utils/Types";
import { useEffect, useLayoutEffect, useState } from "react";
import Button from "../../shared/components/Button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AssessmentStackRoutes } from "../../navigation/Routes";

export default function GoalScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { goals } = useGoalStore();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const { setGoal, user, goal } = useNewAssessmentStore();

  const navigation =
    useNavigation<NativeStackNavigationProp<AssessmentStackRoutes>>();

  useLayoutEffect(() => {
    const totalCount = user?.gender === "Female" ? 10 : 9;
    navigation.setOptions({
      headerLeft: () => {
        return <View></View>;
      },
      headerRight: () => {
        return (
          <View style={styles.headerContainer}>
            <Text>1 OF {totalCount}</Text>
          </View>
        );
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (!goals || !goal) return;
    setSelectedGoal(goals.find((g) => g.id === goal.goal_id) || null);
  }, [goal, goals]);

  function handleSelectGoal(item: Goal) {
    setSelectedGoal(item);
  }

  function submitHandler() {
    if (!user?.id) return;
    if (!selectedGoal) {
      AssessmentAlert("No Goal Selected", "Please select a goal to continue.");
      return;
    }
    setGoal({
      user_id: user.id,
      goal_id: selectedGoal.id,
      datecreated: new Date(),
    });
    navigation.navigate("Moods", { user_id: user.id });
  }

  function AssessmentAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "OK" }]);
  }

  function skip() {
    if (!user?.id) return;
    navigation.navigate("Moods", { user_id: user.id });
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingBottom: 20,
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 20,
    },
    headerContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.primary,
      padding: 10,
      borderRadius: 20,
    },
    skipButton: {
      backgroundColor: theme.colors.senary,
    },
    buttonContainer: {
      justifyContent: "space-between",
      width: !isWeb ? "100%" : "50%",
      flexDirection: "row",
      paddingHorizontal: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is your goal today?</Text>
      <GoalList
        goals={goals}
        onPress={handleSelectGoal}
        selectedGoal={selectedGoal}
      />
      <View style={styles.buttonContainer}>
        <Button style={styles.skipButton} onPress={skip}>
          Skip
        </Button>
        <Button onPress={submitHandler}>Continue</Button>
      </View>
    </View>
  );
}
