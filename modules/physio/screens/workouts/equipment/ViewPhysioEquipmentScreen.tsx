import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Text, useTheme } from "@rneui/themed";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { PhysioEquipmentStack } from "../../../../navigation/Routes";
import { useEquipmentStore } from "../../../../../store/WorkoutStore";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../../../lib/SupaBase";
import LoadingOverlay from "../../../../shared/components/LoadingOverlay";

const { width, height } = Dimensions.get("window");

export default function ViewPhysioEquipmentScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { equipments, deleteEquipment } = useEquipmentStore();
  const [isLoading, setIsLoading] = useState(false);
  const route =
    useRoute<RouteProp<PhysioEquipmentStack, "ViewPhysioEquipment">>();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioEquipmentStack>>();
  const id = route.params.id;
  const equipment = equipments.find((e) => e.id === id);

  async function deleteTheEquipment() {
    if (!equipment) return;
    setIsLoading(true);
    const removeSpaces = equipment.name.replace(/\s/g, "");
    const { error: removeError } = await supabase.storage
      .from("Public")
      .remove([`Equipment/${removeSpaces}`]);

    if (removeError) {
      EquipmentAlert("Error", removeError.message);
      return;
    }
    const { error: deleteEquipmentError } = await supabase
      .from("equipment")
      .delete()
      .eq("id", equipment.id)
      .select();
    if (deleteEquipmentError) {
      EquipmentAlert("Error", "Failed to delete equipment");
      setIsLoading(false);
      return;
    }
    deleteEquipment(equipment.id);
    EquipmentAlert("Success", "Equipment deleted successfully");
    navigation.navigate("PhysioEquipment");
    setIsLoading(false);
  }

  function EquipmentAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "Ok", style: "default" }]);
  }

  function confirmDeleteEquipment() {
    if (isWeb) deleteTheEquipment();
    Alert.alert(
      "Delete Equipment",
      "Are you sure you want to delete this equipment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: deleteTheEquipment },
      ]
    );
  }

  function navigateEditEquipment() {
    navigation.navigate("EditPhysioEquipment", { id: id });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: equipment?.name,
      headerRight: () => {
        return (
          <View style={styles.iconRow}>
            <Pressable
              style={({ pressed }) => [
                pressed && styles.pressed,
                styles.iconPressable,
              ]}
              onPress={navigateEditEquipment}
            >
              <Ionicons name="pencil" size={24} color={theme.colors.primary} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.iconPressable,
                pressed && styles.pressed,
              ]}
              onPress={confirmDeleteEquipment}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
        );
      },
    });
  }, [route, navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginVertical: 10,
    },
    description: {
      fontSize: 15,
      paddingHorizontal: 10,
    },
    image: {
      width: Platform.OS !== "web" ? width * 0.6 : width / 8,
      height: Platform.OS !== "web" ? width * 0.6 : width / 8,
      borderRadius: 10,
    },
    imageContainer: {
      width: Platform.OS !== "web" ? width * 0.9 : width / 7,
      height: Platform.OS !== "web" ? width * 0.9 : width / 7,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
    },
    iconRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      width: 100,
    },
    iconPressable: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      width: 36,
      height: 36,
      marginHorizontal: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
  });
  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={
            equipment?.pictureurl
              ? { uri: equipment.pictureurl }
              : require("../../../../../assets/icon.png")
          }
          style={styles.image}
        />
      </View>
      <Text style={styles.title}>{equipment?.name}</Text>
      <Text style={styles.description}>{equipment?.description}</Text>
    </View>
  );
}
