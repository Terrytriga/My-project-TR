import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { MessageStackRoutes } from "../../navigation/Routes";
import { useLayoutEffect } from "react";
import { useProfileStore } from "../../../store/UserStore";
import ContactList from "../components/ContactList";

export default function ContactScreen() {
  const { profiles } = useProfileStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<MessageStackRoutes>>();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Search Contact",
      headerShown: true,
    });
  }, [navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
  });
  return (
    <View style={styles.container}>
      {profiles ? (
        <ContactList contacts={profiles} />
      ) : (
        <Text>Search Contact Screen</Text>
      )}
    </View>
  );
}
