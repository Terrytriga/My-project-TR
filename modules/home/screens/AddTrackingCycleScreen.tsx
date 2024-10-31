import DateTimePicker from "@react-native-community/datetimepicker";
import { CheckBox, Text, useTheme } from "@rneui/themed";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import { useTrackingStore } from "../../../store/TrackingStore";
import Input from "../../shared/components/Input";
import { formatDate } from "../../../utils/FormatDate";
import Button from "../../shared/components/Button";
import { useUserStore } from "../../../store/UserStore";
import { supabase } from "../../../lib/SupaBase";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackRoutes } from "../../navigation/Routes";
import WebDatePicker from "../../shared/components/web/WebDatePicker";

export default function AddTrackingCycleScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackRoutes>>();
  const { theme } = useTheme();
  const { user } = useUserStore();

  const {
    addTrackingMenstruation,
    updateTrackingMenstruation,
    trackingMenstruation,
  } = useTrackingStore();

  // const { cycleStatuses } = useCycleStatusStore();
  // const [selectedStatus, setSelectedStatus] = useState<CycleStatus>(
  //   cycleStatuses[0]
  // );

  const [periodStopped, setPeriodStopped] = useState(false);

  const [periodStart, setPeriodStart] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [periodEnd, setPeriodEnd] = useState<Date>(new Date());
  const [showEndPicker, setShowEndPicker] = useState(false);

  function toggleStartPicker() {
    setShowStartPicker(!showStartPicker);
  }
  function toggleEndPicker() {
    setShowEndPicker(!showEndPicker);
  }

  function updateStartDate(date: Date) {
    setPeriodStart(date);
    setShowStartPicker(!showStartPicker);
  }

  function updateEndDate(date: Date) {
    setPeriodEnd(date);
    setShowEndPicker(!showEndPicker);
  }

  async function addTracking() {
    if (!user || !user.id) return;
    if (periodStopped && periodEnd < periodStart) {
      TrackingAlert(
        "Error",
        "Period end date cannot be earlier than period start date"
      );
      return;
    }
    const periodLength =
      periodStopped && periodEnd
        ? Math.ceil(
            (periodEnd.getTime() - periodStart.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;

    const trackingItem = {
      user_id: user.id,
      periodstart: periodStart,
      periodend: periodStopped && periodEnd ? periodEnd : null,
      periodlength: periodLength,
    };

    const { data, error } = await supabase
      .from("trackingmenstruation")
      .insert([trackingItem])
      .select("*")
      .single();
    if (error) {
      TrackingAlert("Error", error.message);
      return;
    }

    const previousTrackingMenstruation = trackingMenstruation[0];
    if (previousTrackingMenstruation) {
      const cycleLength = Math.ceil(
        (new Date(trackingItem.periodstart).getTime() -
          new Date(previousTrackingMenstruation.periodstart).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      previousTrackingMenstruation.cyclelength = cycleLength;
      const { data: updateTrackingData, error: updateTrackingError } =
        await supabase
          .from("trackingmenstruation")
          .update(previousTrackingMenstruation)
          .eq("id", previousTrackingMenstruation.id)
          .select("*")
          .single();
      if (updateTrackingError) {
        TrackingAlert("Error", updateTrackingError.message);
        return;
      }
      updateTrackingMenstruation(updateTrackingData);
    }
    addTrackingMenstruation(data);

    navigation.navigate("TrackingCycle");
  }

  function TrackingAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "OK",
      },
    ]);
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
      marginBottom: 30,
    },
    subTitle: {
      fontSize: 18,
    },
    predictionContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      // backgroundColor: "red",
    },
    pickerContainer: {
      width: "75%",
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 20,
    },
    predictionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "75%",
      marginVertical: 3,
    },
    section: {
      marginVertical: 10,
      width: "100%",
      alignItems: "center",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.colors.primary,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    buttonContainer: {
      paddingVertical: 20,
      width: "100%",
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track your cycle!</Text>
      <View style={styles.section}>
        <Text style={styles.subTitle}>When did your period start?</Text>
        {Platform.OS !== "web" ? (
          <Pressable
            onPress={toggleStartPicker}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <Input
              containerStyle={styles.inputContainer}
              disabled={true}
              value={formatDate(periodStart).toString()}
              isValid={true}
              placeholder={"Period Start"}
              icon={"calendar-outline"}
            />
          </Pressable>
        ) : (
          <WebDatePicker date={periodStart} onChange={updateStartDate} />
        )}
        {showStartPicker && (
          <DateTimePicker
            value={periodStart}
            onChange={(event, selecteDate) => {
              const date = selecteDate;
              updateStartDate(new Date(date!));
            }}
            mode="date"
            display="calendar"
          />
        )}
      </View>
      <View style={styles.row}>
        <CheckBox
          checked={periodStopped}
          onPress={() => setPeriodStopped(!periodStopped)}
        />
        <Text>Has your period stopped?</Text>
      </View>
      {periodStopped && (
        <View style={styles.section}>
          <Text style={styles.subTitle}>When did your period end?</Text>
          {Platform.OS !== "web" ? (
            <Pressable
              onPress={toggleEndPicker}
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <Input
                containerStyle={styles.inputContainer}
                disabled={true}
                value={formatDate(periodEnd).toString()}
                isValid={true}
                placeholder={"Period End"}
                icon={"calendar-outline"}
              />
            </Pressable>
          ) : (
            <WebDatePicker date={periodEnd} onChange={updateEndDate} />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={periodEnd}
              onChange={(event, selecteDate) => {
                const date = selecteDate;
                updateEndDate(new Date(date!));
              }}
              mode="date"
              display="calendar"
            />
          )}
        </View>
      )}
      <View style={{ flex: 1 }}></View>
      <View style={styles.buttonContainer}>
        <Button onPress={async () => addTracking()}>Add Tracking</Button>
      </View>
    </View>
  );
}
