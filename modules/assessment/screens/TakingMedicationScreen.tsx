import { Text, useTheme } from "@rneui/themed";
import { Alert, Platform, StyleSheet, View } from "react-native";
import {
  useNewAssessmentStore,
  useTakingMedicationStore,
} from "../../../store/AssessmentStore";
import { useEffect, useLayoutEffect, useState } from "react";
import { TakingMedication } from "../../../utils/Types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AssessmentStackRoutes } from "../../navigation/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TakingMedicationList from "../components/TakeMedicationList";
import Button from "../../shared/components/Button";

export default function TakingMedicationScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { takingMedications } = useTakingMedicationStore();
  const [selectedTakeMedication, setSelectedTakeMedication] =
    useState<TakingMedication | null>(null);
  const { setTakingMedication, takingMedication, user } =
    useNewAssessmentStore();

  const route =
    useRoute<RouteProp<AssessmentStackRoutes, "TakingMedication">>();
  const user_id = route.params.user_id;

  const navigation =
    useNavigation<NativeStackNavigationProp<AssessmentStackRoutes>>();

  useLayoutEffect(() => {
    const currentCount = user?.gender === "Female" ? 7 : 6;
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

  useEffect(() => {
    if (!takingMedications || !takingMedication) return;
    setSelectedTakeMedication(
      takingMedications.find(
        (tm) => tm.id === takingMedication.takingmedication_id
      ) || null
    );
  }, [takingMedication, takingMedications]);

  function handleSelectTakingMedication(item: TakingMedication) {
    setSelectedTakeMedication(item);
  }

  function submitHandler() {
    if (!user_id) return;
    if (!selectedTakeMedication) {
      AssessmentAlert(
        "No option selected",
        "Please select an option to continue."
      );
      return;
    }

    setTakingMedication({
      user_id: user_id,
      takingmedication_id: selectedTakeMedication.id,
      datecreated: new Date(),
    });
    if (selectedTakeMedication.id === 4 || selectedTakeMedication.id === 3) {
      navigation.navigate("MentalHealthSymptoms", { user_id: user_id });
    } else {
      navigation.navigate("SelectMedication", { user_id: user_id });
    }
  }

  function AssessmentAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "OK" }]);
  }

  function skip() {
    navigation.navigate("SelectMedication", { user_id: user_id });
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
      <Text style={styles.title}>Are you taking any medications?</Text>
      <TakingMedicationList
        takeMedications={takingMedications}
        onPress={handleSelectTakingMedication}
        selectedTakeMedication={selectedTakeMedication}
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
