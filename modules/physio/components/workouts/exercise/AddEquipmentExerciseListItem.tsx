import { Text, useTheme } from "@rneui/themed";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Equipment } from "../../../../../utils/Types";
import {
  useEditExerciseStore,
  useNewExerciseStore,
} from "../../../../../store/WorkoutStore";

interface EquipmentItemProps {
  equipment: Equipment;
}

export default function AddEquipmentExerciseListItem({
  equipment,
}: EquipmentItemProps) {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const {
    addExerciseEquipment: addNewExerciseEquipment,
    exercise: newExercise,
  } = useNewExerciseStore();
  const {
    addExerciseEquipment: addEditExerciseEquipment,
    exercise: editExercise,
  } = useEditExerciseStore();

  function addToExercise() {
    if (newExercise) {
      addNewExerciseEquipment({
        equipment_id: equipment.id,
      });
    }
    if (editExercise) {
      addEditExerciseEquipment({
        equipment_id: equipment.id,
        exercise_id: editExercise.id,
      });
    }
    ItemAlert("Equipment Added", "Equipment has been added to the exercise.");
  }

  function confirmAdd() {
    if (isWeb) addToExercise();
    Alert.alert(
      "Add Equipment",
      "Are you sure you want to add this equipment?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: addToExercise },
      ]
    );
  }

  function ItemAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "Okay", style: "default" }]);
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      width: Platform.OS !== "web" ? "100%" : 700,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      borderBottomWidth: 1,
      borderColor: theme.colors.black,
      marginBottom: 10,
    },
    description: {
      // width: "1%",
    },
    textContainer: {
      flexDirection: "column",
      width: "65%",
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
    imageContainer: {
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      padding: 10,
    },
    image: {
      width: 100,
      height: 100,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={confirmAdd}
    >
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: equipment.pictureurl }} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{equipment.name}</Text>
        <Text style={styles.description}>{equipment.description}</Text>
      </View>
    </Pressable>
  );
}
