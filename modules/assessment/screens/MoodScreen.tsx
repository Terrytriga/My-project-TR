import { Text, useTheme } from "@rneui/themed";
import { Alert, Platform, StyleSheet, View } from "react-native";
import {
  useNewAssessmentStore,
  useMoodStore,
} from "../../../store/AssessmentStore";
import { useEffect, useLayoutEffect, useState } from "react";
import { Mood } from "../../../utils/Types";
import { useUserStore } from "../../../store/UserStore";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AssessmentStackRoutes } from "../../navigation/Routes";
import Button from "../../shared/components/Button";
import MoodList from "../components/MoodList";

export default function MoodScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { moods } = useMoodStore();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const { setMood, mood, user } = useNewAssessmentStore();
  const route = useRoute<RouteProp<AssessmentStackRoutes, "Moods">>();
  const user_id = route.params.user_id;

  const navigation =
    useNavigation<NativeStackNavigationProp<AssessmentStackRoutes>>();

  useLayoutEffect(() => {
    const totalCount = user?.gender === "Female" ? 10 : 9;
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={styles.headerContainer}>
            <Text>2 OF {totalCount}</Text>
          </View>
        );
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (!moods || !mood) return;
    setSelectedMood(moods.find((m) => m.id === mood.mood_id) || null);
  }, [mood, moods]);

  function handleSelectMood(item: Mood) {
    setSelectedMood(item);
  }

  function submitHandler() {
    if (!user_id) return;
    if (!selectedMood) {
      AssessmentAlert("No mood Selected", "Please select a mood to continue.");
      return;
    }

    setMood({
      user_id: user_id,
      mood_id: selectedMood.id,
      datecreated: new Date(),
    });
    navigation.navigate("BMI", { user_id: user_id });
  }

  function AssessmentAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "OK" }]);
  }
  function skip() {
    navigation.navigate("BMI", { user_id: user_id });
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
      <Text style={styles.title}>How would you describe your mood?</Text>
      <MoodList
        moods={moods}
        onPress={handleSelectMood}
        selectedMood={selectedMood}
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
