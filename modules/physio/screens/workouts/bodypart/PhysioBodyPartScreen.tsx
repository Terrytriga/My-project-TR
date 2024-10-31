import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import BodypartList from "../../../components/workouts/bodypart/BodypartList";
import { useBodyPartStore } from "../../../../../store/WorkoutStore";

export default function PhysioBodyPartScreen() {
  const { bodyparts } = useBodyPartStore();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return (
    <View style={styles.container}>
      <BodypartList bodyparts={bodyparts} />
    </View>
  );
}
