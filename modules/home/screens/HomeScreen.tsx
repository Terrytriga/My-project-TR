import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, useTheme } from "@rneui/themed";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { HomeStackRoutes } from "../../navigation/Routes";
import { useEffect, useLayoutEffect, useState } from "react";
import SelectTrackingButton from "../components/SelectTrackingButton";
import ToDoComponent from "../components/ToDoComponent";
import { useUserStore } from "../../../store/UserStore";
import GoalComponent from "../components/GoalComponent";
import StepsComponent from "../components/StepsComponent";
import WaterComponent from "../components/WaterComponent";
import SleepComponent from "../components/SleepComponent";
import WorkoutComponent from "../components/WorkoutComponent";
import MealComponent from "../components/MealComponent";
import { Ionicons } from "@expo/vector-icons";
import { formatMonthAndYear } from "../../../utils/FormatDate";
import MenstruationComponent from "../components/MenstruationComponent";

export default function HomeScreen() {
  const { user } = useUserStore();
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("week");
  const [workoutDate, setWorkoutDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [mealDate, setMealDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [cycleDate, setCycleDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackRoutes>>();

  function handleTabPress(tab: string) {
    setSelectedTab(tab);
  }

  function increaseCurrentDate(types: string) {
    if (types === "workout") {
      const newDate = new Date(workoutDate);
      const newMonth = newDate.getMonth() + 1;
      newDate.setMonth(newMonth);

      if (newDate.getMonth() !== newMonth % 12) {
        newDate.setDate(0);
      }

      setWorkoutDate(newDate);
    }
    if (types === "meal") {
      const newDate = new Date(mealDate);
      const newMonth = newDate.getMonth() + 1;
      newDate.setMonth(newMonth);

      if (newDate.getMonth() !== newMonth % 12) {
        newDate.setDate(0);
      }

      setMealDate(newDate);
    }
    if (types === "cycle") {
      const newDate = new Date(cycleDate);
      const newMonth = newDate.getMonth() + 1;
      newDate.setMonth(newMonth);

      if (newDate.getMonth() !== newMonth % 12) {
        newDate.setDate(0);
      }

      setCycleDate(newDate);
    }
  }

  function decreaseCurrentDate(types: string) {
    if (types === "workout") {
      const newDate = new Date(workoutDate);
      const newMonth = newDate.getMonth() - 1;
      newDate.setMonth(newMonth);

      if (newDate.getMonth() !== (newMonth + 12) % 12) {
        newDate.setDate(0);
      }

      setWorkoutDate(newDate);
    }
    if (types === "meal") {
      const newDate = new Date(mealDate);
      const newMonth = newDate.getMonth() - 1;
      newDate.setMonth(newMonth);

      if (newDate.getMonth() !== (newMonth + 12) % 12) {
        newDate.setDate(0);
      }

      setMealDate(newDate);
    }
    if (types === "cycle") {
      const newDate = new Date(cycleDate);
      const newMonth = newDate.getMonth() - 1;
      newDate.setMonth(newMonth);

      if (newDate.getMonth() !== (newMonth + 12) % 12) {
        newDate.setDate(0);
      }

      setCycleDate(newDate);
    }
  }

  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      width: Platform.OS !== "web" ? "100%" : "50%",
      alignSelf: "center",
    },
    username: {
      fontSize: 35,
      fontWeight: "bold",
      // fontFamily: "Bebas",
    },
    hi: {
      fontSize: 23,
      // marginBottom: 15,
    },
    headerContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      width: "100%",
      // backgroundColor: "red",
      paddingHorizontal: 40,
      marginVertical: 30,
    },
    textContainer: {
      width: "100%",
      paddingHorizontal: 40,
      // backgroundColor: "red",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginTop: 10,
    },
    subTitle: {
      fontSize: 20,
      fontFamily: "Archivo",
      // marginVertical: 5,
    },
    tabContainer: {
      width: Platform.OS !== "web" ? "75%" : "33%",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      marginTop: 20,
    },
    tab: {
      width: "50%",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 10,
      borderRadius: 25,
      marginHorizontal: 5,
      marginTop: 75,
      marginBottom: 10,
    },
    tabSelected: {
      backgroundColor: theme.colors.primary,
    },
    tabNotSelected: {
      backgroundColor: theme.colors.senary,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.colors.primary,
    },
    calendarContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: Platform.OS !== "web" ? "75%" : "40%",
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginTop: 15,
      backgroundColor: theme.colors.primary,
      borderRadius: 25,
    },
    calendarDateContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "50%",
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.hi}>Hi,</Text>
          <Text style={styles.username}>{user?.username}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.subTitle}>To Do</Text>
        </View>
        <ToDoComponent />
        <View style={styles.textContainer}>
          <Text style={styles.subTitle}>Goals</Text>
        </View>
        <GoalComponent />
        <View style={styles.tabContainer}>
          <Pressable
            style={({ pressed }) => [
              pressed && styles.pressed,
              styles.tab,
              selectedTab === "week"
                ? styles.tabSelected
                : styles.tabNotSelected,
            ]}
            onPress={() => handleTabPress("week")}
          >
            <Text>Week</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              pressed && styles.pressed,
              styles.tab,
              selectedTab === "month"
                ? styles.tabSelected
                : styles.tabNotSelected,
            ]}
            onPress={() => handleTabPress("month")}
          >
            <Text>Month</Text>
          </Pressable>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.subTitle}>Steps</Text>
        </View>
        <StepsComponent filter={selectedTab} />
        <View style={styles.textContainer}>
          <Text style={styles.subTitle}>Water</Text>
        </View>
        <WaterComponent filter={selectedTab} />
        <View style={styles.textContainer}>
          <Text style={styles.subTitle}>Sleep</Text>
        </View>
        <SleepComponent filter={selectedTab} />
        {user?.gender === "Female" && (
          <>
            <View style={styles.textContainer}>
              <Text style={styles.subTitle}>Cycle</Text>
            </View>
            <View style={styles.calendarContainer}>
              <Pressable
                style={({ pressed }) => [pressed && styles.pressed]}
                onPress={() => decreaseCurrentDate("cycle")}
              >
                <Ionicons name="chevron-back" size={24} color="black" />
              </Pressable>
              <View style={styles.calendarDateContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={theme.colors.secondary}
                />
                <Text>{formatMonthAndYear(workoutDate)}</Text>
              </View>
              <Pressable
                style={({ pressed }) => [pressed && styles.pressed]}
                onPress={() => increaseCurrentDate("cycle")}
              >
                <Ionicons name="chevron-forward" size={24} color="black" />
              </Pressable>
            </View>
            <MenstruationComponent selectedDate={cycleDate} />
          </>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.subTitle}>Workouts</Text>
        </View>
        <View style={styles.calendarContainer}>
          <Pressable
            style={({ pressed }) => [pressed && styles.pressed]}
            onPress={() => decreaseCurrentDate("workout")}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </Pressable>
          <View style={styles.calendarDateContainer}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={theme.colors.secondary}
            />
            <Text>{formatMonthAndYear(workoutDate)}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [pressed && styles.pressed]}
            onPress={() => increaseCurrentDate("workout")}
          >
            <Ionicons name="chevron-forward" size={24} color="black" />
          </Pressable>
        </View>
        <WorkoutComponent selectedDate={workoutDate} />
        <View style={styles.textContainer}>
          <Text style={styles.subTitle}>Meals</Text>
        </View>
        <View style={styles.calendarContainer}>
          <Pressable
            style={({ pressed }) => [pressed && styles.pressed]}
            onPress={() => decreaseCurrentDate("meal")}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </Pressable>
          <View style={styles.calendarDateContainer}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={theme.colors.secondary}
            />
            <Text>{formatMonthAndYear(mealDate)}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [pressed && styles.pressed]}
            onPress={() => increaseCurrentDate("meal")}
          >
            <Ionicons name="chevron-forward" size={24} color="black" />
          </Pressable>
        </View>
        <MealComponent selectedDate={mealDate} />
      </ScrollView>
      <SelectTrackingButton
        onPress={() => navigation.navigate("SelectTracking")}
      />
    </>
  );
}
