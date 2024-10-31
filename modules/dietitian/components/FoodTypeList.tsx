import { useCallback } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { FoodCategory } from "../../../utils/Types";
import FoodTypeListItem from "./FoodTypeListItem";

interface FoodTypeListProps {
  foodTypes: FoodCategory[];
  selectedType: FoodCategory;
  onPress: (foodType: FoodCategory) => void;
}

export default function FoodTypeList({
  foodTypes,
  selectedType,
  onPress,
}: FoodTypeListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FoodCategory>) => {
      const isSelected = selectedType.foodcategory_id === item.foodcategory_id;
      return (
        <FoodTypeListItem
          foodType={item}
          isSelected={isSelected}
          onPress={() => onPress(item)}
        />
      );
    },
    [foodTypes, selectedType]
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
      data={foodTypes}
      renderItem={renderItem}
      keyExtractor={(type) => type.foodcategory_id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
