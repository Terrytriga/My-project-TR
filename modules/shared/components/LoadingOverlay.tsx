import { useTheme } from "@rneui/themed";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";

function LoadingOverlay({ message }: any) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 32,
      backgroundColor: theme.colors.background,
    },
    message: {
      fontSize: 16,
      marginBottom: 12,
    },
  });

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

export default LoadingOverlay;
