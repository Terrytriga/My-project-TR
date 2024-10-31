import { Text, useTheme } from "@rneui/themed";
import { useLayoutEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Input from "../../shared/components/Input";
import { formatDate } from "../../../utils/FormatDate";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "../../shared/components/Button";
import { useNewAssessmentStore } from "../../../store/AssessmentStore";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AssessmentStackRoutes } from "../../navigation/Routes";
import WebDatePicker from "../../shared/components/web/WebDatePicker";

const { height } = Dimensions.get("window");

export default function MenstruationScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<AssessmentStackRoutes>>();
  const route = useRoute<RouteProp<AssessmentStackRoutes, "StressLevel">>();
  const user_id = route.params.user_id;
  const { menstruation, setMenstruation, user } = useNewAssessmentStore();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [lastPeriodStart, setLastPeriodStart] = useState(
    menstruation?.lastperiodstart
      ? new Date(menstruation?.lastperiodstart)
      : new Date()
  );

  const [lastPeriodEnd, setLastPeriodEnd] = useState(
    menstruation?.lastperiodend
      ? new Date(menstruation?.lastperiodend)
      : new Date()
  );

  const [inputs, setInputs] = useState({
    cyclelength: {
      value: menstruation?.cyclelength ? menstruation.cyclelength : 0,
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

  function toggleStartPicker() {
    setShowStartPicker(!showStartPicker);
  }
  function toggleEndPicker() {
    setShowEndPicker(!showEndPicker);
  }

  function updateStartDate(date: Date) {
    setLastPeriodStart(date);
    setShowStartPicker(!showStartPicker);
  }

  function updateEndDate(date: Date) {
    setLastPeriodEnd(date);
    setShowEndPicker(!showEndPicker);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={styles.headerContainer}>
            <Text>4 OF 10</Text>
          </View>
        );
      },
    });
  }, [navigation]);

  async function submitHandler() {
    const validate = () => {
      const cycleLengthIsValid = (cycle: number) => {
        return cycle > 0;
      };

      const periodLenghtIsValid = (period: number) => {
        return period > 0;
      };

      if (cycleLengthIsValid(inputs.cyclelength.value)) {
        return true;
      } else {
        if (!cycleLengthIsValid(inputs.cyclelength.value)) {
          setInputs((previousValues) => ({
            ...previousValues,
            cyclelength: {
              value: inputs.cyclelength.value,
              isValid: false,
            },
          }));
          AssessmentAlert(
            "Sorry",
            "Please ensure that average cycle days are greater than 0."
          );
        }
        return false;
      }
    };

    if (validate()) {
      submitMenstrual();
    }
  }

  function submitMenstrual() {
    if (!user_id) return;
    setMenstruation({
      user_id: user_id,
      lastperiodstart: lastPeriodStart,
      lastperiodend: lastPeriodEnd,
      cyclelength: inputs.cyclelength.value,
      datecreated: new Date(),
    });
    navigation.navigate("ProfessionalHelp", { user_id: user_id });
  }

  function AssessmentAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "OK" }]);
  }

  function skip() {
    navigation.navigate("ProfessionalHelp", { user_id: user_id });
  }

  const styles = StyleSheet.create({
    container: {
      // height: height * 0.86,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingBottom: 20,
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 20,
    },
    headerContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.primary,
      padding: 10,
      borderRadius: 20,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.colors.primary,
    },
    pressed: {
      opacity: 0.5,
    },
    section: {
      marginVertical: 10,
    },
    subTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
    },
    skipButton: {
      backgroundColor: theme.colors.senary,
    },
    buttonContainer: {
      alignSelf: "center",
      justifyContent: "space-between",
      alignItems: "flex-end",
      width: !isWeb ? "100%" : "50%",
      flexDirection: "row",
      paddingHorizontal: 10,
      paddingBottom: 20,
    },
  });

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        automaticallyAdjustKeyboardInsets={true}
      >
        <Text style={styles.title}>
          Some details on your menstrual cycle! ❤️
        </Text>
        <View style={{ flex: 1 }}>
          <View style={styles.section}>
            <Text style={styles.subTitle}>
              On what date did your last period start?
            </Text>
            {Platform.OS !== "web" ? (
              <Pressable
                onPress={toggleStartPicker}
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <Input
                  containerStyle={styles.inputContainer}
                  disabled={true}
                  value={formatDate(lastPeriodStart).toString()}
                  isValid={true}
                  placeholder={"Start of Period"}
                  icon={"calendar-outline"}
                />
              </Pressable>
            ) : (
              <WebDatePicker
                date={lastPeriodStart}
                onChange={updateStartDate}
              />
            )}
            {showStartPicker && (
              <DateTimePicker
                value={lastPeriodStart}
                onChange={(event, selecteDate) => {
                  const date = selecteDate;
                  updateStartDate(new Date(date!));
                }}
                mode="date"
                display="calendar"
              />
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.subTitle}>
              On what date did your last period end?
            </Text>
            {Platform.OS !== "web" ? (
              <Pressable
                onPress={toggleEndPicker}
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <Input
                  containerStyle={styles.inputContainer}
                  disabled={true}
                  value={formatDate(lastPeriodEnd).toString()}
                  isValid={true}
                  placeholder={"End of Period"}
                  icon={"calendar-outline"}
                />
              </Pressable>
            ) : (
              <WebDatePicker date={lastPeriodEnd} onChange={updateEndDate} />
            )}
            {showEndPicker && (
              <DateTimePicker
                value={lastPeriodEnd}
                onChange={(event, selecteDate) => {
                  const date = selecteDate;
                  updateEndDate(new Date(date!));
                }}
                mode="date"
                display="calendar"
              />
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.subTitle}>
              How many days is your cycle on average?
            </Text>
            <Input
              containerStyle={styles.inputContainer}
              onUpdateValue={(value: any) =>
                updateInputValueHandler("cyclelength", value)
              }
              value={
                isWeb
                  ? inputs.cyclelength.value.toString()
                  : inputs.cyclelength.value
              }
              isValid={inputs.cyclelength.isValid}
              keyboardType="number-pad"
              secure={false}
              placeholder={"Cycle length in days"}
              icon="fitness-outline"
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button style={styles.skipButton} onPress={skip}>
          Skip
        </Button>
        <Button onPress={submitHandler}>Continue</Button>
      </View>
    </>
  );
}
