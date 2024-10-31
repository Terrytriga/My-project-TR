import { useCallback } from "react";
import { Thread } from "../../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import ThreadListItem from "./ThreadListItem";

interface ThreadListProps {
  threads: Thread[];
}

export default function ThreadList({ threads }: ThreadListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Thread>) => <ThreadListItem thread={item} />,
    [threads]
  );

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: 10,
      alignItems: "center",
    },
    list: {
      flex: 1,
    },
  });

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={threads}
      renderItem={renderItem}
      keyExtractor={(thread) => thread.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
      style={styles.list}
    />
  );
}
