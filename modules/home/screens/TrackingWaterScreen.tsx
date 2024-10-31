import { Text, useTheme } from "@rneui/themed";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Slider } from "react-native-range-slider-expo";
import { useUserStore } from "../../../store/UserStore";
import { useTrackingStore } from "../../../store/TrackingStore";
import { useEffect, useState } from "react";
import Button from "../../shared/components/Button";
import { formatDate, formatTime } from "../../../utils/FormatDate";
import Input from "../../shared/components/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../lib/SupaBase";
import { TrackingWater } from "../../../utils/Types";
import WebDatePicker from "../../shared/components/web/WebDatePicker";

export default function TrackingWaterScreen() {
  const { user } = useUserStore();
  const { theme } = useTheme();
  const [value, setValue] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(new Date());

  const { trackingWater, addTrackingWater, deleteTrackingWater } =
    useTrackingStore();

  const [trackingToday, setTrackingToday] = useState<TrackingWater[]>([]);
  const [bottlesOfWater, setBottlesOfWater] = useState(0);

  useEffect(() => {
    setTrackingToday(
      trackingWater.filter((tracking) => {
        if (!tracking.datecreated) return false;
        const dateCreatedString = new Date(tracking.datecreated)
          .toISOString()
          .slice(0, 10);
        const dateSelectedString = dateSelected.toISOString().slice(0, 10);
        return dateCreatedString === dateSelectedString;
      })
    );
  }, [trackingWater, dateSelected]);

  useEffect(() => {
    setBottlesOfWater(
      trackingToday.reduce((acc, item) => acc + item.bottles, 0)
    );
  }, [trackingToday]);

  async function trackWater() {
    if (!user) return;
    const { data, error } = await supabase
      .from("trackingwater")
      .insert([
        {
          user_id: user.id,
          bottles: value,
          datecreated: new Date(dateSelected),
        },
      ])
      .select("*")
      .single();
    if (error) {
      TrackingAlert("Error", error.message);
      return;
    }
    addTrackingWater(data);
  }

  async function deleteWater(item: any) {
    const { error } = await supabase
      .from("trackingwater")
      .delete()
      .eq("id", item.id);
    if (error) {
      TrackingAlert("Error", error.message);
      return;
    }
    deleteTrackingWater(item);
  }

  function TrackingAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "OK",
      },
    ]);
  }

  function toggleDatePicker() {
    setShowDatePicker(!showDatePicker);
  }

  function toggleTimePicker() {
    setShowTimePicker(!showTimePicker);
  }

  function updateDate(date: Date) {
    setDateSelected(date);
    setShowDatePicker(false);
  }

  function updateTime(date: Date) {
    setDateSelected(date);
    setShowTimePicker(false);
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
    bottleConainer: {
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
      <Text style={styles.title}>
        How many bottles of water (500ml) did you have?
      </Text>
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
        <WebDatePicker date={dateSelected} onChange={updateDate} />
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

      {/* Time Picker */}

      {Platform.OS !== "web" ? (
        <Pressable
          onPress={toggleTimePicker}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Input
            containerStyle={styles.inputContainer}
            disabled={true}
            value={formatTime(dateSelected).toString()}
            isValid={true}
            placeholder={"Select Time"}
            icon={"time-outline"}
          />
        </Pressable>
      ) : (
        <WebDatePicker
          date={dateSelected}
          onChange={(value: any) => updateTime(value)}
          enableTimeSelect={true}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={dateSelected}
          onChange={(event, selectedDate) => {
            updateTime(new Date(selectedDate!));
          }}
          mode="time"
          display="clock"
        />
      )}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.scrollViewTitle}>
          Water Tracked Today: {bottlesOfWater} bottles
        </Text>
        {trackingToday.length > 0 ? (
          trackingToday.map((item) => {
            return (
              <View style={styles.bottleConainer} key={item.id}>
                <FontAwesome6
                  name="bottle-water"
                  size={24}
                  color={theme.colors.secondary}
                />
                <Text>{item.bottles}</Text>
                <Text>Time: {formatTime(new Date(item.datecreated))}</Text>
                <Pressable
                  style={({ pressed }) => [
                    pressed && styles.pressed,
                    styles.iconContainer,
                  ]}
                  onPress={() => deleteWater(item)}
                >
                  <Ionicons name="trash-outline" size={24} color={"red"} />
                </Pressable>
              </View>
            );
          })
        ) : (
          <Text>No bottles of water tracked for today.</Text>
        )}
      </ScrollView>
      <Text style={styles.subTitle}>Number of bottles to track {value}.</Text>
      {Platform.OS !== "web" ? (
        <Slider
          min={0}
          max={10}
          step={1}
          valueOnChange={(value) => setValue(value)}
          initialValue={6}
          knobColor={theme.colors.secondary}
          valueLabelsBackgroundColor="black"
          inRangeBarColor="purple"
          outOfRangeBarColor={theme.colors.primary}
          rangeLabelsTextColor={theme.colors.black}
        />
      ) : (
        <Input
          containerStyle={styles.inputContainer}
          value={value}
          onUpdateValue={(value: number) => setValue(value)}
          isValid={true}
          keyboardType={"numeric"}
          placeholder={"Bottles of Water"}
          icon={"water-outline"}
          popup={true}
        />
      )}
      <View style={styles.buttonContainer}>
        <Button onPress={trackWater}>Add Tracking</Button>
      </View>
    </View>
  );
}
