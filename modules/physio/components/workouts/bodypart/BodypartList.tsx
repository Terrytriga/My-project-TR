import { useCallback } from "react";
import { BodyPart, Exercise } from "../../../../../utils/Types";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import ExerciseListItem from "../exercise/ExerciseListItem";
import BodypartListItem from "./BodypartListItem";

interface BodypartListProps {
  bodyparts: BodyPart[] | undefined;
}

export default function BodypartList({ bodyparts }: BodypartListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<BodyPart>) => (
      <BodypartListItem bodypart={item} />
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
      marginHorizontal: 5,
    },
  });

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      data={bodyparts}
      renderItem={renderItem}
      keyExtractor={(bodypart) => bodypart.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
