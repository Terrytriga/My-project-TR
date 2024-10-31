import { Text } from "@rneui/themed";
import { Platform, StyleSheet, View } from "react-native";
import TrackingButton from "../components/TrackingButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackRoutes } from "../../navigation/Routes";

export default function SelectGoalScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackRoutes>>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 30,
      fontFamily: "Bebas",
    },
    sectionContainer: {
      flex: 1,
      paddingVertical: 20,
    },
    section: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: Platform.OS !== "web" ? "100%" : 450,
      padding: 20,
      paddingHorizontal: 40,
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Goal 🎯</Text>
      <View style={styles.sectionContainer}>
        <View style={styles.section}>
          <TrackingButton
            emoji={"🔥"}
            onPress={() => navigation.navigate("SetCaloryGoal")}
          >
            Calory Goal
          </TrackingButton>
          <TrackingButton
            emoji={"😴"}
            onPress={() => navigation.navigate("SetSleepGoal")}
          >
            Sleep Goal
          </TrackingButton>
        </View>
        <View style={styles.section}>
          <TrackingButton
            emoji={"👣"}
            onPress={() => navigation.navigate("SetStepsGoal")}
          >
            Steps Goal
          </TrackingButton>
          <TrackingButton
            emoji={"💧"}
            onPress={() => navigation.navigate("SetWaterGoal")}
          >
            Water Goal
          </TrackingButton>
        </View>
        <View style={styles.section}>
          <TrackingButton
            emoji={"🏋️"}
            onPress={() => navigation.navigate("SetWorkoutGoal")}
          >
            Workout Goal
          </TrackingButton>
        </View>
      </View>
    </View>
  );
}
