import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Text, useTheme } from "@rneui/themed";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { FollowStackRoutes } from "../../../navigation/Routes";
import { useProfileStore, useUserStore } from "../../../../store/UserStore";
import {
  useFollowStore,
  usePostStore,
  useThreadStore,
} from "../../../../store/CommunityStore";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import Button from "../../../shared/components/Button";
import { supabase } from "../../../../lib/SupaBase";

//If we wanted to view the profile of a user!
export default function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<FollowStackRoutes>>();
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUserStore();
  const { theme } = useTheme();
  const { profiles } = useProfileStore();
  const { threads: threadStore } = useThreadStore();
  const { posts: postStore } = usePostStore();
  const { follows } = useFollowStore();

  const route = useRoute<RouteProp<FollowStackRoutes, "Profile">>();
  const user_id = route.params.user_id;
  const profile = profiles.find((profile) => profile.user_id === user_id);

  useLayoutEffect(() => {
    if (!profile?.username) return;
    navigation.setOptions({
      title: profile.username,
      headerShown: true,
    });
  }, [navigation]);

  const threads = threadStore.filter(
    (thread) => thread.author_id === profile?.user_id
  ).length;
  const posts = postStore.filter(
    (post) => post.author_id === profile?.user_id
  ).length;
  const isFollowing = follows?.some(
    (follow) => follow.following_id === profile?.user_id
  );

  async function unfollowHandler() {
    if (!user || !profile) return;
    setIsLoading(true);
    const { error: unfollowError } = await supabase
      .from("follow")
      .delete()
      .eq("following_id", profile.user_id)
      .eq("follower_id", user.id);

    if (unfollowError) {
      setIsLoading(false);
      return;
    }

    const { error: updateFollowingError } = await supabase
      .from("profile")
      .update({
        totalfollowers:
          profile.totalfollowers === 0 ? 0 : profile.totalfollowers - 1,
      })
      .eq("user_id", profile.user_id);

    if (updateFollowingError) {
      setIsLoading(false);
      return;
    }
    const { error: updateFollowerData } = await supabase
      .from("profile")
      .update({
        totalfollowings:
          profile.totalfollowings === 0 ? 0 : profile.totalfollowings - 1,
      })
      .eq("user_id", user.id);

    if (updateFollowerData) {
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }

  async function followHandler() {
    if (!user || !profile) return;
    setIsLoading(true);
    const { error: followError } = await supabase.from("follow").insert([
      {
        following_id: profile.user_id,
        follower_id: user.id,
        datecreated: new Date(),
      },
    ]);

    if (followError) {
      setIsLoading(false);
      return;
    }

    const { error: updateFollowingError } = await supabase
      .from("profile")
      .update({ totalfollowers: profile.totalfollowers + 1 })
      .eq("user_id", profile.user_id);

    if (updateFollowingError) {
      setIsLoading(false);
      return;
    }
    const { error: updateFollowerError } = await supabase
      .from("profile")
      .update({ totalfollowings: profile.totalfollowings + 1 })
      .eq("user_id", user.id);

    if (updateFollowerError) {
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollViewContent: {
      alignItems: "center",
    },
    detailsSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "80%",
      paddingHorizontal: 10,
      marginVertical: 5,
    },
    details: {
      padding: 5,
      backgroundColor: theme.colors.senary,
      borderColor: theme.colors.secondary,
      borderWidth: 1,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      width: "40%",
      marginHorizontal: 5,
    },
    fullname: {
      fontSize: 20,
      fontWeight: "bold",
    },
    biography: {
      marginHorizontal: 10,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.fullname}>
          {profile?.firstname} {profile?.lastname}
        </Text>

        <View style={styles.detailsSection}>
          <View style={styles.details}>
            <Text>Follows: {profile?.totalfollowers}</Text>
          </View>
          <View style={styles.details}>
            <Text>Followings: {profile?.totalfollowings}</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.details}>
            <Text>Threads: {threads}</Text>
          </View>
          <View style={styles.details}>
            <Text>Posts: {posts}</Text>
          </View>
        </View>
        {profile?.biography && (
          <Text style={styles.biography}>{profile?.biography}</Text>
        )}
        {isFollowing ? (
          <Button onPress={unfollowHandler}>
            {" "}
            {isLoading ? (
              <ActivityIndicator color={theme.colors.senary} size={"small"} />
            ) : (
              "Unfollow"
            )}
          </Button>
        ) : (
          <Button onPress={followHandler}>
            {isLoading ? (
              <ActivityIndicator color={theme.colors.senary} size={"small"} />
            ) : (
              "Follow"
            )}
          </Button>
        )}
      </ScrollView>
    </View>
  );
}
