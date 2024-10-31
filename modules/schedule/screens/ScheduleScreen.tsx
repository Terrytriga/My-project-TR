import { Text, useTheme } from "@rneui/themed";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Input from "../../shared/components/Input";
import { formatDate } from "../../../utils/FormatDate";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useWorkoutStore } from "../../../store/WorkoutStore";
import { useMealStore } from "../../../store/MealStore";

export default function ScheduleScreen() {
  const { theme } = useTheme();
  const { workouts } = useWorkoutStore();
  const { meals } = useMealStore();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(new Date());

  function toggleDatePicker() {
    setShowDatePicker(!showDatePicker);
  }

  function updateDate(date: Date) {
    setDateSelected(date);
    setShowDatePicker(!showDatePicker);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      // justifyContent: "center",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.colors.primary,
    },
    textContainer: {
      width: "100%",
      paddingHorizontal: 40,
      // backgroundColor: "red",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginTop: 10,
    },
    subTitle: {
      fontSize: 20,
      fontFamily: "Archivo",
      // marginVertical: 5,
    },
    pressed: {
      opacity: 0.5,
    },
  });
  return (
    <View style={styles.container}>
      <Pressable
        onPress={toggleDatePicker}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <Input
          containerStyle={styles.inputContainer}
          disabled={true}
          value={formatDate(dateSelected).toString()}
          isValid={true}
          placeholder={"Date of Schedule"}
          icon={"calendar-outline"}
        />
      </Pressable>
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
      <View style={styles.textContainer}>
        <Text style={styles.subTitle}>Workouts</Text>
      </View>
      <View></View>
      <View style={styles.textContainer}>
        <Text style={styles.subTitle}>Meals</Text>
      </View>
    </View>
  );
}
