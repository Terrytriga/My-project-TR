import { useState } from "react";
import { Alert, Dimensions, Platform, StyleSheet, View } from "react-native";
import Input from "../../../../shared/components/Input";
import IconButton from "../../../../shared/components/IconButton";
import {
  useEditExerciseStore,
  useNewExerciseStore,
} from "../../../../../store/WorkoutStore";

const { height } = Dimensions.get("window");

export default function CreateExerciseInstruction() {
  const {
    addExerciseInstruction: addNewExerciseInstruction,
    exercise: newExercise,
  } = useNewExerciseStore();

  const {
    addExerciseInstruction: addEditExerciseInstruction,
    exercise: editExercise,
  } = useEditExerciseStore();
  const [inputs, setInputs] = useState({
    instruction: {
      value: "",
      isValid: true,
    },
  });

  function handleInputChange(inputName: string, value: string) {
    setInputs((previousInputs) => ({
      ...previousInputs,
      [inputName]: {
        value: value,
      },
    }));
  }

  function handleSubmit() {
    const validate = () => {
      const instructionIsValid = (instruction: string) => {
        return instruction.length > 0;
      };
      if (instructionIsValid(inputs.instruction.value)) {
        return true;
      } else {
        setInputs({
          instruction: { value: inputs.instruction.value, isValid: false },
        });
        Alert.alert(
          "Invalid instruction.",
          "Please ensure instruction is greater than 0 characters.",
          [
            {
              text: "Okay",
              style: "default",
            },
          ]
        );
        return false;
      }
    };

    if (validate()) {
      if (newExercise) {
        addNewExerciseInstruction({
          instruction: inputs.instruction.value,
        });
      }
      if (editExercise) {
        addEditExerciseInstruction({
          exercise_id: editExercise.id,
          instruction: inputs.instruction.value,
        });
      }

      setInputs({
        instruction: { value: "", isValid: true },
      });
    }
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: height / 10,
      paddingHorizontal: 10,
      alignSelf: "center",
      width: Platform.OS !== "web" ? "100%" : "50%",
    },
    inputContainer: {
      width: "90%",
    },
  });

  return (
    <View style={styles.container}>
      <Input
        containerStyle={styles.inputContainer}
        onUpdateValue={(value: any) => handleInputChange("instruction", value)}
        value={inputs.instruction.value}
        isValid={!inputs.instruction.isValid}
        placeholder={"Instruction..."}
        multiLine={true}
      />
      <IconButton onPress={handleSubmit} />
    </View>
  );
}
