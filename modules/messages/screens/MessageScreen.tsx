import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import MessageList from "../components/MessageList";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { MessageStackRoutes } from "../../navigation/Routes";
import { useMessageStore } from "../../../store/CommunityStore";
import { useEffect, useLayoutEffect, useState } from "react";
import { Message } from "../../../utils/Types";
import { Text, useTheme, useThemeMode } from "@rneui/themed";
import CreateMessage from "../components/CreateMessage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useProfileStore } from "../../../store/UserStore";

const { height } = Dimensions.get("window");
export default function MessageScreen() {
  const { theme } = useTheme();
  const { mode } = useThemeMode();
  const route = useRoute<RouteProp<MessageStackRoutes, "Message">>();
  const navigation =
    useNavigation<NativeStackNavigationProp<MessageStackRoutes>>();
  const { user_id } = route.params;
  const { profiles } = useProfileStore();
  const profile = profiles.find((profile) => profile.user_id === user_id);
  const { messages } = useMessageStore();
  const [messageList, setMessageList] = useState<Message[]>([]);

  useLayoutEffect(() => {
    if (!profile) return;
    navigation.setOptions({
      headerShown: true,
      title: `${profile.firstname} ${profile.lastname}`,
      headerLeft: () => (
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
          </Pressable>
          <Image
            style={styles.avatar}
            source={
              profile.avatarurl
                ? { uri: profile.avatarurl }
                : require("../../../assets/Profile.png")
            }
            resizeMode="cover"
          />
        </View>
      ),
    });
  }, [navigation, user_id, mode]);

  useEffect(() => {
    const chatMessages = messages.filter(
      (message) =>
        message.sender_id === user_id || message.receiver_id === user_id
    );
    setMessageList(chatMessages);
  }, [messages]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    messageContainer: {
      width: "100%",
      height: height * 0.85,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginHorizontal: 10,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        {messageList?.length > 0 ? (
          <MessageList messages={messageList} />
        ) : (
          <Text>No Messages</Text>
        )}
      </View>

      <CreateMessage receiver_id={user_id} />
    </View>
  );
}
