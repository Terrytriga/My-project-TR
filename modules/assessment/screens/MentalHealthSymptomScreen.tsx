import { Text, useTheme } from "@rneui/themed";
import { Platform, StyleSheet, View } from "react-native";
import { MentalHealthSymptom } from "../../../utils/Types";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  useNewAssessmentStore,
  useMentalHealthSymptomStore,
} from "../../../store/AssessmentStore";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AssessmentStackRoutes } from "../../navigation/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import HealthSymptomList from "../components/HealthSymptomList";
import Button from "../../shared/components/Button";

export default function MentalHealthSymptomScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const [selectedHealthSymptoms, setSelectedHealthSymptoms] = useState<
    MentalHealthSymptom[]
  >([]);
  const { mentalHealthSymptoms: mentalHealthSymptomStore } =
    useMentalHealthSymptomStore();
  const {
    addMentalHealthSymptom,
    deleteMentalHealthSymptom,
    mentalHealthSymptoms,
    user,
  } = useNewAssessmentStore();
  const route = useRoute<RouteProp<AssessmentStackRoutes, "StressLevel">>();

  const user_id = route.params.user_id;

  const navigation =
    useNavigation<NativeStackNavigationProp<AssessmentStackRoutes>>();

  useLayoutEffect(() => {
    const currentCount = user?.gender === "Female" ? 9 : 8;
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
    setSelectedHealthSymptoms(
      mentalHealthSymptomStore.filter((mentalStore) =>
        mentalHealthSymptoms.find(
          (healthSymptom) =>
            healthSymptom.mentalhealthsymptom_id === mentalStore.id
        )
      )
    );
  }, [navigation]);

  function handleSelectMedication(item: MentalHealthSymptom) {
    const exists = selectedHealthSymptoms.some((m) => m.id === item.id);
    if (exists) {
      setSelectedHealthSymptoms(
        selectedHealthSymptoms.filter((hs) => hs.id !== item.id)
      );
      deleteMentalHealthSymptom(item.id);
    } else {
      setSelectedHealthSymptoms([...selectedHealthSymptoms, item]);
      addMentalHealthSymptom({
        user_id: user_id,
        mentalhealthsymptom_id: item.id,
        datecreated: new Date(),
      });
    }
  }

  function submitHandler() {
    if (!user_id) return;
    navigation.navigate("StressLevel", { user_id: user_id });
  }

  function skip() {
    navigation.navigate("StressLevel", { user_id: user_id });
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
      <Text style={styles.title}>
        Do You have other mental health symptoms?
      </Text>
      <HealthSymptomList
        mentalHealthSymptoms={mentalHealthSymptomStore}
        selectedHealthSymptoms={selectedHealthSymptoms}
        onPress={handleSelectMedication}
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
