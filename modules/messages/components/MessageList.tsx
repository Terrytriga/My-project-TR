import { useCallback, useEffect, useRef } from "react";
import { Message } from "../../../utils/Types";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import MessageItem from "./MessageItem";

export default function MessageList({ messages }: { messages: Message[] }) {
  const flatListRef = useRef<FlatList<Message>>(null);
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Message>) => <MessageItem {...item} />,
    []
  );

  useEffect(() => {
    if (messages.length === 0) return;
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const styles = StyleSheet.create({
    container: {
      width: "100%",
    },
    contentStyle: {
      marginHorizontal: 5,
    },
  });
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={messages}
      renderItem={renderItem}
      keyExtractor={(message) => message.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
      onContentSizeChange={() =>
        flatListRef.current?.scrollToEnd({ animated: true })
      }
      onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
    />
  );
}
