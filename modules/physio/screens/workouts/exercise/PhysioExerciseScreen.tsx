import { Text, useTheme } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import ExerciseList from "../../../components/workouts/exercise/ExcerciseList";
import {
  useBodyPartStore,
  useEditExerciseStore,
  useExerciseStore,
} from "../../../../../store/WorkoutStore";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useLayoutEffect, useState } from "react";
import { BodyPart, Exercise } from "../../../../../utils/Types";
import FloatingButton from "../../../../shared/components/FloatingButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioExerciseStack } from "../../../../navigation/Routes";
import BodyPartList from "../../../components/workouts/exercise/BodyPartList";
import AddButtonHeader from "../../../../shared/components/AddButtonHeader";

export default function PhysioExerciseScreen() {
  const { theme } = useTheme();
  const { exercises } = useExerciseStore();
  const { bodyparts } = useBodyPartStore();
  const { clearExercise } = useEditExerciseStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioExerciseStack>>();
  const [selectedBodypart, setSelectedBodypart] = useState<BodyPart>(
    bodyparts[0]
  );
  const [exerciseList, setExerciseList] = useState<Exercise[]>();

  useEffect(() => {
    setExerciseList(
      exercises.filter(
        (exercise) => exercise.bodypart_id == selectedBodypart?.id
      )
    );
  }, [selectedBodypart, exercises]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AddButtonHeader onPress={navigateToAddExercise}>Add</AddButtonHeader>
      ),
      headerShown: true,
      title: "",
    });
  }, [navigation]);

  function navigateToAddExercise() {
    clearExercise();
    navigation.navigate("AddPhysioExercises", {
      bodypart_id: selectedBodypart?.id,
    });
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <BodyPartList
        bodyparts={bodyparts}
        selectedPart={selectedBodypart}
        onPress={setSelectedBodypart}
      />

      <ExerciseList exercises={exerciseList} />
    </View>
  );
}
