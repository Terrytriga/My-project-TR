import { StyleSheet, View } from "react-native";
import EquipmentList from "../../../components/workouts/equipment/EquipmentList";
import { useEquipmentStore } from "../../../../../store/WorkoutStore";
import FloatingButton from "../../../../shared/components/FloatingButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioEquipmentStack } from "../../../../navigation/Routes";
import AddButton from "../../../../shared/components/AddButton";
import { useLayoutEffect } from "react";
import AddButtonHeader from "../../../../shared/components/AddButtonHeader";

export default function PhysioEquipmentScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioEquipmentStack>>();
  const { equipments } = useEquipmentStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AddButtonHeader
          onPress={() => navigation.navigate("AddPhysioEquipment")}
        >
          Add
        </AddButtonHeader>
      ),
      headerShown: true,
      title: "",
    });
  }, [navigation]);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return (
    <View style={styles.container}>
      <EquipmentList equipments={equipments} />
    </View>
  );
}
