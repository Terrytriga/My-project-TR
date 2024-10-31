import { Text, useTheme } from "@rneui/themed";
import { Platform, StyleSheet, View } from "react-native";
import { useAssessmentStore } from "../../../store/AssessmentStore";
import { useEffect, useState } from "react";
import {
  AssessmentMenstruation,
  TrackingMenstruation,
} from "../../../utils/Types";
import { useTrackingStore } from "../../../store/TrackingStore";
import { formatDate } from "../../../utils/FormatDate";
import Button from "../../shared/components/Button";
import CycleList from "../components/CycleList";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackRoutes } from "../../navigation/Routes";

export default function TrackingCycleScreen() {
  const { theme } = useTheme();
  const { menstruation } = useAssessmentStore();
  const { trackingMenstruation } = useTrackingStore();
  const [sortedTrackingList, setSortedTrackingList] = useState<
    TrackingMenstruation[]
  >([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackRoutes>>();

  const [selectedCycle, setSelectedCycle] =
    useState<TrackingMenstruation | null>(null);

  const [latestTracking, setLatestTracking] = useState<TrackingMenstruation>();
  const [latestCompleteTracking, setLatestCompleteTracking] =
    useState<TrackingMenstruation>();
  const [latestAssessment, setLatestAssessment] =
    useState<AssessmentMenstruation>();

  const [predictPeriodStart, setPredictPeriodStart] = useState<Date>();
  const [predictPeriodEnd, setPredictPeriodEnd] = useState<Date>();
  const [predictFertilityStart, setPredictFertilityStart] = useState<Date>();
  const [predictFertilityEnd, setPredictFertilityEnd] = useState<Date>();
  const [predictCycleEnd, setPredictCycleEnd] = useState<Date>();

  useEffect(() => {
    if (trackingMenstruation.length === 0) return;
    const sortedTracking = trackingMenstruation.sort((a, b) => {
      const dateA = new Date(a.periodstart);
      const dateB = new Date(b.periodstart);
      return dateB.getTime() - dateA.getTime();
    });
    setSortedTrackingList(sortedTracking);
  }, [trackingMenstruation]);

  useEffect(() => {
    if (menstruation.length === 0) return;
    const sortedMenstruation = menstruation.sort((a, b) => {
      const dateA = new Date(a.datecreated);
      const dateB = new Date(b.datecreated);
      return dateB.getTime() - dateA.getTime();
    });
    const latestAssessment = sortedMenstruation[0];
    setLatestAssessment(latestAssessment);
  }, [menstruation]);

  useEffect(() => {
    if (trackingMenstruation.length === 0) return;
    setLatestTracking(
      trackingMenstruation.find(
        (item) => !!item.periodstart && item.cyclelength === null
      )
    );

    const sortedTracking = trackingMenstruation
      .filter((item) => item.periodstart && item.periodend && item.cyclelength)
      .sort((a, b) => {
        const dateA = new Date(a.periodstart);
        const dateB = new Date(b.periodstart);
        return dateB.getTime() - dateA.getTime();
      });
    const latestTracking = sortedTracking[0];
    setLatestCompleteTracking(latestTracking);
  }, [trackingMenstruation]);

  useEffect(() => {
    if (
      !latestCompleteTracking ||
      !latestCompleteTracking.periodstart ||
      (!latestCompleteTracking.periodend && !latestTracking)
    ) {
      if (latestAssessment && latestTracking === undefined) {
        const {
          lastperiodstart,
          lastperiodend,
          cyclelength: assessmentLength,
        } = latestAssessment;
        predictCycle(
          new Date(lastperiodstart),
          new Date(lastperiodend),
          assessmentLength
        );
      } else if (
        latestAssessment &&
        trackingMenstruation.length === 1 &&
        latestTracking &&
        !latestTracking.periodend &&
        !latestTracking.cyclelength
      ) {
        const {
          cyclelength: assessmentLength,
          lastperiodstart,
          lastperiodend,
        } = latestAssessment;
        const { periodstart } = latestTracking;
        const periodlength = Math.ceil(
          (new Date(lastperiodend).getTime() -
            new Date(lastperiodstart).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        const newPeriodEnd = new Date(lastperiodstart);
        newPeriodEnd.setDate(newPeriodEnd.getDate() + periodlength);
        predictCycle(
          new Date(periodstart),
          new Date(newPeriodEnd),
          assessmentLength
        );
      } else if (
        latestAssessment &&
        !latestCompleteTracking &&
        trackingMenstruation.length === 1 &&
        latestTracking &&
        latestTracking.periodend &&
        !latestTracking.cyclelength
      ) {
        const { cyclelength } = latestAssessment;
        const { periodstart, periodend } = latestTracking;
        const periodlength = Math.ceil(
          (new Date(periodend).getTime() - new Date(periodstart).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        const newPeriodEnd = new Date(periodstart);
        newPeriodEnd.setDate(newPeriodEnd.getDate() + periodlength);
        predictCycle(
          new Date(periodstart),
          new Date(newPeriodEnd),
          cyclelength
        );
      }
    }
    if (
      latestCompleteTracking &&
      latestCompleteTracking.periodend &&
      latestCompleteTracking.cyclelength &&
      !latestTracking
    ) {
      const { cyclelength, periodend, periodstart } = latestCompleteTracking;
      predictCycle(new Date(periodstart), new Date(periodend), cyclelength);
    }
    if (
      latestCompleteTracking &&
      latestCompleteTracking.periodlength &&
      latestCompleteTracking.cyclelength &&
      latestTracking
    ) {
      const { cyclelength, periodlength } = latestCompleteTracking;
      const { periodstart } = latestTracking;
      if (!latestTracking.periodend) {
        const newPeriodEnd = new Date(periodstart);
        newPeriodEnd.setDate(newPeriodEnd.getDate() + periodlength);
        predictCycle(
          new Date(periodstart),
          new Date(newPeriodEnd),
          cyclelength
        );
      } else {
        predictCycle(
          new Date(periodstart),
          new Date(latestTracking.periodend),
          cyclelength
        );
      }
    }
  }, [latestAssessment, trackingMenstruation]);

  function predictCycle(
    lastperiodstart: Date,
    lastperiodend: Date,
    cyclelength: number
  ) {
    // Convert last period start and end to Date objects
    const periodStartDate = new Date(lastperiodstart);
    const periodEndDate = new Date(lastperiodend);

    // Calculate the actual length of the last period
    const periodLength = Math.ceil(
      (periodEndDate.getTime() - periodStartDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Predict the next period start date by adding cycle length to the last period start
    const nextPeriodStartDate = new Date(periodStartDate);
    nextPeriodStartDate.setDate(periodStartDate.getDate() + cyclelength);

    // Predict next period end date based on the calculated period length
    const nextPeriodEndDate = new Date(nextPeriodStartDate);
    nextPeriodEndDate.setDate(nextPeriodStartDate.getDate() + periodLength);

    // Predict fertility window for the next cycle
    const nextOvulationDate = new Date(nextPeriodStartDate);
    nextOvulationDate.setDate(nextPeriodStartDate.getDate() + cyclelength - 14); // Ovulation 14 days before next period start

    const nextFertilityStartDate = new Date(nextOvulationDate);
    nextFertilityStartDate.setDate(nextOvulationDate.getDate() - 5); // Fertility starts 5 days before ovulation

    const nextFertilityEndDate = new Date(nextOvulationDate);
    nextFertilityEndDate.setDate(nextOvulationDate.getDate() + 1); // Fertility ends 1 day after ovulation

    // Predict the end of the next cycle
    const nextCycleEndDate = new Date(nextPeriodStartDate);
    nextCycleEndDate.setDate(nextPeriodStartDate.getDate() + cyclelength - 1);

    // Update state with predicted dates
    setPredictPeriodStart(nextPeriodStartDate);
    setPredictPeriodEnd(nextPeriodEndDate);
    setPredictFertilityStart(nextFertilityStartDate);
    setPredictFertilityEnd(nextFertilityEndDate);
    setPredictCycleEnd(nextCycleEndDate);
  }

  function handleSelectCycle(cycle: TrackingMenstruation) {
    if (selectedCycle === cycle) {
      setSelectedCycle(null);
    } else {
      setSelectedCycle(cycle);
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 20,
    },
    title: {
      fontSize: 24,
      fontFamily: "Bebas",
      marginBottom: 15,
      marginTop: 10,
    },
    subTitle: {
      fontSize: 18,
    },
    predictionContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: Platform.OS !== "web" ? "100%" : "50%",
    },
    predictionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "75%",
      marginVertical: 3,
    },
    buttonContainer: {
      paddingVertical: 20,
      width: "100%",
      alignItems: "center",
    },
    listContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: trackingMenstruation.length === 0 ? "center" : undefined,
    },
  });
  return (
    <View style={styles.container}>
      {predictPeriodStart &&
      predictPeriodEnd &&
      predictFertilityStart &&
      predictFertilityEnd &&
      predictCycleEnd ? (
        <View style={styles.predictionContainer}>
          <Text style={styles.title}>Next Cycle Predictions</Text>
          <View style={styles.predictionRow}>
            <Text>Period: </Text>
            <Text>
              {formatDate(predictPeriodStart)} - {formatDate(predictPeriodEnd)}
            </Text>
          </View>
          <View style={styles.predictionRow}>
            <Text>Fertility: </Text>
            <Text>
              {formatDate(predictFertilityStart)} -{" "}
              {formatDate(predictFertilityEnd)}
            </Text>
          </View>
          <View style={styles.predictionRow}>
            <Text>Cycle End: </Text>
            <Text>{formatDate(predictCycleEnd)}</Text>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Next Cycle Predictions</Text>
          <Text>Not enough data to make predictions.</Text>
        </View>
      )}
      <View style={styles.listContainer}>
        {trackingMenstruation.length > 0 ? (
          <CycleList
            cycles={sortedTrackingList}
            onPress={handleSelectCycle}
            selectedCycle={selectedCycle}
          />
        ) : (
          <Text>No tracking yet</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {!selectedCycle ? (
          (latestTracking && latestTracking.periodend !== null) ||
          trackingMenstruation.length === 0 ||
          (latestCompleteTracking && !latestTracking) ? (
            <Button onPress={() => navigation.navigate("AddTrackingCycle")}>
              Add Tracking
            </Button>
          ) : (
            <Text>
              We need your period end date of your last added tracking on{" "}
              {latestTracking?.periodstart &&
                formatDate(new Date(latestTracking.periodstart))}
              .
            </Text>
          )
        ) : (
          <Button
            onPress={() => {
              setSelectedCycle(null);
              navigation.navigate("EditTrackingCycle", {
                id: selectedCycle.id,
              });
            }}
          >
            Update Tracking
          </Button>
        )}
      </View>
    </View>
  );
}
