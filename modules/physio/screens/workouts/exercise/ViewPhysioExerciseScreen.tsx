import { Text, useTheme } from "@rneui/themed";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import ExerciseEquipmentHorizontalList from "../../../components/workouts/ExerciseEquipmentHorizontalList";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  useEditExerciseStore,
  useEquipmentStore,
  useExerciseEquipmentStore,
  useExerciseInstructionStore,
  useExerciseStore,
  useNewExerciseStore,
} from "../../../../../store/WorkoutStore";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioExerciseStack } from "../../../../navigation/Routes";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Equipment } from "../../../../../utils/Types";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../../../lib/SupaBase";
import LoadingOverlay from "../../../../shared/components/LoadingOverlay";

export default function ViewPhysioExerciseScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { clearExercise } = useNewExerciseStore();
  const { setExercise, setExerciseInstructions, setExerciseEquipments } =
    useEditExerciseStore();
  const { exercises, deleteExercise } = useExerciseStore();
  const {
    exerciseEquipments: exerciseEquipmentStore,
    deleteExerciseEquipment,
  } = useExerciseEquipmentStore();
  const { equipments } = useEquipmentStore();
  const {
    exerciseInstructions: exerciseInstructionStore,
    deleteExerciseInstruction,
  } = useExerciseInstructionStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioExerciseStack>>();
  const route =
    useRoute<RouteProp<PhysioExerciseStack, "ViewPhysioExercises">>();
  const id = route.params.id;
  const exercise = exercises.find((exercise) => exercise.id === id);
  const exerciseInstructions = exerciseInstructionStore.filter(
    (instruction) => instruction.exercise_id === id
  );
  const exerciseEquipments = exerciseEquipmentStore.filter(
    (eq) => eq.exercise_id === id
  );

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  useEffect(() => {
    if (!exerciseEquipmentStore || !equipments) return;
    setEquipment(
      exerciseEquipmentStore
        .filter((eq) => eq.exercise_id === id)
        .map((equipment) => {
          const foundEquipment = equipments.find(
            (equip) => equip.id === equipment.equipment_id
          );
          return foundEquipment || null;
        })
        .filter((item) => item !== null)
    );
  }, [route, navigation]);

  async function deleteTheExercise() {
    setIsLoading(true);
    const { data: exerciseInstructionData, error: exerciseInstructionError } =
      await supabase
        .from("exerciseinstruction")
        .delete()
        .eq("exercise_id", id)
        .select();
    if (exerciseInstructionError) {
      ExerciseAlert("Error", exerciseInstructionError.message);
      setIsLoading(false);
      return;
    }
    exerciseInstructionData.forEach((instruction) => {
      deleteExerciseInstruction(instruction.id);
    });

    const { data: exerciseEquipmentData, error: exerciseEquipmentError } =
      await supabase
        .from("exerciseequipment")
        .delete()
        .eq("exercise_id", id)
        .select();
    if (exerciseEquipmentError) {
      ExerciseAlert("Error", exerciseEquipmentError.message);
      setIsLoading(false);
      return;
    }
    exerciseEquipmentData.forEach((equipment) => {
      deleteExerciseEquipment(equipment.id);
    });

    const { data: exerciseData, error: exerciseError } = await supabase
      .from("exercise")
      .delete()
      .eq("id", id)
      .select();
    if (exerciseError) {
      ExerciseAlert("Error", exerciseError.message);
      setIsLoading(false);
      return;
    }
    deleteExercise(exerciseData[0].id);

    ExerciseAlert("Success", "Exercise deleted successfully");
    navigation.navigate("PhysioExercises");
    setIsLoading(false);
  }

  function confirmDeleteExercise() {
    if (isWeb) deleteTheExercise();
    Alert.alert("Delete Meal", "Are you sure you want to delete this meal?", [
      {
        text: "No",
        style: "default",
      },
      {
        text: "Yes",
        onPress: () => deleteTheExercise(),
        style: "destructive",
      },
    ]);
  }
  const ExerciseAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerRight: () => {
        return (
          <View style={styles.iconRow}>
            <Pressable
              style={({ pressed }) => [
                pressed && styles.pressed,
                styles.iconPressable,
              ]}
              onPress={navigateToEditExercise}
            >
              <Ionicons name="pencil" size={24} color={theme.colors.primary} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.iconPressable,
                pressed && styles.pressed,
              ]}
              onPress={confirmDeleteExercise}
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
  }, [navigation, route.params]);

  function navigateToEditExercise() {
    if (!exercise || !exerciseInstructions || !exerciseEquipments) return;
    clearExercise();
    setExercise(exercise);
    setExerciseInstructions(exerciseInstructions);
    setExerciseEquipments(exerciseEquipments);
    navigation.navigate("EditPhysioExercises");
  }

  const styles = StyleSheet.create({
    container: {
      alignItems: "flex-start",
      padding: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: "gray",
    },
    section: {
      marginTop: 20,
      width: Platform.OS !== "web" ? "100%" : "50%",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
    },
    instructionContainer: {
      padding: 5,
      marginVertical: 10,
      width: "95%",
      borderBottomWidth: 1,
      // borderTopWidth: 1,
      borderColor: theme.colors.primary,
      // borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    instruction: {
      fontSize: 16,
      marginBottom: 5,
    },
    instructionStep: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
      color: theme.colors.primary,
      marginRight: 10,
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
      backgroundColor: theme.colors.primary,
    },
  });

  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{exercise?.name}</Text>
      <Text style={styles.subtitle}>Time: {exercise?.duration} mins</Text>
      <Text style={styles.subtitle}>Sets: {exercise?.sets}</Text>
      <Text style={styles.subtitle}>Reps: {exercise?.repititions}</Text>
      {exercise?.weight && (
        <Text style={styles.subtitle}>Weight: {exercise?.weight}Kg</Text>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{exercise?.description}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipment</Text>
        {equipment.length > 0 ? (
          <ExerciseEquipmentHorizontalList equipments={equipment} />
        ) : (
          <Text style={styles.description}>No Equipment required.</Text>
        )}
      </View>
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>How To Do It</Text>
          <Text style={styles.subtitle}>
            {exerciseInstructions.length} Steps
          </Text>
        </View>
        {exerciseInstructions.map((instruction, index) => {
          return (
            <View key={index} style={styles.instructionContainer}>
              <View>
                <Text style={styles.instructionStep}>{index + 1}.</Text>
              </View>
              <Text style={styles.instruction}>{instruction.instruction}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
