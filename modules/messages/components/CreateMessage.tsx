import { Alert, Dimensions, Platform, StyleSheet, View } from "react-native";
import Input from "../../shared/components/Input";
import { useState } from "react";
import { useUserStore } from "../../../store/UserStore";
import { useTheme } from "@rneui/themed";
import IconButton from "../../shared/components/IconButton";
import { supabase } from "../../../lib/SupaBase";

const { height } = Dimensions.get("window");
export default function CreateMessage({ receiver_id }: any) {
  const { user } = useUserStore();
  const [inputs, setInputs] = useState({
    message: {
      value: "",
      isValid: true,
    },
  });

  function handleInputChange(inputName: string, value: string) {
    setInputs((previousInputs) => ({
      ...previousInputs,
      [inputName]: {
        value: value,
        isValid: true,
      },
    }));
  }

  async function handleSubmit() {
    const validate = (data: any) => {
      const messageIsValid = (title: string) => {
        return title.length > 0;
      };
      if (messageIsValid(data.message.value)) {
        return true;
      }

      if (!messageIsValid(data.message.value)) {
        setInputs((currentInputs) => {
          return {
            ...currentInputs,
            message: { value: data.title, isValid: false },
          };
        });
        Alert.alert(
          "Invalid message.",
          "Please ensure message is greater than 0 characters.",
          [
            {
              text: "Okay",
              style: "default",
            },
          ]
        );
      }
    };

    if (validate(inputs)) {
      await sendMessage();
    } else {
      return;
    }
  }

  async function sendMessage() {
    if (!user) return;

    const { error: messageError } = await supabase.from("message").insert([
      {
        sender_id: user.id,
        receiver_id: receiver_id,
        message: inputs.message.value,
        isread: false,
        datecreated: new Date(),
      },
    ]);
    if (messageError) {
      Alert.alert("Error", "An error occurred while sending the message.", [
        {
          text: "Ok",
          style: "default",
        },
      ]);
      return;
    }
    setInputs((previousInputs) => {
      return {
        ...previousInputs,
        message: {
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
        onUpdateValue={(value: any) => handleInputChange("message", value)}
        value={inputs.message.value}
        isValid={inputs.message.isValid}
        placeholder={"Message..."}
        multiLine={true}
      />
      <IconButton onPress={handleSubmit} />
    </View>
  );
}
