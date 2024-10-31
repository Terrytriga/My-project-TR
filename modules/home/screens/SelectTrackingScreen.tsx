import { Text } from "@rneui/themed";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import Button from "../../shared/components/Button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackRoutes } from "../../navigation/Routes";
import TrackingButton from "../components/TrackingButton";
import { useUserStore } from "../../../store/UserStore";

export default function SelectTrackingScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackRoutes>>();
  const { user } = useUserStore();
  const isFemale = user?.gender === "Female";
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 50,
    },
    title: {
      fontSize: 30,
      // fontWeight: "bold",
      // fontFamily: "Playball",
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
      <Text style={styles.title}>What would you like to track?</Text>
      <View style={styles.sectionContainer}>
        <View style={styles.section}>
          <TrackingButton
            emoji={"😴"}
            onPress={() => navigation.navigate("TrackingSleep")}
          >
            Sleep
          </TrackingButton>
          <TrackingButton
            emoji={"💧"}
            onPress={() => navigation.navigate("TrackingWater")}
          >
            Water
          </TrackingButton>
        </View>
        <View style={styles.section}>
          <TrackingButton
            emoji={"👣"}
            onPress={() => navigation.navigate("TrackingSteps")}
          >
            Steps
          </TrackingButton>
          <TrackingButton
            emoji={"🎯"}
            onPress={() => navigation.navigate("SelectGoal")}
          >
            Goals
          </TrackingButton>
        </View>
        <View style={styles.section}>
          <TrackingButton
            emoji={"🏋️"}
            onPress={() => navigation.navigate("TrackingWorkouts")}
          >
            Workouts
          </TrackingButton>
          <TrackingButton
            emoji={"🍽️"}
            onPress={() => navigation.navigate("TrackingMeals")}
          >
            Meals
          </TrackingButton>
        </View>

        <View style={styles.section}>
          {isFemale && (
            <TrackingButton
              emoji={"🩸"}
              onPress={() => navigation.navigate("TrackingCycle")}
            >
              Cycle
            </TrackingButton>
          )}
          <TrackingButton
            emoji={"📋"}
            onPress={() => navigation.navigate("TrackingToDo")}
          >
            To Do
          </TrackingButton>
        </View>
      </View>
    </View>
  );
}
