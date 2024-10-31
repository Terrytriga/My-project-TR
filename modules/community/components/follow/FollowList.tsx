import { useCallback, useEffect, useState } from "react";
import { Profile } from "../../../../utils/Types";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "@rneui/themed";
import FollowItem from "./FollowItem";
import { useUserStore } from "../../../../store/UserStore";

interface FollowListProps {
  profiles: Profile[];
}

export default function FollowList({ profiles }: FollowListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Profile>) => <FollowItem {...item} />,
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
      data={profiles}
      style={styles.container}
      contentContainerStyle={styles.contentStyle}
      renderItem={renderItem}
      keyExtractor={(profile, index) => index.toString()}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
