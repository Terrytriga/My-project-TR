import { useCallback, useEffect, useState } from "react";
import { Chat, Profile } from "../../../utils/Types";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { useUserStore } from "../../../store/UserStore";
import AllUserListItem from "./AllUserListItem";

export default function AllUserList({ profiles }: { profiles: Profile[] }) {
  const { user } = useUserStore();

  const [profileList, setProfileList] = useState<Profile[]>([]);

  useEffect(() => {
    setProfileList(profiles.filter((profile) => profile.user_id !== user?.id));
  }, [profiles]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Profile>) => <AllUserListItem {...item} />,
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
      data={profileList}
      renderItem={renderItem}
      keyExtractor={(profile) => profile.user_id!}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
