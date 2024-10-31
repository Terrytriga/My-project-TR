import { Text, useTheme } from "@rneui/themed";
import { Alert, Platform, StyleSheet, View } from "react-native";
import Input from "../../shared/components/Input";
import { useEffect, useLayoutEffect, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AssessmentStackRoutes } from "../../navigation/Routes";
import { useNewAssessmentStore } from "../../../store/AssessmentStore";
import Button from "../../shared/components/Button";

export default function BMIScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<AssessmentStackRoutes>>();
  const route = useRoute<RouteProp<AssessmentStackRoutes, "StressLevel">>();
  const user_id = route.params.user_id;
  const [calculatedBMI, setCalculatedBMI] = useState<number | null>(null);

  const { bmi, setBMI, user } = useNewAssessmentStore();
  const [inputs, setInputs] = useState({
    weight: {
      value: bmi ? bmi.weight : 0,
      isValid: true,
    },
    height: {
      value: bmi ? bmi.height : 0,
      isValid: true,
    },
  });

  useLayoutEffect(() => {
    const totalCount = user?.gender === "Female" ? 10 : 9;
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={styles.headerContainer}>
            <Text>3 OF {totalCount}</Text>
          </View>
        );
      },
    });
  }, [navigation]);

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
    const validate = (data: any) => {
      const weightIsValid = (weight: number) => {
        return weight > 0;
      };

      const heightIsValid = (height: number) => {
        return height > 0;
      };

      if (
        weightIsValid(data.weight.value) &&
        heightIsValid(data.height.value)
      ) {
        return true;
      } else {
        if (!weightIsValid(data.weight.value)) {
          setInputs((previousValues) => ({
            ...previousValues,
            weight: {
              value: data.weight.value,
              isValid: false,
            },
          }));
          AssessmentAlert("Error Authenticating", "Not a valid weight.");
        }
        if (!heightIsValid(data.height.value)) {
          setInputs((previousValues) => ({
            ...previousValues,
            height: {
              value: data.height.value,
              isValid: false,
            },
          }));
          AssessmentAlert("Error Authenticating", "Not a valid height.");
        }
        return false;
      }
    };

    if (validate(inputs)) {
      submitBMI();
    }
  }

  function submitBMI() {
    if (!user_id || !user) return;
    setBMI({
      user_id: user_id,
      height: inputs.height.value,
      weight: inputs.weight.value,
      datecreated: new Date(),
    });
    if (user.gender === "Female") {
      navigation.navigate("Menstruation", { user_id: user_id });
    } else {
      navigation.navigate("ProfessionalHelp", { user_id: user_id });
    }
  }

  function calculateBMI() {
    if (inputs.weight.value && inputs.height.value) {
      const weight = inputs.weight.value;
      const height = inputs.height.value / 100;
      const bmi = weight / (height * height);
      const rounded = Math.round(bmi * 100) / 100;
      setCalculatedBMI(rounded);
    }
  }

  useEffect(() => {
    if (inputs.weight.value && inputs.height.value) {
      calculateBMI();
    }
  }, [inputs.height.value, inputs.weight.value]);

  function AssessmentAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "OK" }]);
  }

  function skip() {
    if (!user_id || !user?.gender) return;
    if (user.gender === "Female") {
      navigation.navigate("Menstruation", { user_id: user_id });
    } else {
      navigation.navigate("ProfessionalHelp", { user_id: user_id });
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 20,
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginVertical: 20,
    },
    section: {
      alignItems: "center",
      justifyContent: "center",
    },
    headerContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.primary,
      padding: 10,
      borderRadius: 20,
    },
    inputContainer: {
      flex: 1,
    },
    rowContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      width: "100%",
      paddingHorizontal: 20,
      // backgroundColor: "red",
    },
    halfInput: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.colors.primary,
      borderRadius: 20,
      height: 50,
      width: Platform.OS !== "web" ? "60%" : "100%",
      padding: 0,
      margin: 0,
    },
    skipButton: {
      backgroundColor: theme.colors.senary,
    },
    buttonContainer: {
      justifyContent: "space-between",
      width: !isWeb ? "100%" : "50%",
      flexDirection: "row",
      paddingHorizontal: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is your weight and height?</Text>
      <View style={styles.inputContainer}>
        <View style={styles.rowContainer}>
          <Input
            containerStyle={styles.halfInput}
            onUpdateValue={(value: any) =>
              updateInputValueHandler("weight", value)
            }
            value={isWeb ? inputs.weight.value.toString() : inputs.weight.value}
            isValid={inputs.weight.isValid}
            keyboardType="number-pad"
            secure={false}
            placeholder={"Weight in kg"}
            icon="scale-outline"
            popup={Platform.OS === "web"}
          />
          <Input
            onUpdateValue={(value: any) =>
              updateInputValueHandler("height", value)
            }
            containerStyle={styles.halfInput}
            value={isWeb ? inputs.height.value.toString() : inputs.height.value}
            isValid={inputs.height.isValid}
            keyboardType="number-pad"
            secure={false}
            placeholder={"Height in cm"}
            icon="accessibility-outline"
            popup={Platform.OS === "web"}
          />
        </View>
        <View style={styles.section}>
          {!calculatedBMI ? (
            <Text style={styles.subtitle}>Your BMI is...</Text>
          ) : (
            <Text style={styles.subtitle}>Your BMI is {calculatedBMI}</Text>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.skipButton} onPress={skip}>
          Skip
        </Button>
        <Button onPress={submitHandler}>Continue</Button>
      </View>
    </View>
  );
}
