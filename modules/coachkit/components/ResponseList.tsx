import { useCallback, useEffect, useRef, useState } from "react";
import { AiResponse } from "../../../utils/Types";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import ResponseListItem from "./ResponseListItem";

interface ResponseListProps {
  responses: AiResponse[];
}

export default function ResponseList({ responses }: ResponseListProps) {
  const flatListRef = useRef<FlatList<AiResponse>>(null);
  const lastIndex = responses.length - 1;
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<AiResponse>) => {
      const lastItem = index === lastIndex;
      return <ResponseListItem response={item} lastItem={lastItem} />;
    },
    [responses, lastIndex]
  );

  useEffect(() => {
    if (responses.length === 0) return;
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [responses]);

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
      ref={flatListRef}
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={responses}
      renderItem={renderItem}
      keyExtractor={(response) => response.id.toString()}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={5}
      onContentSizeChange={() =>
        flatListRef.current?.scrollToEnd({ animated: true })
      }
      onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
    />
  );
}
