import { Text, useTheme } from "@rneui/themed";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { Chat } from "../../../utils/Types";
import TouchableScale from "react-native-touchable-scale";
import { formatDate, formatTime } from "../../../utils/FormatDate";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MessageStackRoutes } from "../../navigation/Routes";

const { height, width } = Dimensions.get("window");

export default function ChatItem({
  user_id,
  lastMessage,
  lastMessageTime,
  avatarurl,
  firstname,
  lastname,
}: Chat) {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<MessageStackRoutes>>();

  function pressHandler() {
    if (!user_id) return;
    navigation.navigate("Message", {
      user_id: user_id,
    });
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      maxHeight: height / 8,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 10,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginHorizontal: 10,
    },
    textContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      marginLeft: 15,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    date: {
      fontSize: 12,
    },
  });

  return (
    <TouchableScale
      friction={90}
      tension={100}
      activeScale={0.85}
      style={styles.container}
      onPress={pressHandler}
    >
      <Image
        style={styles.image}
        source={
          avatarurl
            ? { uri: avatarurl }
            : require("../../../assets/Profile.png")
        }
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {firstname} {lastname}
        </Text>
        <Text>{lastMessage}</Text>
        <Text style={styles.date}>
          {formatTime(new Date(lastMessageTime))} -{" "}
          {formatDate(new Date(lastMessageTime))}
        </Text>
      </View>
    </TouchableScale>
  );
}
