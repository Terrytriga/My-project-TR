import { Text, useTheme } from "@rneui/themed";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Goal, Workout } from "../../../utils/Types";
import { formatDate } from "../../../utils/FormatDate";
import { Feather, Ionicons } from "@expo/vector-icons";

type GoalListItemProps = {
  goal: Goal;
  isSelected: boolean;
  onPress: () => void;
};

const { width } = Dimensions.get("window");
const aspect = 12 / 12;

export default function GoalListItem({
  goal,
  isSelected,
  onPress,
}: GoalListItemProps) {
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
      width: Platform.OS !== "web" ? "100%" : "50%",
      minWidth: Platform.OS === "web" ? width / 4 : undefined,
    },
    contentContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      paddingHorizontal: 20,
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
        <Text>{goal.name}</Text>
        {isSelected ? (
          <Feather name="check-circle" size={24} color={theme.colors.black} />
        ) : (
          <Feather name="circle" size={24} color={theme.colors.primary} />
        )}
      </View>
    </Pressable>
  );
}
