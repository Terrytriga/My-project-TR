import { Text, useTheme } from "@rneui/themed";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";
import Input from "../../../../shared/components/Input";
import { useState } from "react";
import Button from "../../../../shared/components/Button";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioExerciseStack } from "../../../../navigation/Routes";
import {
  useExerciseStore,
  useNewExerciseStore,
} from "../../../../../store/WorkoutStore";

export default function AddPhysioExerciseScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const route =
    useRoute<RouteProp<PhysioExerciseStack, "AddPhysioExercises">>();
  const bodypart_id = route.params.bodypart_id;
  const { setExercise, exercise } = useNewExerciseStore();
  const { exercises } = useExerciseStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioExerciseStack>>();

  const [inputs, setInputs] = useState({
    name: {
      value: exercise?.name ? exercise.name : "",
      isValid: true,
    },
    description: {
      value: exercise?.description ? exercise.description : "",
      isValid: true,
    },
    sets: {
      value: exercise?.sets ? exercise.sets : 0,
      isValid: true,
    },
    repititions: {
      value: exercise?.repititions ? exercise.repititions : 0,
      isValid: true,
    },
    duration: {
      value: exercise?.duration ? exercise.duration : 0,
      isValid: true,
    },
    weight: {
      value: exercise?.weight ? exercise.weight : 0,
      isValid: true,
    },
  });

  function updateInputValueHandler(inputType: any, enteredValue: any) {
    setInputs((previousValues) => ({
      ...previousValues,
      [inputType]: {
        value: enteredValue,
        isValid: true,
      },
    }));
  }

  async function submitHandler() {
    const validate = () => {
      const nameIsValid = (name: string) => {
        return name.length > 0;
      };

      const descriptionIsValid = (description: string) => {
        return description.length > 0;
      };
      const setsIsValid = (sets: number) => {
        return sets > 0;
      };
      const repsIsValid = (reps: number) => {
        return reps > 0;
      };
      const durationIsValid = (duration: number) => {
        return duration > 0;
      };
      const weightIsValid = (weight: number) => {
        return weight >= 0;
      };

      const doesExerciseExist = exercises.some(
        (exercise) =>
          exercise.name.toLowerCase() === inputs.name.value.toLowerCase()
      );

      if (
        nameIsValid(inputs.name.value) &&
        descriptionIsValid(inputs.description.value) &&
        setsIsValid(inputs.sets.value) &&
        repsIsValid(inputs.repititions.value) &&
        durationIsValid(inputs.duration.value) &&
        weightIsValid(inputs.weight.value) &&
        !doesExerciseExist
      ) {
        return true;
      } else {
        if (!nameIsValid(inputs.name.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              username: { value: inputs.name.value, isValid: false },
            };
          });
          ExerciseAlert("Invalid name", "Please enter a name.");
        }
        if (!descriptionIsValid(inputs.description.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              firstname: { value: inputs.description.value, isValid: false },
            };
          });
          ExerciseAlert("Invalid description", "Please enter a description.");
        }
        if (!setsIsValid(inputs.sets.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              sets: { value: inputs.sets.value, isValid: false },
            };
          });
          ExerciseAlert("Invalid sets", "Please enter a number of sets.");
        }
        if (!repsIsValid(inputs.repititions.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              repititions: { value: inputs.repititions.value, isValid: false },
            };
          });
          ExerciseAlert("Invalid reps", "Please enter a number of reps.");
        }
        if (!durationIsValid(inputs.duration.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              duration: { value: inputs.duration.value, isValid: false },
            };
          });
          ExerciseAlert("Invalid duration", "Please enter a duration.");
        }
        if (!weightIsValid(inputs.weight.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              weight: { value: inputs.weight.value, isValid: false },
            };
          });
          ExerciseAlert("Invalid weight", "Please enter a weight.");
        }
        if (doesExerciseExist) {
          ExerciseAlert(
            "Exercise already exists",
            "Please enter a different name."
          );
          setInputs((currentValues) => {
            return {
              ...currentValues,
              username: { value: inputs.name.value, isValid: false },
            };
          });
        }
        return false;
      }
    };

    if (validate()) {
      addNewExercise();
    }
    return false;
  }

  function addNewExercise() {
    setExercise({
      bodypart_id: bodypart_id,
      name: inputs.name.value,
      description: inputs.description.value,
      sets: inputs.sets.value,
      repititions: inputs.repititions.value,
      duration: inputs.duration.value,
      weight: inputs.weight.value,
    });
    navigation.navigate("AddPhysioExerciseEquipment");
  }

  const ExerciseAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      paddingBottom: 20,
    },
    inputContainer: {
      marginVertical: 5,
      width: Platform.OS !== "web" ? "100%" : "25%",
      alignItems: "center",
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          isValid={inputs.name.isValid}
          keyboardType="default"
          placeholder={"Name"}
          value={inputs.name.value}
          onUpdateValue={(value: any) => updateInputValueHandler("name", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          isValid={inputs.description.isValid}
          keyboardType="default"
          placeholder={"Description"}
          value={inputs.description.value}
          onUpdateValue={(value: any) =>
            updateInputValueHandler("description", value)
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          isValid={inputs.sets.isValid}
          keyboardType="number-pad"
          placeholder={"Sets"}
          value={isWeb ? inputs.sets.value.toString() : inputs.sets.value}
          onUpdateValue={(value: any) => updateInputValueHandler("sets", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          isValid={inputs.repititions.isValid}
          keyboardType="number-pad"
          placeholder={"Repititions"}
          value={
            isWeb
              ? inputs.repititions.value.toString()
              : inputs.repititions.value
          }
          onUpdateValue={(value: any) =>
            updateInputValueHandler("repititions", value)
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          isValid={inputs.duration.isValid}
          keyboardType="number-pad"
          placeholder={"Duration"}
          value={
            isWeb ? inputs.duration.value.toString() : inputs.duration.value
          }
          onUpdateValue={(value: any) =>
            updateInputValueHandler("duration", value)
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          isValid={inputs.weight.isValid}
          keyboardType="number-pad"
          placeholder={"Weight"}
          value={isWeb ? inputs.weight.value.toString() : inputs.weight.value}
          onUpdateValue={(value: any) =>
            updateInputValueHandler("weight", value)
          }
        />
      </View>
      <Button onPress={submitHandler}>Next</Button>
    </ScrollView>
  );
}
