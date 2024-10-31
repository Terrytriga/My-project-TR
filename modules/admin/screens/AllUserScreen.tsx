import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { useProfileStore } from "../../../store/UserStore";
import AllUserList from "../components/AllUserList";

export default function AllUserScreen() {
  const { profiles } = useProfileStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.container}>
      {profiles && profiles?.length > 0 ? (
        <AllUserList profiles={profiles} />
      ) : (
        <Text>No Users!</Text>
      )}
    </View>
  );
}
