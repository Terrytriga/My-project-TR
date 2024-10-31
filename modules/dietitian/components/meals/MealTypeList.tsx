import { useCallback } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { MealType, Tag } from "../../../../utils/Types";
import MealTypeListItem from "./MealTypeListItem";

interface MealTypeListProps {
  mealTypes: MealType[];
  selectedType: MealType;
  onPress: (tag: MealType) => void;
}

export default function MealTypeList({
  mealTypes,
  selectedType,
  onPress,
}: MealTypeListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MealType>) => {
      const isSelected = selectedType.mealtype_id === item.mealtype_id;
      return (
        <MealTypeListItem
          mealType={item}
          isSelected={isSelected}
          onPress={() => onPress(item)}
        />
      );
    },
    [mealTypes, selectedType]
  );

  const styles = StyleSheet.create({
    container: {
      marginVertical: 5,
      width: "100%",
      minHeight: 75,
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
      data={mealTypes}
      renderItem={renderItem}
      keyExtractor={(type) => type.mealtype_id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
