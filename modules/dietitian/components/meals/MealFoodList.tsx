import { useCallback } from "react";
import { NewMealFood } from "../../../../utils/Types";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import MealFoodListItem from "./MealFoodListItem";

interface MealFoodListProps {
  mealFoods: NewMealFood[] | undefined;
}

export default function MealFoodList({ mealFoods }: MealFoodListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NewMealFood>) => (
      <MealFoodListItem mealFood={item} />
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
      marginHorizontal: 5,
      width: "100%",
    },
  });

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={mealFoods}
      renderItem={renderItem}
      keyExtractor={(mealFood, index) => index.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
