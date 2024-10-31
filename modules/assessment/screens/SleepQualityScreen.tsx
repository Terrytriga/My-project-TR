import { Text, useTheme } from "@rneui/themed";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { SleepQuality } from "../../../utils/Types";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  useNewAssessmentStore,
  useSleepQualityStore,
} from "../../../store/AssessmentStore";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AssessmentStackRoutes } from "../../navigation/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SleepQualityList from "../components/SleepQualityList";
import Button from "../../shared/components/Button";

export default function SleepQualityScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const [selectedSleep, setSelectedSleep] = useState<SleepQuality | null>(null);
  const { setSleepQuality, sleepQuality, user } = useNewAssessmentStore();
  const { sleepQualities } = useSleepQualityStore();

  const route = useRoute<RouteProp<AssessmentStackRoutes, "SleepQuality">>();
  const user_id = route.params.user_id;

  const navigation =
    useNavigation<NativeStackNavigationProp<AssessmentStackRoutes>>();

  useLayoutEffect(() => {
    const currentCount = user?.gender === "Female" ? 6 : 5;
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
    if (!user_id || !sleepQuality || !sleepQualities) return;
    setSelectedSleep(
      sleepQualities.find(
        (sleep) => sleep.id === sleepQuality.sleepquality_id
      ) || null
    );
  }, [sleepQuality, navigation]);

  function handleSelectedSleep(item: SleepQuality) {
    setSelectedSleep(item);
  }

  function submitHandler() {
    if (!user_id || !selectedSleep) {
      AssessmentAlert(
        "No Sleep Quality Selected",
        "Please select a sleep quality to continue."
      );
      return;
    }

    setSleepQuality({
      user_id: user_id,
      sleepquality_id: selectedSleep?.id,
      datecreated: new Date(),
    });
    navigation.navigate("TakingMedication", { user_id: user_id });
  }
  function AssessmentAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "OK" }]);
  }

  function skip() {
    navigation.navigate("TakingMedication", { user_id: user_id });
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
      <Text style={styles.title}>How would you rate your sleep quality?</Text>
      <SleepQualityList
        sleepQualities={sleepQualities}
        selectedSleep={selectedSleep}
        onPress={handleSelectedSleep}
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
