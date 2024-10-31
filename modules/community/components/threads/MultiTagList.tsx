import { useCallback } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { Tag } from "../../../../utils/Types";
import TagListItem from "./TagListItem";

interface MultiTagListProps {
  tags: Tag[];
  selectedTags: Tag[];
  onPress: (tag: Tag) => void;
}

export default function MultiTagList({
  tags,
  selectedTags,
  onPress,
}: MultiTagListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Tag>) => {
      const isSelected = selectedTags.some((tag) => tag.id === item.id);
      return (
        <TagListItem
          tag={item}
          isSelected={isSelected}
          onPress={() => onPress(item)}
        />
      );
    },
    [tags, selectedTags]
  );

  const styles = StyleSheet.create({
    container: {
      marginVertical: 5,
      width: "100%",
      maxHeight: 75,
    },
    contentStyle: {
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 5,
    },
  });
  return (
    <FlatList
      horizontal={true}
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={tags}
      renderItem={renderItem}
      keyExtractor={(tag) => tag.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
