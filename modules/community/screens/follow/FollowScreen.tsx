import { Text, useTheme } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import FollowList from "../../components/follow/FollowList";
import { useProfileStore, useUserStore } from "../../../../store/UserStore";
import { Profile } from "../../../../utils/Types";
import { useEffect, useState } from "react";
import Input from "../../../shared/components/Input";

export default function FollowScreen() {
  const { theme } = useTheme();
  const { profiles } = useProfileStore();
  const { user } = useUserStore();
  const [followList, setFollowList] = useState<Profile[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    if (searchText.length > 0) {
      setFollowList(
        profiles.filter((profile) => {
          const fullname = `${profile.firstname} ${profile.lastname}`;
          const username = profile.username;
          return (
            (profile.user_id !== user?.id &&
              username?.toLowerCase().includes(searchText.toLowerCase())) ||
            fullname.toLowerCase().includes(searchText.toLowerCase())
          );
        })
      );
    } else {
      setFollowList(profiles.filter((profile) => profile.user_id !== user?.id));
    }
  }, [profiles, searchText]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: followList.length === 0 ? "center" : undefined,
      alignItems: "center",
    },
    input: {
      flexDirection: "row",
      width: "100%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 25,
      borderColor: theme.colors.primary,
    },
    inputContainer: {
      marginTop: 5,
      width: "100%",
      alignItems: "flex-start",
      paddingHorizontal: 15,
      alignSelf: "flex-start",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          containerStyle={styles.input}
          placeholder={"Search..."}
          icon={"search-outline"}
          secure={false}
          keyboardType={"default"}
          value={searchText}
          onUpdateValue={(value: string) => setSearchText(value)}
          isValid={true}
          popup={false}
        />
      </View>
      {followList.length > 0 ? (
        <FollowList profiles={followList} />
      ) : (
        <Text>No profiles to follow yet.</Text>
      )}
    </View>
  );
}
