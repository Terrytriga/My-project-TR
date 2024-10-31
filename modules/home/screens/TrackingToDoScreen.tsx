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
import CreateToDo from "../components/CreateToDo";
import { useTrackingStore } from "../../../store/TrackingStore";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { TrackingToDo } from "../../../utils/Types";
import Input from "../../shared/components/Input";
import { formatDate } from "../../../utils/FormatDate";
import { supabase } from "../../../lib/SupaBase";
import WebDatePicker from "../../shared/components/web/WebDatePicker";

export default function TrackingToDoScreen() {
  const { theme } = useTheme();

  const { trackingToDo, deleteTrackingToDo } = useTrackingStore();

  const [currentToDo, setCurrentToDo] = useState<TrackingToDo[]>([]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(new Date());

  useEffect(() => {
    setCurrentToDo(
      trackingToDo.filter((item) => {
        const toDoDate = new Date(item.datecreated);
        const selectedDate = new Date(dateSelected);
        return (
          toDoDate.getFullYear() === selectedDate.getFullYear() &&
          toDoDate.getMonth() === selectedDate.getMonth() &&
          toDoDate.getDate() === selectedDate.getDate()
        );
      })
    );
  }, [trackingToDo, dateSelected]);

  function toggleDatePicker() {
    setShowDatePicker(!showDatePicker);
  }

  function updateDate(date: Date) {
    setDateSelected(date);
    setShowDatePicker(!showDatePicker);
  }

  async function removeTrackingToDo(ToDo: TrackingToDo) {
    const { data, error } = await supabase
      .from("trackingtodo")
      .delete()
      .eq("id", ToDo.id)
      .select("*")
      .single();
    if (error) {
      TrackingAlert("Error", "Failed to remove to do.");
      return;
    }
    deleteTrackingToDo(data);
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
      width: "100%",
      paddingVertical: 20,
    },
    title: {
      fontSize: 24,
      fontFamily: "Bebas",
      marginBottom: 30,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.colors.primary,
    },
    scrollView: {
      width: "100%",
      alignSelf: "center",
    },
    toDoContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: Platform.OS === "web" ? "center" : undefined,
    },
    toDoItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: Platform.OS !== "web" ? "100%" : "40%",
      padding: 10,
      margin: 5,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 40,
    },
    toDoText: {
      fontSize: 18,
      marginHorizontal: 10,
    },
    iconPressable: {
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
      <Text style={styles.title}>To Do List</Text>
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.toDoContainer}
      >
        {currentToDo.map((item) => {
          return (
            <View key={item.id + item.name} style={styles.toDoItem}>
              <Text style={styles.toDoText}>{item.name}</Text>
              <Pressable
                style={({ pressed }) => [
                  pressed && styles.pressed,
                  styles.iconPressable,
                ]}
                onPress={() => removeTrackingToDo(item)}
              >
                <Ionicons name="trash-outline" size={24} color={"red"} />
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
      <CreateToDo />
    </View>
  );
}
