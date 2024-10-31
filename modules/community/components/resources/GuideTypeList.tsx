import { useCallback } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import GuideTypeListItem from "./GuideTypeListItem";

interface GuideTypeListProps {
  guideTypes: string[];
  selectedType: string;
  onPress: (guideTypes: string) => void;
}

export default function GuideTypeList({
  guideTypes,
  selectedType,
  onPress,
}: GuideTypeListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<string>) => {
      const isSelected = selectedType === item;
      return (
        <GuideTypeListItem
          guideType={item}
          isSelected={isSelected}
          onPress={() => onPress(item)}
        />
      );
    },
    [guideTypes, selectedType]
  );

  const styles = StyleSheet.create({
    container: {
      marginVertical: 5,
      width: "100%",
      minHeight: 75,
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
      data={guideTypes}
      renderItem={renderItem}
      keyExtractor={(type) => type}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
