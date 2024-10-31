import { Text, useTheme } from "@rneui/themed";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { TrackingToDo } from "../../../utils/Types";
import { useTrackingStore } from "../../../store/TrackingStore";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/SupaBase";
import ToDoList from "./ToDoList";
import { Feather } from "@expo/vector-icons";
import { formatDate } from "../../../utils/FormatDate";

export default function ToDoComponent() {
  const { theme } = useTheme();
  const { trackingToDo, deleteTrackingToDo, updateTrackingToDo } =
    useTrackingStore();
  const [currentToDos, setCurrentToDos] = useState<TrackingToDo[]>([]);

  useEffect(() => {
    setCurrentToDos(
      trackingToDo
        .filter((toDo) => {
          const currentDate = new Date();
          return new Date(toDo.datecreated).getDate() == currentDate.getDate();
        })
        .sort((a, b) => {
          const dateA = new Date(a.datecreated);
          const dateB = new Date(b.datecreated);
          return dateB.getTime() - dateA.getTime();
        })
    );
  }, [trackingToDo]);

  async function handleToDo(item: TrackingToDo) {
    const { data, error } = await supabase
      .from("trackingtodo")
      .update({
        completed: !item.completed,
      })
      .eq("id", item.id)
      .select("*")
      .single();
    if (error) {
      TrackingAlert("Error", error.message);
      return;
    }
    updateTrackingToDo(data);
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
      justifyContent: "center",
      alignItems: "center",
      // borderTopWidth: 1,
      // borderBottomWidth: 1,
      // borderColor: theme.colors.primary,
      width: "100%",
      paddingVertical: 10,
    },
    title: {
      fontSize: 24,
      fontFamily: "Bebas",
      marginBottom: 15,
    },
    text: {
      fontSize: 18,
      marginHorizontal: 10,
    },
    item: {
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: Platform.OS !== "web" ? "90%" : "50%",
      padding: 10,
      margin: 5,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 40,
    },
    completed: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.secondary,
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
    textContainer: {
      paddingVertical: 40,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <Text>{formatDate(new Date())}</Text>
      {currentToDos.length > 0 ? (
        currentToDos.map((toDo) => (
          <Pressable
            style={({ pressed }) => [
              styles.item,
              pressed && styles.pressed,
              toDo.completed && styles.completed,
            ]}
            onPress={() => handleToDo(toDo)}
            key={toDo.id}
          >
            <Text style={styles.text}>{toDo.name}</Text>
            {toDo.completed ? (
              <Feather
                name="check-circle"
                size={24}
                color={theme.colors.black}
              />
            ) : (
              <Feather name="circle" size={24} color={theme.colors.primary} />
            )}
          </Pressable>
        ))
      ) : (
        <View style={styles.textContainer}>
          <Text>No To Dos today.</Text>
        </View>
      )}
    </View>
  );
}
