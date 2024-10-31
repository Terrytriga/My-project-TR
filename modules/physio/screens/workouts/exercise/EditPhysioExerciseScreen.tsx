import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, useTheme } from "@rneui/themed";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { PhysioExerciseStack } from "../../../../navigation/Routes";
import { useState } from "react";
import {
  useEditExerciseStore,
  useExerciseStore,
} from "../../../../../store/WorkoutStore";
import Button from "../../../../shared/components/Button";
import Input from "../../../../shared/components/Input";
import { supabase } from "../../../../../lib/SupaBase";

export default function EditPhysioExerciseScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { exercise } = useEditExerciseStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioExerciseStack>>();
  const { updateExercise } = useExerciseStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  function confirmHandler() {
    if (isWeb) submitHandler();
    Alert.alert("Save Changes", "Are you sure you want to save changes?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Save",
        style: "default",
        onPress: () => submitHandler(),
      },
    ]);
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

      if (
        nameIsValid(inputs.name.value) &&
        descriptionIsValid(inputs.description.value) &&
        setsIsValid(inputs.sets.value) &&
        repsIsValid(inputs.repititions.value) &&
        durationIsValid(inputs.duration.value) &&
        weightIsValid(inputs.weight.value)
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
        return false;
      }
    };

    if (validate()) {
      await editExercise();
    }
    return false;
  }

  async function editExercise() {
    if (!exercise) return;
    setIsLoading(true);

    const { data: exerciseData, error: exerciseError } = await supabase
      .from("exercise")
      .update({
        name: inputs.name.value,
        description: inputs.description.value,
        sets: inputs.sets.value,
        repititions: inputs.repititions.value,
        duration: inputs.duration.value,
        weight: inputs.weight.value === 0 ? null : inputs.weight.value,
      })
      .eq("id", exercise.id)
      .select();
    if (exerciseError) {
      ExerciseAlert("Error", exerciseError.message);
      setIsLoading(false);
      return;
    }

    updateExercise(exerciseData[0]);
    setIsLoading(false);
    setIsEditing(!isEditing);
    navigation.navigate("EditPhysioExerciseEquipment");
  }

  const ExerciseAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  };

  function cancelHandler() {
    setInputs({
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
    setIsEditing(!isEditing);
  }

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      paddingBottom: 20,
    },
    inputContainer: {
      marginVertical: 5,
      width: Platform.OS !== "web" ? "100%" : "25%",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      marginHorizontal: 10,
    },
    cancelButton: {
      backgroundColor: theme.colors.grey5,
    },
    saveButton: {
      backgroundColor: "green",
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
          value={inputs.sets.value.toString()}
          onUpdateValue={(value: any) => updateInputValueHandler("sets", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          isValid={inputs.repititions.isValid}
          keyboardType="number-pad"
          placeholder={"Repititions"}
          value={inputs.repititions.value.toString()}
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
          value={inputs.duration.value.toString()}
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
          value={inputs.weight.value.toString()}
          onUpdateValue={(value: any) =>
            updateInputValueHandler("weight", value)
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        {!isEditing ? (
          <Button
            onPress={() => setIsEditing(!isEditing)}
            style={[styles.button, styles.cancelButton]}
          >
            Edit
          </Button>
        ) : (
          <Button
            disabled={isLoading}
            style={[styles.button, styles.cancelButton]}
            onPress={cancelHandler}
          >
            Cancel
          </Button>
        )}
        {!isEditing ? (
          <Button
            style={styles.button}
            onPress={() => navigation.navigate("EditPhysioExerciseEquipment")}
          >
            Next
          </Button>
        ) : (
          <Button
            disabled={isLoading}
            style={[styles.button, styles.saveButton]}
            onPress={confirmHandler}
          >
            {isLoading ? (
              <ActivityIndicator size={"small"} color={theme.colors.primary} />
            ) : (
              "Save"
            )}
          </Button>
        )}
      </View>
    </ScrollView>
  );
}
