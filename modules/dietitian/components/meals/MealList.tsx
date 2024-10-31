import { useCallback } from "react";
import { Meal } from "../../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import MealListItem from "./MealListItem";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianMealStack } from "../../../navigation/Routes";

interface MealListProps {
  meals: Meal[];
}

export default function MealList({ meals }: MealListProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianMealStack>>();

  function navigationHandler(meal: Meal) {
    if (!meal || !meal.meal_id) return;
    navigation.navigate("ViewMeal", { meal_id: meal.meal_id });
  }

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Meal>) => (
      <MealListItem onPress={() => navigationHandler(item)} {...item} />
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
