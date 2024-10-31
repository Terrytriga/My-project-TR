import { Text, useTheme } from "@rneui/themed";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Mood } from "../../../utils/Types";
import { Feather } from "@expo/vector-icons";

type MoodListItemProps = {
  mood: Mood;
  isSelected: boolean;
  onPress: () => void;
};

const { width } = Dimensions.get("window");
const aspect = 12 / 12;

export default function MoodListItem({
  mood,
  isSelected,
  onPress,
}: MoodListItemProps) {
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
        <Text>{mood.name}</Text>
        {isSelected ? (
          <Feather name="check-circle" size={24} color={theme.colors.black} />
        ) : (
          <Feather name="circle" size={24} color={theme.colors.primary} />
        )}
      </View>
    </Pressable>
  );
}
