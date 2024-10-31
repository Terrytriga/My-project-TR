import { useCallback } from "react";
import { TrackingMenstruation, TrackingToDo } from "../../../utils/Types";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import CycleListItem from "./CycleListItem";
import ToDoListItem from "./ToDoListItem";

interface ToDoListProps {
  toDos: TrackingToDo[];
  onPress: (cycle: TrackingToDo) => void;
}

export default function ToDoList({ toDos, onPress }: ToDoListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TrackingToDo>) => {
      return <ToDoListItem toDo={item} onPress={() => onPress(item)} />;
    },
    [toDos, toDos]
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
      data={toDos}
      renderItem={renderItem}
      keyExtractor={(toDo) => toDo.id.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
