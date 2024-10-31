import { Text, useTheme } from "@rneui/themed";
import { Image, Platform, Pressable, StyleSheet, View } from "react-native";
import { Equipment } from "../../../../../utils/Types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PhysioEquipmentStack } from "../../../../navigation/Routes";

interface EquipmentItemProps {
  equipment: Equipment;
}

export default function EquipmentListItem({ equipment }: EquipmentItemProps) {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioEquipmentStack>>();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      width: Platform.OS !== "web" ? "100%" : 700,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      borderBottomWidth: 1,
      borderColor: theme.colors.black,
      marginBottom: 10,
    },
    description: {
      // width: "1%",
    },
    textContainer: {
      flexDirection: "column",
      width: "65%",
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
    imageContainer: {
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      padding: 10,
    },
    image: {
      width: 100,
      height: 100,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() =>
        navigation.navigate("ViewPhysioEquipment", {
          id: equipment.id,
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: equipment.pictureurl }} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{equipment.name}</Text>
        <Text style={styles.description}>{equipment.description}</Text>
      </View>
    </Pressable>
  );
}
