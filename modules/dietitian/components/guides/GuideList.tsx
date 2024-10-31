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
}

export default function GuideList({ guideList }: GuideListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Guide>) => <GuideListItem guide={item} />,
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
      marginHorizontal: 5,
      width: Platform.OS === "web" ? "100%" : undefined,
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
