import { useCallback, useEffect, useState } from "react";
import { Meal } from "../../../utils/Types";
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import { useUserStore } from "../../../store/UserStore";
import MealItem from "./MealItem";
import { supabase } from "../../../lib/SupaBase";
import { useMealPlanStore } from "../../../store/MealStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MealPlanStackRoutes } from "../../navigation/Routes";

export default function MealList({
  meals,
  date,
}: {
  meals: Meal[];
  date: Date | undefined;
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<MealPlanStackRoutes>>();

  function navigationHandler(meal: Meal) {
    if (!date || !meal) return;
    const dateStr = date.toString();
    navigation.navigate("Meal", { meal, date: dateStr });
  }

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Meal>) => (
      <MealItem onPress={() => navigationHandler(item)} {...item} />
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
      data={meals}
      renderItem={renderItem}
      keyExtractor={(meal) => meal.meal_id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
