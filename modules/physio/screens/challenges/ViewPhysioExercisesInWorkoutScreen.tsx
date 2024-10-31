import { Text, useTheme } from "@rneui/themed";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import {
  useEquipmentStore,
  useExerciseEquipmentStore,
  useExerciseInstructionStore,
  useExerciseStore,
} from "../../../../store/WorkoutStore";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  PhysioChallengeStack,
  PhysioWorkoutStack,
} from "../../../navigation/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useLayoutEffect, useState } from "react";
import ExerciseEquipmentHorizontalList from "../../components/workouts/ExerciseEquipmentHorizontalList";
import { Equipment } from "../../../../utils/Types";

export default function ViewPhysioExercisesInWorkoutScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { exercises } = useExerciseStore();
  const { exerciseEquipments } = useExerciseEquipmentStore();
  const { equipments } = useEquipmentStore();
  const { exerciseInstructions: exerciseInstructionStore } =
    useExerciseInstructionStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioChallengeStack>>();
  const route =
    useRoute<RouteProp<PhysioChallengeStack, "ViewPhysioExercisesInWorkout">>();
  const id = route.params.id;
  const exercise = exercises.find((exercise) => exercise.id === id);
  const exerciseInstructions = exerciseInstructionStore.filter(
    (instruction) => instruction.exercise_id === id
  );

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  useEffect(() => {
    if (!exerciseEquipments || !equipments) return;
    setEquipment(
      exerciseEquipments
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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
    });
  }, [route, navigation]);

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
  });

  return (
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
