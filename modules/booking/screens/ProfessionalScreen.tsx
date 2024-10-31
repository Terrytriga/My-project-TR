import { Text, useTheme } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

export default function ProfessionalScreen() {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Text>Professional Screen</Text>
    </View>
  );
}
