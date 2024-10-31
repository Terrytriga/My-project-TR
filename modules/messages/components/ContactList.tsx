import { useCallback, useEffect, useState } from "react";
import { Profile } from "../../../utils/Types";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import ContactItem from "./ContactItem";
import { useUserStore } from "../../../store/UserStore";

export default function ContactList({ contacts }: { contacts: Profile[] }) {
  const { user } = useUserStore();
  const [contactList, setContactList] = useState<Profile[]>([]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Profile>) => <ContactItem {...item} />,
    []
  );

  useEffect(() => {
    setContactList(contacts.filter((contact) => contact.user_id !== user?.id));
  }, [contacts]);
  const styles = StyleSheet.create({
    container: {
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
      data={contactList}
      renderItem={renderItem}
      keyExtractor={(profile) => profile.user_id!}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={10}
    />
  );
}
