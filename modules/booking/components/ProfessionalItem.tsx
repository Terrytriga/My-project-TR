import { Text } from "@rneui/themed";
import { Image, StyleSheet, View } from "react-native";

export default function ProfessionalItem({
  avatarurl,
  name,
  title,
  type,
}: any) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return (
    <View style={styles.container}>
      <Image />
      <Text>Professional Item</Text>
    </View>
  );
}
