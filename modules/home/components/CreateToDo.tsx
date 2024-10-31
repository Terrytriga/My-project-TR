import { Alert, Dimensions, Platform, StyleSheet, View } from "react-native";
import Input from "../../shared/components/Input";
import { useState } from "react";
import { useUserStore } from "../../../store/UserStore";
import { useTheme } from "@rneui/themed";
import IconButton from "../../shared/components/IconButton";
import { supabase } from "../../../lib/SupaBase";
import { useTrackingStore } from "../../../store/TrackingStore";

const { height } = Dimensions.get("window");

export default function CreateToDo() {
  const { user } = useUserStore();
  const { addTrackingToDo } = useTrackingStore();
  const [inputs, setInputs] = useState({
    name: {
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

  async function handleSubmit() {
    const validate = () => {
      const nameIsValid = (name: string) => {
        return name.length > 0;
      };
      if (nameIsValid(inputs.name.value)) {
        return true;
      }

      if (!nameIsValid(inputs.name.value)) {
        setInputs((currentInputs) => {
          return {
            ...currentInputs,
            name: { value: inputs.name.value, isValid: false },
          };
        });
        Alert.alert(
          "Invalid to do.",
          "Please ensure to do is greater than 0 characters.",
          [
            {
              text: "Okay",
              style: "default",
            },
          ]
        );
      }
    };

    if (validate()) {
      await addToDo();
    } else {
      return;
    }
  }

  async function addToDo() {
    if (!user) return;

    const { data: toDoData, error: toDoError } = await supabase
      .from("trackingtodo")
      .insert([
        {
          user_id: user.id,
          name: inputs.name.value,
          datecreated: new Date(),
        },
      ])
      .select("*")
      .single();
    if (toDoError) {
      Alert.alert("Error", toDoError.message, [
        {
          text: "Ok",
          style: "default",
        },
      ]);
      return;
    }
    addTrackingToDo(toDoData);
    setInputs((previousInputs) => {
      return {
        ...previousInputs,
        name: {
          value: "",
          isValid: true,
        },
      };
    });

    return;
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
        onUpdateValue={(value: any) => handleInputChange("name", value)}
        value={inputs.name.value}
        isValid={!inputs.name.isValid}
        placeholder={"To Do..."}
        popup={false}
      />
      <IconButton onPress={handleSubmit} />
    </View>
  );
}
