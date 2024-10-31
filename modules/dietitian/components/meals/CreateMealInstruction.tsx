import { useState } from "react";
import { Alert, Dimensions, Platform, StyleSheet, View } from "react-native";
import { useEditMealStore, useNewMealStore } from "../../../../store/MealStore";
import Input from "../../../shared/components/Input";
import IconButton from "../../../shared/components/IconButton";

const { height } = Dimensions.get("window");
export default function CreateMealInstruction() {
  const { addMealInstruction: addNewMealInstruction, meal: newMeal } =
    useNewMealStore();
  const { addMealInstruction: addEditmealInstruction, meal: editMeal } =
    useEditMealStore();
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
      if (newMeal) {
        addNewMealInstruction({
          instruction: inputs.instruction.value,
        });
      }
      if (editMeal) {
        addEditmealInstruction({
          meal_id: editMeal.meal_id,
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
      width: Platform.OS !== "web" ? "100%" : "40%",
      paddingHorizontal: 10,
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
        popup={false}
      />
      <IconButton onPress={handleSubmit} />
    </View>
  );
}
