import { Text, useTheme } from "@rneui/themed";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { useLayoutEffect, useState } from "react";
import { useNewAssessmentStore } from "../../../store/AssessmentStore";
import { supabase } from "../../../lib/SupaBase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AssessmentStackRoutes } from "../../navigation/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUserStore } from "../../../store/UserStore";

const stressDescriptions = [
  "You are not stressed at all.",
  "You are slightly stressed.",
  "You are moderately stressed.",
  "You are very stressed.",
  "You are extremely stressed out.",
];

export default function StressLevelScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute<RouteProp<AssessmentStackRoutes, "StressLevel">>();
  const user_id = route.params.user_id;

  const navigation =
    useNavigation<NativeStackNavigationProp<AssessmentStackRoutes>>();

  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const {
    setStressLevel,
    goal,
    mood,
    bmi,
    menstruation,
    professionalHelp,
    physicalDistress,
    sleepQuality,
    takingMedication,
    medications,
    mentalHealthSymptoms,
    stressLevel,
    clearAssessment,
    user,
  } = useNewAssessmentStore();

  const { setUser } = useUserStore();

  useLayoutEffect(() => {
    const currentCount = user?.gender === "Female" ? 10 : 9;
    const totalCount = user?.gender === "Female" ? 10 : 9;
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={styles.headerContainer}>
            <Text>
              {currentCount} OF {totalCount}
            </Text>
          </View>
        );
      },
    });
  }, [navigation]);

  function handleSelectLevel(level: number) {
    setStressLevel({
      user_id: user_id,
      level: level,
      datecreated: new Date(),
    });
    setSelectedLevel(level);
  }

  async function handleFinish() {
    if (!selectedLevel) {
      AssessmentAlert(
        "No stress level selected",
        "Please select a stress level to finish."
      );
      return;
    }
    setIsLoading(true);

    if (goal) {
      const { error: goalError } = await supabase
        .from("assessmentgoal")
        .insert([goal]);
      if (goalError) {
        AssessmentAlert("Error inserting goal", goalError.message);
        setIsLoading(false);
        return;
      }
    }

    if (mood) {
      const { error: moodError } = await supabase
        .from("assessmentmood")
        .insert([mood]);
      if (moodError) {
        AssessmentAlert("Error inserting mood", moodError.message);
        setIsLoading(false);
        return;
      }
    }

    if (bmi) {
      const { error: bmiError } = await supabase
        .from("assessmentbmi")
        .insert([bmi]);
      if (bmiError) {
        AssessmentAlert("Error inserting BMI", bmiError.message);
        setIsLoading(false);
        return;
      }
    }

    if (user?.gender === "Female" && menstruation) {
      const { error: menstruationError } = await supabase
        .from("assessmentmenstruation")
        .insert([menstruation]);
      if (menstruationError) {
        AssessmentAlert(
          "Error inserting menstruation",
          menstruationError.message
        );
        setIsLoading(false);
        return;
      }
    }

    if (professionalHelp) {
      const { error: professionalHelpError } = await supabase
        .from("assessmentprohelp")
        .insert([professionalHelp]);
      if (professionalHelpError) {
        AssessmentAlert(
          "Error inserting professional help",
          professionalHelpError.message
        );
        setIsLoading(false);
        return;
      }
    }

    if (physicalDistress) {
      const { error: physicalDistressError } = await supabase
        .from("assessmentphysicaldistress")
        .insert([physicalDistress]);
      if (physicalDistressError) {
        AssessmentAlert(
          "Error inserting physical distress",
          physicalDistressError.message
        );
        setIsLoading(false);
        return;
      }
    }

    if (sleepQuality) {
      const { error: sleepQualityError } = await supabase
        .from("assessmentsleepquality")
        .insert([sleepQuality]);
      if (sleepQualityError) {
        AssessmentAlert(
          "Error inserting sleep quality",
          sleepQualityError.message
        );
        setIsLoading(false);
        return;
      }
    }

    if (takingMedication) {
      const { error: takingMedicationError } = await supabase
        .from("assessmenttakingmedication")
        .insert([takingMedication]);
      if (takingMedicationError) {
        AssessmentAlert(
          "Error inserting taking medication",
          takingMedicationError.message
        );
        setIsLoading(false);
        return;
      }
    }

    if (medications.length !== 0) {
      const { error: medicationsError } = await supabase
        .from("assessmentmedication")
        .insert(medications);
      if (medicationsError) {
        AssessmentAlert(
          "Error inserting medications",
          medicationsError.message
        );
        setIsLoading(false);
        return;
      }
    }

    if (mentalHealthSymptoms.length !== 0) {
      const { error: mentalHealthSymptomsError } = await supabase
        .from("assessmentmentalhealthsymptoms")
        .insert(mentalHealthSymptoms);
      if (mentalHealthSymptomsError) {
        AssessmentAlert(
          "Error inserting mental health symptoms",
          mentalHealthSymptomsError.message
        );
        setIsLoading(false);
        return;
      }
    }

    if (stressLevel) {
      const { error: stressLevelError } = await supabase
        .from("assessmentstresslevel")
        .insert([stressLevel]);
      if (stressLevelError) {
        AssessmentAlert(
          "Error inserting stress level",
          stressLevelError.message
        );
        setIsLoading(false);
        return;
      }
    }

    clearAssessment();
    setUser(user);
    setIsLoading(false);
  }

  function AssessmentAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "OK" }]);
  }

  function skip() {
    setUser(user);
    clearAssessment();
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingBottom: 10,
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
    levelContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginVertical: 20,
    },
    levelButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    selectedLevelButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.secondary,
    },
    levelText: {
      fontSize: 18,
      color: theme.colors.black,
    },
    largeNumber: {
      fontSize: 200,
      fontWeight: "bold",
      color: theme.colors.black,
    },
    descriptionText: {
      fontSize: 16,
      textAlign: "center",
      color: theme.colors.black,
      marginTop: 20,
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
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={styles.title}>How would you rate your stress level?</Text>
        {selectedLevel !== null && (
          <Text style={styles.largeNumber}>{selectedLevel}</Text>
        )}
        <View style={styles.levelContainer}>
          {Array.from({ length: 5 }, (_, index) => (
            <Pressable
              key={index}
              style={[
                styles.levelButton,
                selectedLevel === index + 1 ? styles.selectedLevelButton : {},
              ]}
              onPress={() => handleSelectLevel(index + 1)}
            >
              <Text style={styles.levelText}>{index + 1}</Text>
            </Pressable>
          ))}
        </View>

        {selectedLevel !== null && (
          <Text style={styles.descriptionText}>
            {stressDescriptions[selectedLevel - 1]}
          </Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button disable={isLoading} style={styles.skipButton} onPress={skip}>
          Skip
        </Button>
        <Button disable={isLoading} onPress={handleFinish}>
          {isLoading ? <ActivityIndicator size={"small"} /> : "Finish"}
        </Button>
      </View>
    </View>
  );
}
