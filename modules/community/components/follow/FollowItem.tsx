import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Profile } from "../../../../utils/Types";
import { useTheme } from "@rneui/themed";
import { Text } from "@rneui/themed";
import Button from "../../../shared/components/Button";
import { useUserStore } from "../../../../store/UserStore";
import { supabase } from "../../../../lib/SupaBase";
import { useState } from "react";
import { useFollowStore } from "../../../../store/CommunityStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FollowStackRoutes } from "../../../navigation/Routes";

const { width, height } = Dimensions.get("window");

export default function FollowItem(profile: Profile) {
  const isWeb = Platform.OS === "web";
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { follows } = useFollowStore();

  const navigation =
    useNavigation<NativeStackNavigationProp<FollowStackRoutes>>();

  const isFollowing = follows?.some(
    (follow) => follow.following_id === profile.user_id
  );

  async function unfollowHandler() {
    if (!user) return;
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
    if (!user) return;
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
      width: Platform.OS !== "web" ? "95%" : 700,
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      marginVertical: 10,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      overflow: "hidden",
      minHeight: height / 5,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    contentContainer: {
      flexDirection: "column",
      alignItems: "center",
      width: "75%",
      marginVertical: 10,
    },
    followContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "75%",
      marginVertical: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    biographyContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "75%",
      maxHeight: 100,
      borderWidth: 1,
      borderColor: theme.colors.senary,
      borderRadius: 5,
    },
    buttonContainer: {
      justifyContent: "center",
      alignItems: "center",
      bottom: 0,
    },
    button: {
      elevation: 3,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "column" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={styles.image}
            source={
              profile.avatarurl
                ? { uri: profile.avatarurl }
                : require("../../../../assets/Profile.png")
            }
          />
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{profile.username}</Text>
            <Text>
              {profile.firstname ? profile.firstname : ""}{" "}
              {profile.lastname ? profile.lastname : ""}
            </Text>
            <View style={styles.followContainer}>
              <Text>Followers: {profile.totalfollowers}</Text>
              <Text>Following: {profile.totalfollowings} </Text>
            </View>
            <View style={styles.biographyContainer}>
              <ScrollView>
                <Text>{profile.biography ? profile.biography : ""}</Text>
              </ScrollView>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          {isFollowing ? (
            <Button style={styles.button} onPress={unfollowHandler}>
              {" "}
              {isLoading ? (
                <ActivityIndicator color={theme.colors.senary} size={"small"} />
              ) : (
                "Unfollow"
              )}
            </Button>
          ) : (
            <Button style={styles.button} onPress={followHandler}>
              {isLoading ? (
                <ActivityIndicator color={theme.colors.senary} size={"small"} />
              ) : (
                "Follow"
              )}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}
