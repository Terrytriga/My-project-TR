import { useCallback } from "react";
import { Professional, ProfessionalProfile } from "../../../utils/Types";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { useUserStore } from "../../../store/UserStore";
import ApproveListItem from "./ApproveListItem";

export default function ApproveList({
  professionalProfiles,
  type,
}: {
  professionalProfiles: ProfessionalProfile[];
  type: string;
}) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ProfessionalProfile>) => (
      <ApproveListItem professionalProfile={item} type={type} />
    ),
    []
  );

  const styles = StyleSheet.create({
    container: {
      marginVertical: 20,
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
      data={professionalProfiles}
      renderItem={renderItem}
      keyExtractor={(profile) => profile.user_id!}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
