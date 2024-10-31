import { Text, useTheme } from "@rneui/themed";
import { Dimensions, StyleSheet, View } from "react-native";
import { Message } from "../../../utils/Types";
import { formatDate } from "../../../utils/FormatDate";
import { useUserStore } from "../../../store/UserStore";

const { height, width } = Dimensions.get("window");

export default function MessageItem({
  message,
  sender_id,
  receiver_id,
  datecreated,
  id,
  isread,
}: Message) {
  const { user } = useUserStore();
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      // maxHeight: height / 6,
      maxWidth: width * 0.75,
      // width: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      marginVertical: 15,
      marginHorizontal: 20,
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor:
        sender_id === user?.id ? theme.colors.senary : theme.colors.primary,
      alignSelf: sender_id === user?.id ? "flex-end" : "flex-start",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    message: {
      fontSize: 16,
    },
    date: {
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.date}>{formatDate(new Date(datecreated))}</Text>
    </View>
  );
}
