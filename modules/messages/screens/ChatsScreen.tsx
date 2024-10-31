import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";
import { MessageStackRoutes } from "../../navigation/Routes";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTheme } from "@rneui/themed";
import FloatingButton from "../../shared/components/FloatingButton";
import { useMessageStore } from "../../../store/CommunityStore";
import { Chat, Message } from "../../../utils/Types";
import { useProfileStore } from "../../../store/UserStore";
import ChatList from "../components/ChatList";

export default function ChatsScreen() {
  const { theme } = useTheme();
  const { messages } = useMessageStore();
  const { profiles } = useProfileStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<MessageStackRoutes>>();
  const [chats, setChats] = useState<Chat[]>([]);

  function contactHandler() {
    navigation.navigate("SearchContact");
  }

  useEffect(() => {
    createChats();
  }, [messages, profiles]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
    });
  }, [navigation]);

  const getLastMessage = (userId: string): Message | undefined => {
    return messages
      .filter(
        (message) =>
          message.sender_id === userId || message.receiver_id === userId
      )
      .sort(
        (a, b) =>
          new Date(b.datecreated).getTime() - new Date(a.datecreated).getTime()
      )[0];
  };

  const getChatIds = (messages: Message[]): string[] => {
    const uniqueIds = new Set<string>();
    messages.forEach((message) => {
      uniqueIds.add(message.sender_id);
      uniqueIds.add(message.receiver_id);
    });
    return Array.from(uniqueIds);
  };

  const createChats = () => {
    if (!profiles) return;
    if (!messages) return;
    const chatIds = getChatIds(messages);
    const chatList: Chat[] = chatIds
      .map((id) => {
        const profile = profiles.find((p) => p.user_id === id);
        const lastMessage = getLastMessage(id);

        if (!profile || !lastMessage) {
          return null;
        }

        return {
          user_id: profile.user_id!,
          lastMessage: lastMessage.message,
          lastMessageTime: lastMessage.datecreated.toString(),
          firstname: profile.firstname,
          lastname: profile.lastname,
          avatarurl: profile.avatarurl,
        };
      })
      .filter((chat) => chat !== null) as Chat[];

    setChats(chatList);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return (
    <View style={styles.container}>
      {chats.length === 0 ? <Text>No Chats!</Text> : <ChatList chats={chats} />}
      <FloatingButton onPress={contactHandler} icon={"add-circle-outline"} />
    </View>
  );
}
