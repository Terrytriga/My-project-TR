import { Text, useTheme } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useUserStore } from "../../../store/UserStore";
import Input from "../../shared/components/Input";
import { formatDate } from "../../../utils/FormatDate";
import Button from "../../shared/components/Button";
import { useTrackingStore } from "../../../store/TrackingStore";
import { TrackingSteps } from "../../../utils/Types";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../lib/SupaBase";
import WebDatePicker from "../../shared/components/web/WebDatePicker";

export default function TrackingStepScreen() {
  const { user } = useUserStore();
  const { theme } = useTheme();
  const { trackingSteps, addTrackingSteps, deleteTrackingSteps } =
    useTrackingStore();

  const [stepsToday, setStepsToday] = useState<TrackingSteps[]>([]);
  const [totalStepsToday, setTotalStepsToday] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(new Date());
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    setStepsToday(
      trackingSteps.filter((tracking) => {
        if (!tracking.datecreated) return false;
        const dateCreatedString = new Date(tracking.datecreated)
          .toISOString()
          .slice(0, 10);
        const dateSelectedString = dateSelected.toISOString().slice(0, 10);
        return dateCreatedString === dateSelectedString;
      })
    );
  }, [trackingSteps, dateSelected]);

  useEffect(() => {
    setTotalStepsToday(stepsToday.reduce((acc, item) => acc + item.steps, 0));
  }, [stepsToday]);

  function toggleDatePicker() {
    setShowDatePicker(!showDatePicker);
  }

  function updateDate(date: Date) {
    setDateSelected(date);
    setShowDatePicker(false);
  }

  async function trackSteps() {
    if (!user) return;
    if (steps === 0) {
      TrackingAlert("Error", "Please enter steps you have done today.");
      return;
    }
    const { data, error } = await supabase
      .from("trackingsteps")
      .insert([
        {
          user_id: user.id,
          steps: steps,
          datecreated: new Date(dateSelected),
        },
      ])
      .select("*")
      .single();
    if (error) {
      TrackingAlert("Error", error.message);
      return;
    }
    addTrackingSteps(data);
    setSteps(0);
  }

  async function deleteSteps(item: any) {
    const { error } = await supabase
      .from("trackingsteps")
      .delete()
      .eq("id", item.id);
    if (error) {
      TrackingAlert("Error", error.message);
      return;
    }
    deleteTrackingSteps(item);
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
      width: Platform.OS !== "web" ? "100%" : "33%",
    },
    scrollView: {
      height: 250,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      width: Platform.OS !== "web" ? "95%" : "50%",
      marginHorizontal: 20,
      borderRadius: 20,
    },
    scrollViewContent: {
      alignItems: "center",
      justifyContent: "center",
    },
    scrollViewTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginVertical: 10,
      borderBottomWidth: 1,
      borderColor: theme.colors.primary,
    },
    stepsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: Platform.OS !== "web" ? "90%" : "40%",
      backgroundColor: theme.colors.primary,
      marginVertical: 5,
      paddingVertical: 5,
      paddingHorizontal: 20,
      borderRadius: 10,
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
      <Text style={styles.title}>How many steps have you done today?</Text>

      {Platform.OS !== "web" ? (
        <Pressable
          onPress={toggleDatePicker}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Input
            containerStyle={styles.inputContainer}
            disabled={true}
            value={formatDate(dateSelected).toString()}
            isValid={true}
            placeholder={"Select Date"}
            icon={"calendar-outline"}
          />
        </Pressable>
      ) : (
        <WebDatePicker
          date={dateSelected}
          onChange={(value: any) => updateDate(value)}
        />
      )}
      {showDatePicker && (
        <DateTimePicker
          value={dateSelected}
          onChange={(event, selectedDate) => {
            updateDate(new Date(selectedDate!));
          }}
          mode="date"
          display="calendar"
        />
      )}
      <Input
        containerStyle={styles.inputContainer}
        value={steps}
        onUpdateValue={(value: number) => setSteps(value)}
        isValid={true}
        keyboardType={"numeric"}
        placeholder={"Steps you did today"}
        icon={"walk-outline"}
        popup={true}
      />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        <Text style={styles.scrollViewTitle}>
          Total steps today: {totalStepsToday}
        </Text>
        {stepsToday.length > 0 ? (
          stepsToday.map((item) => {
            return (
              <View style={styles.stepsContainer} key={item.id}>
                <Ionicons
                  name="walk-outline"
                  size={24}
                  color={theme.colors.secondary}
                />
                <Text>{item.steps} steps</Text>
                <Pressable
                  style={({ pressed }) => [
                    pressed && styles.pressed,
                    styles.iconContainer,
                  ]}
                  onPress={() => deleteSteps(item)}
                >
                  <Ionicons name="trash-outline" size={24} color={"red"} />
                </Pressable>
              </View>
            );
          })
        ) : (
          <Text>No steps tracked for today.</Text>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button onPress={async () => trackSteps()}>Add Tracking</Button>
      </View>
    </View>
  );
}
