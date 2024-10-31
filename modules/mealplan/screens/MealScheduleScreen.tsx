import {
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text, useTheme } from "@rneui/themed";
import { useLayoutEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../../../utils/FormatDate";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MealPlanStackRoutes } from "../../navigation/Routes";
import { useMealTypeStore } from "../../../store/MealStore";
import MealPlans from "../components/MealPlans";
import Input from "../../shared/components/Input";
import WebDatePicker from "../../shared/components/web/WebDatePicker";

const { height } = Dimensions.get("window");

export default function MealScheduleScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { mealTypes } = useMealTypeStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<MealPlanStackRoutes>>();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  function updateInputValueHandler(values: Date) {
    setDate(values);
    toggleDatePicker();
  }

  function toggleDatePicker() {
    setShowDatePicker(!showDatePicker);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      flexDirection: "column",
    },

    scrollView: {
      width: "100%",
    },
    scrollViewContent: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 5,
    },
    title: {
      marginVertical: 15,
      fontSize: 20,
      fontWeight: "bold",
    },
    date: {
      fontSize: 16,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.colors.primary,
    },
    dateButton: {
      width: "100%",
      paddingVertical: 10,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      {!isWeb ? (
        <Pressable
          onPress={toggleDatePicker}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Input
            containerStyle={styles.inputContainer}
            disabled={true}
            value={formatDate(date).toString()}
            isValid={true}
            placeholder={"Date of Meal Plan"}
            icon={"calendar-outline"}
          />
        </Pressable>
      ) : (
        <WebDatePicker date={date} onChange={updateInputValueHandler} />
      )}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          onChange={(event, selecteDate) => {
            const newDate = selecteDate || date;
            updateInputValueHandler(newDate);
          }}
          mode="date"
          display="default"
        />
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {mealTypes &&
          mealTypes.map((mealType) => (
            <MealPlans
              key={mealType.mealtype_id}
              name={mealType.mealtype}
              type={mealType.mealtype_id}
              date={date}
            />
          ))}
      </ScrollView>
    </View>
  );
}
