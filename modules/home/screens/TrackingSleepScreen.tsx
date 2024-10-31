import DateTimePicker from "@react-native-community/datetimepicker";
import { Text, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { Slider } from "react-native-range-slider-expo";
import Button from "../../shared/components/Button";
import Input from "../../shared/components/Input";
import { formatDate } from "../../../utils/FormatDate";
import { supabase } from "../../../lib/SupaBase";
import { useUserStore } from "../../../store/UserStore";
import { useTrackingStore } from "../../../store/TrackingStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackRoutes } from "../../navigation/Routes";
import WebDatePicker from "../../shared/components/web/WebDatePicker";

export default function TrackingSleepScreen() {
  const { user } = useUserStore();
  const { theme } = useTheme();
  const { addTrackingSleep, updateTrackingSleep, trackingSleep } =
    useTrackingStore();

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackRoutes>>();

  const [value, setValue] = useState(0);
  const [initialValue, setInitialValue] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(new Date());

  const trackingExists = trackingSleep.find((tracking) => {
    const dateCreatedString = new Date(tracking.datecreated)
      .toISOString()
      .slice(0, 10);
    const dateSelectedString = dateSelected.toISOString().slice(0, 10);
    return dateCreatedString === dateSelectedString;
  });

  useEffect(() => {
    if (trackingSleep.length === 0) return;
    const todaySleep = trackingSleep.find((item) => {
      const sleepDate = new Date(item.datecreated);
      const selectedDate = new Date(dateSelected);
      return (
        sleepDate.getFullYear() === selectedDate.getFullYear() &&
        sleepDate.getMonth() === selectedDate.getMonth() &&
        sleepDate.getDate() === selectedDate.getDate()
      );
    });
    if (todaySleep) {
      setInitialValue(todaySleep.hours);
      setValue(todaySleep.hours);
    }
  }, [trackingSleep, dateSelected]);

  function toggleDatePicker() {
    setShowDatePicker(!showDatePicker);
  }

  function updateDate(date: Date) {
    setDateSelected(date);
    setShowDatePicker(!showDatePicker);
  }

  async function trackSleep() {
    if (!user) return;
    if (!trackingExists) {
      const { data, error } = await supabase
        .from("trackingsleep")
        .insert([
          {
            user_id: user.id,
            hours: value,
            datecreated: new Date(dateSelected),
          },
        ])
        .select("*")
        .single();
      if (error) {
        TrackingAlert("Error", error.message);
        return;
      }
      addTrackingSleep(data);
    } else {
      const { data, error } = await supabase
        .from("trackingsleep")
        .update({
          hours: value,
        })
        .eq("id", trackingExists.id)
        .select("*")
        .single();

      if (error) {
        TrackingAlert("Error", error.message);
        return;
      }
      updateTrackingSleep(data);
    }
    navigation.navigate("Home");
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
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.colors.primary,
      width: Platform.OS !== "web" ? "100%" : "25%",
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
      <Text style={styles.title}>How many hours did you sleep?</Text>
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
          onChange={(event, selecteDate) => {
            const date = selecteDate;
            updateDate(new Date(date!));
          }}
          mode="date"
          display="calendar"
        />
      )}
      {Platform.OS !== "web" ? (
        <Slider
          min={0}
          max={24}
          step={1}
          valueOnChange={(value) => setValue(value)}
          initialValue={initialValue ? initialValue : 12}
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
          placeholder={"Hours Slept"}
          icon={"time-outline"}
          popup={true}
        />
      )}
      {Platform.OS === "web" && <View style={{ flex: 1 }}></View>}
      <Text style={styles.subTitle}>You slept {value} hours.</Text>
      <View style={styles.buttonContainer}>
        <Button onPress={async () => await trackSleep()}>
          {trackingExists ? "Update Tracking" : "Add Tracking"}
        </Button>
      </View>
    </View>
  );
}
