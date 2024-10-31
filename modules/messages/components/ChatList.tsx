import { useCallback, useEffect, useState } from "react";
import { Chat } from "../../../utils/Types";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import ChatItem from "./ChatItem";
import { useUserStore } from "../../../store/UserStore";

export default function ChatList({ chats }: { chats: Chat[] }) {
  const { user } = useUserStore();
  const [chatList, setChatList] = useState<Chat[]>([]);
  useEffect(() => {
    setChatList(chats.filter((chat) => chat.user_id !== user?.id));
  }, chats);
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Chat>) => <ChatItem {...item} />,
    []
  );

  const styles = StyleSheet.create({
    container: {
      marginVertical: 20,
      width: "100%",
    },
    contentStyle: {
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 5,
    },
  });
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={chatList}
      renderItem={renderItem}
      keyExtractor={(chat) => chat.user_id}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
