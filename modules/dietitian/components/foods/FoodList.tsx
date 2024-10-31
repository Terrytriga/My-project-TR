import { useCallback, useEffect, useState } from "react";
import { Food } from "../../../../utils/Types";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MealPlanStackRoutes } from "../../../navigation/Routes";
import { useFoodStore } from "../../../../store/MealStore";
import FoodListItem from "./FoodListItem";

interface FoodListProps {
  foodList: Food[] | undefined;
}

export default function FoodList({ foodList }: FoodListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Food>) => <FoodListItem food={item} />,
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
