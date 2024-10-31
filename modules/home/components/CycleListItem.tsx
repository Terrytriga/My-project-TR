import { Text, useTheme } from "@rneui/themed";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Mood, TrackingMenstruation } from "../../../utils/Types";
import { Feather, Fontisto, Ionicons } from "@expo/vector-icons";
import { formatDate } from "../../../utils/FormatDate";

type CycleListItemProps = {
  cycle: TrackingMenstruation;
  isSelected: boolean;
  onPress: () => void;
};

const { width } = Dimensions.get("window");
const aspect = 12 / 12;

export default function CycleListItem({
  cycle,
  isSelected,
  onPress,
}: CycleListItemProps) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      marginVertical: 10,
      paddingVertical: 20,
      backgroundColor: isSelected ? theme.colors.primary : theme.colors.senary,
      borderWidth: 1,
      borderColor: isSelected ? theme.colors.senary : theme.colors.primary,
      borderRadius: 50,
      width: Platform.OS !== "web" ? "100%" : 450,
    },
    contentContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      paddingHorizontal: 20,
      // backgroundColor: "blue",
    },
    title: {
      fontSize: 24,
      fontFamily: "Bebas",
      marginBottom: 15,
    },
    textContainer: {
      flexDirection: "column",
      alignItems: "center",
      width: "85%",
      // backgroundColor: "green",
    },
    textRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "85%",
      // backgroundColor: "red",
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
  });
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          {/* <Text style={styles.title}>Status: {status?.status}</Text> */}
          <View style={styles.textRow}>
            <Text>Period Start: </Text>
            <Text>{formatDate(new Date(cycle.periodstart))}</Text>
          </View>
          <View style={styles.textRow}>
            <Text>Period End: </Text>
            <Text>
              {cycle.periodend
                ? formatDate(new Date(cycle.periodend))
                : "Not Ended"}
            </Text>
          </View>
          <View style={styles.textRow}>
            <Text>Period Length: </Text>
            <Text>{cycle.periodlength ? cycle.periodlength : "No Length"}</Text>
          </View>
          <View style={styles.textRow}>
            <Text>Cycle Length: </Text>
            <Text>{cycle.cyclelength ? cycle.cyclelength : "No Length"}</Text>
          </View>
        </View>
        {isSelected ? (
          <Ionicons name="heart" size={24} color="red" />
        ) : (
          <Feather name="circle" size={24} color={theme.colors.primary} />
        )}
      </View>
    </Pressable>
  );
}
