import { Text, useTheme } from "@rneui/themed";
import { useEffect, useLayoutEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  useNewAssessmentStore,
  useMedicationStore,
} from "../../../store/AssessmentStore";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AssessmentStackRoutes } from "../../navigation/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MedicationList from "../components/MedicationList";
import { Medication } from "../../../utils/Types";
import Button from "../../shared/components/Button";
import Input from "../../shared/components/Input";

export default function SelectMedicationScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const [selectedMedications, setSelectedMedications] = useState<Medication[]>(
    []
  );
  const [searchText, setSearchText] = useState<string>("");
  const { medications: medicationStore } = useMedicationStore();
  const [medicationList, setMedicationList] =
    useState<Medication[]>(medicationStore);
  const { addMedication, deleteMedication, medications, user } =
    useNewAssessmentStore();
  const route =
    useRoute<RouteProp<AssessmentStackRoutes, "SelectMedication">>();

  const user_id = route.params.user_id;

  const navigation =
    useNavigation<NativeStackNavigationProp<AssessmentStackRoutes>>();

  useLayoutEffect(() => {
    const currentCount = user?.gender === "Female" ? 8 : 7;
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
    if (!user_id) return;
    setSelectedMedications(
      medicationStore.filter((m) =>
        medications.find((med) => med.medication_id === m.id)
      )
    );
  }, [navigation]);

  function handleSelectMedication(item: Medication) {
    const exists = selectedMedications.some((m) => m.id === item.id);
    if (exists) {
      setSelectedMedications(
        selectedMedications.filter((m) => m.id !== item.id)
      );
      deleteMedication(item.id);
    } else {
      setSelectedMedications([...selectedMedications, item]);
      addMedication({
        user_id: user_id,
        medication_id: item.id,
        datecreated: new Date(),
      });
    }
  }

  function submitHandler() {
    if (!user_id) return;
    navigation.navigate("MentalHealthSymptoms", { user_id: user_id });
  }

  useEffect(() => {
    setMedicationList(
      medicationStore.filter((medication) =>
        medication.name.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText]);

  function skip() {
    navigation.navigate("MentalHealthSymptoms", { user_id: user_id });
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
    inputContainer: {
      flexDirection: "row",
      width: Platform.OS !== "web" ? "90%" : "40%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 25,
      borderColor: theme.colors.primary,
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
      <Text style={styles.title}>Please specify your medications!</Text>
      <Input
        containerStyle={styles.inputContainer}
        placeholder={"Search..."}
        icon={"search-outline"}
        secure={false}
        keyboardType={"default"}
        value={searchText}
        onUpdateValue={(value: string) => setSearchText(value)}
        isValid={true}
        popup={false}
      />
      <MedicationList
        medications={medicationList}
        onPress={handleSelectMedication}
        selectedMedications={selectedMedications}
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
