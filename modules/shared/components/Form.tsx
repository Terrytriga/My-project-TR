import { Alert, StyleSheet, Text, View } from "react-native";
import Input from "./Input";
import { useState } from "react";
import Button from "./Button";

export default function Form({ onSubmit }: any) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "red",
    },
  });
  /*
--------- One way of doing it ------------

  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  function handleValueChange(inputType: any, enteredValue: any) {
    if (inputType == "email") {
      setEnteredEmail(enteredValue);
    }
    if (inputType == "password") {
      setEnteredPassword(enteredValue);
    }
  }
*/

  const [inputs, setInputs] = useState({
    email: {
      value: "",
      isValid: true,
    },
    password: {
      value: "",
      isValid: true,
    },
  });

  function handleValueChange(inputType: any, enteredValue: any) {
    setInputs((currentValues) => {
      return {
        ...currentValues,
        [inputType]: { value: enteredValue, isValid: true },
      };
    });
  }

  function handleValidate() {
    const validate = (data: any) => {
      const emailIsValid = (email: string) => {
        const re =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      };
      const passwordIsValid = (password: string) => {
        const re =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return re.test(password);
      };

      if (emailIsValid(data.email && passwordIsValid(data.password))) {
        return true;
      } else {
        setInputs((currentValues) => {
          return {
            ...currentValues,
            email: { value: data.email, isValid: false },
            password: { value: data.password, isValid: false },
          };
        });
        return false;
      }
    };

    if (validate(inputs)) {
      onSubmit(inputs);
    } else {
      Alert.alert("Invalid input", "Please check your entered credentials.", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Okay",
          style: "default",
        },
      ]);
    }
  }

  return (
    <View style={styles.container}>
      <Text>Form</Text>
      <Text>{inputs.email.value}</Text>
      <Input
        onValueChange={handleValueChange.bind(null, "email")}
        ourLabel="Email"
      />
      <Text>{inputs.password.value}</Text>
      <Input
        onValueChange={handleValueChange.bind(null, "password")}
        ourLabel="Password"
      />
      <Button>Submit</Button>
    </View>
  );
}
