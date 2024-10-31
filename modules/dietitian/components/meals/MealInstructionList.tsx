import { useCallback } from "react";
import { NewMealInstruction } from "../../../../utils/Types";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import MealInstructionListItem from "./MealInstructionListItem";

interface MealListProps {
  mealInstructions: NewMealInstruction[];
}

export default function MealInstructionList({
  mealInstructions,
}: MealListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NewMealInstruction>) => (
      <MealInstructionListItem mealInstruction={item} />
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
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={mealInstructions}
      renderItem={renderItem}
      keyExtractor={(mealInstruction, index) => index.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
