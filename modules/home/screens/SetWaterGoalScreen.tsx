import DateTimePicker from "@react-native-community/datetimepicker";
import { Text, useTheme } from "@rneui/themed";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useUserStore } from "../../../store/UserStore";
import { useEffect, useState } from "react";
import Input from "../../shared/components/Input";
import { formatDate } from "../../../utils/FormatDate";
import Button from "../../shared/components/Button";
import { useTrackingStore } from "../../../store/TrackingStore";
import { TrackingGoalWater, TrackingGoalWorkout } from "../../../utils/Types";
import { supabase } from "../../../lib/SupaBase";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackRoutes } from "../../navigation/Routes";
import WebDatePicker from "../../shared/components/web/WebDatePicker";

export default function SetWaterGoalScreen() {
  const { user } = useUserStore();
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackRoutes>>();

  const { trackingGoalWater, addTrackingGoalWater, deleteTrackingGoalWater } =
    useTrackingStore();

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [startDateSelected, setStartDateSelected] = useState(new Date());
  const [showEndDatePicker, setEndDatePicker] = useState(false);
  const [endDateSelected, setEndDateSelected] = useState(new Date());

  const [numberOfBottles, setNumberOfBottles] = useState(0);

  function toggleStartDatePicker() {
    setShowStartDatePicker(!showStartDatePicker);
  }

  function updateStartDate(date: Date) {
    setStartDateSelected(date);
    setShowStartDatePicker(false);
  }

  function toggleEndDatePicker() {
    setEndDatePicker(!showEndDatePicker);
  }

  function updateEndDate(date: Date) {
    setEndDateSelected(date);
    setEndDatePicker(false);
  }

  async function waterGoal() {
    if (!user) return;

    const isOverlapping = trackingGoalWater.some((goal) => {
      const existingStartDate = new Date(goal.startdate);
      const existingEndDate = new Date(goal.enddate);

      // Conditions for overlap:
      // 1. New goal's start date is between any existing goal's start and end date.
      // 2. New goal's end date is between any existing goal's start and end date.
      // 3. New goal's start date is before the existing goal's start date and end date is after the existing goal's end date.
      const isOverlap =
        (startDateSelected >= existingStartDate &&
          (!existingEndDate || startDateSelected <= existingEndDate)) ||
        (endDateSelected &&
          endDateSelected >= existingStartDate &&
          (!existingEndDate || endDateSelected <= existingEndDate)) ||
        (startDateSelected <= existingStartDate &&
          endDateSelected &&
          endDateSelected >= existingEndDate);

      return isOverlap;
    });
    if (isOverlapping) {
      TrackingAlert("Error", "Goal overlaps with existing goal.");
      return;
    }

    const { data, error } = await supabase
      .from("trackinggoalwater")
      .insert([
        {
          user_id: user.id,
          startdate: startDateSelected,
          enddate: endDateSelected,
          watercount: numberOfBottles,
        },
      ])
      .select("*")
      .single();
    if (error) {
      TrackingAlert("Error", error.message);
      return;
    }
    addTrackingGoalWater(data);
    navigation.navigate("Home");
  }

  async function deleteWaterGoal(waterGoal: TrackingGoalWater) {
    if (trackingGoalWater.length === 0) return;
    const { error } = await supabase
      .from("trackinggoalwater")
      .delete()
      .eq("id", waterGoal.id);
    if (error) {
      TrackingAlert("Error", error.message);
      return;
    }
    deleteTrackingGoalWater(waterGoal);
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
      justifyContent: "center",
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
      marginVertical: 10,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.colors.primary,
      width: Platform.OS !== "web" ? "90%" : "25%",
    },
    buttonContainer: {
      paddingVertical: 20,
      width: "100%",
    },
    scrollView: {
      width: "100%",
    },
    scrollViewContent: {
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    goalContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: Platform.OS !== "web" ? "90%" : "25%",
      backgroundColor: theme.colors.primary,
      marginVertical: 5,
      paddingVertical: 5,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    goalTextContainer: {
      flexDirection: "column",
    },
    iconContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "red",
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How many bottles do you want to drink?</Text>
      {Platform.OS !== "web" ? (
        <Pressable
          onPress={toggleStartDatePicker}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Input
            containerStyle={styles.inputContainer}
            disabled={true}
            value={formatDate(startDateSelected).toString()}
            isValid={true}
            placeholder={"Select Start Date"}
            icon={"calendar-outline"}
          />
        </Pressable>
      ) : (
        <>
          <Text>Select Start Date</Text>
          <WebDatePicker
            date={startDateSelected}
            onChange={(value: any) => updateStartDate(value)}
          />
        </>
      )}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDateSelected}
          onChange={(event, selectedDate) => {
            updateStartDate(new Date(selectedDate!));
          }}
          mode="date"
          display="calendar"
        />
      )}
      {Platform.OS !== "web" ? (
        <Pressable
          onPress={toggleEndDatePicker}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Input
            containerStyle={styles.inputContainer}
            disabled={true}
            value={formatDate(endDateSelected).toString()}
            isValid={true}
            placeholder={"Select End Date"}
            icon={"calendar-outline"}
          />
        </Pressable>
      ) : (
        <>
          <Text>Select End Date</Text>
          <WebDatePicker
            date={endDateSelected}
            onChange={(value: any) => updateEndDate(value)}
          />
        </>
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={endDateSelected}
          onChange={(event, selectedDate) => {
            updateEndDate(new Date(selectedDate!));
          }}
          mode="date"
          display="calendar"
        />
      )}
      <Input
        containerStyle={styles.inputContainer}
        value={numberOfBottles}
        onUpdateValue={(value: number) => setNumberOfBottles(value)}
        isValid={true}
        keyboardType={"numeric"}
        placeholder={"Number of bottles"}
        icon={"water-outline"}
        popup={false}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {trackingGoalWater.length > 0 &&
          trackingGoalWater.map((goal) => (
            <View key={goal.id} style={styles.goalContainer}>
              <View>
                <Text>Start Date: {formatDate(new Date(goal?.startdate))}</Text>
                <Text>End Date: {formatDate(new Date(goal?.enddate))}</Text>
                <Text>Number of bottles: {goal?.watercount}</Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  pressed && styles.pressed,
                  styles.iconContainer,
                ]}
                onPress={() => deleteWaterGoal(goal)}
              >
                <Ionicons name="trash-outline" size={24} color={"red"} />
              </Pressable>
            </View>
          ))}
      </ScrollView>

      <Button onPress={waterGoal}>Add Goal</Button>
    </View>
  );
}
