import { useCallback } from "react";
import { MealNutrition } from "../../../../utils/Types";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import NutritionalListItem from "./NutritionalListItem";

export default function NutrionalList({
  mealNutrition,
}: {
  mealNutrition: MealNutrition;
}) {
  const nutritionArray = Object.entries(mealNutrition).map(([key, value]) => ({
    key,
    value,
  }));

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<{ key: string; value: number }>) => (
      <NutritionalListItem key={item.key} item={item} />
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
    },
  });
  return (
    <FlatList
      horizontal={true}
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={nutritionArray}
      renderItem={renderItem}
      keyExtractor={(item) => item.key + item.value.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
