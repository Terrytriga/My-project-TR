import DateTimePicker from "@react-native-community/datetimepicker";
import { CheckBox, Text, useTheme } from "@rneui/themed";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { useLayoutEffect, useState } from "react";
import { useTrackingStore } from "../../../store/TrackingStore";
import Input from "../../shared/components/Input";
import { formatDate } from "../../../utils/FormatDate";
import Button from "../../shared/components/Button";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackRoutes } from "../../navigation/Routes";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../lib/SupaBase";
import WebDatePicker from "../../shared/components/web/WebDatePicker";

export default function EditTrackingCycleScreen() {
  const { theme } = useTheme();
  const isWeb = Platform.OS === "web";
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackRoutes>>();
  const route = useRoute<RouteProp<HomeStackRoutes, "EditTrackingCycle">>();
  const id = route.params.id;

  const {
    updateTrackingMenstruation,
    trackingMenstruation,
    deleteTrackingMenstruation,
  } = useTrackingStore();

  const currentCycle = trackingMenstruation.find((cycle) => cycle.id === id);

  const [periodStopped, setPeriodStopped] = useState(
    currentCycle?.periodend ? true : false
  );
  const [periodStart, setPeriodStart] = useState<Date>(
    currentCycle?.periodstart ? new Date(currentCycle.periodstart) : new Date()
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [periodEnd, setPeriodEnd] = useState<Date>(
    currentCycle?.periodend
      ? new Date(currentCycle.periodend)
      : new Date(
          currentCycle?.periodstart ? currentCycle.periodstart : new Date()
        )
  );
  const [showEndPicker, setShowEndPicker] = useState(false);

  useLayoutEffect(() => {
    if (!currentCycle) return;
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={styles.iconRow}>
            <Pressable
              style={({ pressed }) => [
                styles.iconPressable,
                pressed && styles.pressed,
              ]}
              onPress={async () => confirmDeleteTracking()}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
        );
      },
    });
  }, [navigation, route, currentCycle]);

  async function confirmDeleteTracking() {
    if (isWeb) await deleteTracking();
    Alert.alert(
      "Delete Tracking",
      "Are you sure you want to delete this cycle?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => await deleteTracking(),
        },
      ]
    );
  }

  async function deleteTracking() {
    const { data, error } = await supabase
      .from("trackingmenstruation")
      .delete()
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      TrackingAlert("Error", error.message);
      return;
    }
    deleteTrackingMenstruation(data);
    navigation.navigate("TrackingCycle");
  }

  async function updateTracking() {
    const periodLength =
      periodStopped && periodEnd
        ? Math.ceil(
            (periodEnd.getTime() - periodStart.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;
    const { data, error } = await supabase
      .from("trackingmenstruation")
      .update({
        periodstart: periodStart,
        periodend: periodStopped ? periodEnd : null,
        periodlength: periodLength,
        dateupdated: new Date(),
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      TrackingAlert("Error", error.message);
      return;
    }
    updateTrackingMenstruation(data);

    const sortedTrackingList = trackingMenstruation.sort((a, b) => {
      const dateA = new Date(a.periodstart);
      const dateB = new Date(b.periodstart);
      return dateB.getTime() - dateA.getTime();
    });
    const currentIndex = sortedTrackingList.findIndex(
      (cycle) => cycle.id === id
    );

    const previousItemIndex = currentIndex + 1;
    const previousItem = sortedTrackingList[previousItemIndex];
    if (previousItem) {
      const previousPeriodStart = new Date(previousItem.periodstart);
      const previousCycleLength = Math.ceil(
        (periodStart.getTime() - previousPeriodStart.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const { data: previousItemData, error: previousItemError } =
        await supabase
          .from("trackingmenstruation")
          .update({ cyclelength: previousCycleLength, dateupdated: new Date() })
          .eq("id", previousItem.id)
          .select("*")
          .single();
      if (previousItemError) {
        TrackingAlert("Error", previousItemError.message);
        return;
      }
      updateTrackingMenstruation(previousItemData);
    }

    // Adjust the cyclelength of the next item
    const nextItemIndex = currentIndex - 1;
    const nextItem = sortedTrackingList[nextItemIndex];
    if (nextItem) {
      if (nextItem.periodend && nextItem.cyclelength) {
        const nextPeriodEnd = new Date(nextItem.periodend);
        const nextCycleLength = Math.ceil(
          (periodStart.getTime() - nextPeriodEnd.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        const { data: nextItemData, error: nextItemError } = await supabase
          .from("trackingmenstruation")
          .update({ cyclelength: nextCycleLength })
          .eq("id", nextItem.id)
          .select("*")
          .single();
        if (nextItemError) {
          TrackingAlert("Error", nextItemError.message);
          return;
        }
        updateTrackingMenstruation(nextItemData);
      }
    }
    navigation.navigate("TrackingCycle");
  }

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
      width: "100%",
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
    iconRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      width: 100,
    },
    iconPressable: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      width: 36,
      height: 36,
      marginHorizontal: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    pressed: {
      opacity: 0.5,
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update your Cycle</Text>
      {/* <Text style={styles.title}>Cycle Status</Text>
      <View style={styles.pickerContainer}>
        <Picker
          style={{
            width: "100%",
            height: 50,
            color: theme.colors.black,
          }}
          itemStyle={{ color: theme.colors.black }}
          dropdownIconColor={theme.colors.primary}
          selectedValue={selectedStatus}
          onValueChange={(itemValue) => setSelectedStatus(itemValue)}
          prompt="About your cycle"
        >
          {cycleStatuses &&
            cycleStatuses.map((status) => (
              <Picker.Item
                key={status.id}
                label={status.status}
                value={status}
              />
            ))}
        </Picker>
      </View>
      <Text>{selectedStatus.description}</Text> */}
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
        <Button onPress={async () => updateTracking()}>Save</Button>
      </View>
    </View>
  );
}
