import { Text, useTheme } from "@rneui/themed";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { TrackingToDo } from "../../../utils/Types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { formatDate } from "../../../utils/FormatDate";
import { useCycleStatusStore } from "../../../store/TrackingStore";

type ToDoListItemProps = {
  toDo: TrackingToDo;
  onPress: () => void;
};

const { width } = Dimensions.get("window");
const aspect = 12 / 12;

export default function ToDoListItem({ toDo, onPress }: ToDoListItemProps) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "90%",
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
      backgroundColor: theme.colors.primary,
    },
  });
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Text style={styles.toDoText}>{toDo.name}</Text>
      <Pressable
        style={({ pressed }) => [
          pressed && styles.pressed,
          styles.iconPressable,
        ]}
        onPress={() => onPress()}
      >
        <Ionicons name="trash-outline" size={24} color={"red"} />
      </Pressable>
    </Pressable>
  );
}
