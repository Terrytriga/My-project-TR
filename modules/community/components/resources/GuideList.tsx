import { useCallback } from "react";
import { Guide } from "../../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import GuideListItem from "./GuideListItem";

interface GuideListProps {
  guideList: Guide[] | [];
  type: string;
}

export default function GuideList({ guideList, type }: GuideListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Guide>) => (
      <GuideListItem type={type} guide={item} />
    ),
    []
  );

  const styles = StyleSheet.create({
    container: {
      marginVertical: 5,
      width: "100%",
    },
    contentStyle: {
      justifyContent: "center",
      alignItems: "center",
      width: Platform.OS === "web" ? "100%" : undefined,
      marginHorizontal: 5,
    },
  });

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={guideList}
      renderItem={renderItem}
      keyExtractor={(guide) => guide.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
