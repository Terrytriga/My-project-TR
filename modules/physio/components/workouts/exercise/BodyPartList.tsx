import { useCallback } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
} from "react-native";
import { BodyPart } from "../../../../../utils/Types";
import BodyPartListItem from "./BodyPartListItem";

interface BodyPartListProps {
  bodyparts: BodyPart[];
  selectedPart: BodyPart;
  onPress: (part: BodyPart) => void;
}

export default function BodyPartList({
  bodyparts,
  selectedPart,
  onPress,
}: BodyPartListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<BodyPart>) => {
      const isSelected = selectedPart.id === item.id;
      return (
        <BodyPartListItem
          bodypart={item}
          isSelected={isSelected}
          onPress={() => onPress(item)}
        />
      );
    },
    [bodyparts, selectedPart]
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
