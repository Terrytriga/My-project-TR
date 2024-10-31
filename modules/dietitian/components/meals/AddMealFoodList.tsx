import { useCallback } from "react";
import { Food } from "../../../../utils/Types";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import AddMealFoodListItem from "./AddMealFoodListItem";

interface FoodListProps {
  foodList: Food[] | undefined;
}

export default function AddMealFoodList({ foodList }: FoodListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Food>) => <AddMealFoodListItem food={item} />,
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
    },
  });

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={foodList}
      renderItem={renderItem}
      keyExtractor={(food) => food.food_id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
