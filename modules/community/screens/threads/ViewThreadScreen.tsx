import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "@rneui/themed";
import { useEffect, useLayoutEffect, useState } from "react";
import { supabase } from "../../../../lib/SupaBase";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Post } from "../../../../utils/Types";
import CreatePost from "../../components/threads/CreatePost";
import { usePostStore, useThreadStore } from "../../../../store/CommunityStore";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../../../store/UserStore";
import { useTheme } from "@rneui/themed";
import { ThreadStackRoutes } from "../../../navigation/Routes";
import PostItem from "../../components/threads/PostItem";

const { width, height } = Dimensions.get("window");
const aspect = width / height;

export default function ViewThreadScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { threads } = useThreadStore();
  const [isLoading, setIsLoading] = useState(false);
  const [threadPosts, setThreadPosts] = useState<Post[]>([]);
  const { posts } = usePostStore();
  const route = useRoute<RouteProp<ThreadStackRoutes, "ViewThread">>();
  const id = route.params?.id;
  const thread = threads?.find((thread) => thread.id === id);
  if (!thread) return;
  const communityStackNavigation =
    useNavigation<NativeStackNavigationProp<ThreadStackRoutes>>();

  useLayoutEffect(() => {
    if (!thread) return;

    communityStackNavigation.setOptions({
      headerShown: true,
      title: thread.title,
      headerRight: () => {
        return user!.id === thread.author_id ? (
          <View style={styles.iconRow}>
            <Pressable
              style={({ pressed }) => [
                pressed && styles.pressed,
                styles.iconPressable,
              ]}
              onPress={handleConfirmLockThread}
            >
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color={theme.colors.primary}
              />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.iconPressable,
                pressed && styles.pressed,
              ]}
              onPress={handleConfirmDeleteThread}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
        ) : null;
      },
    });
  }, [thread]);

  function handleConfirmDeleteThread() {
    Alert.alert(
      "Delete Thread",
      "Are you sure you want to delete this thread?",
      [
        {
          text: "Yes",
          onPress: handleDeleteThread,
          style: "destructive",
        },
        {
          text: "No",
          style: "default",
        },
      ]
    );
  }

  function handleConfirmLockThread() {
    if (!thread) return;
    Alert.alert(
      !thread.locked ? "Lock Thread" : "Unlock Thread",
      `Are you sure you want to ${
        !thread.locked ? "lock" : "unlock"
      } this thread?`,
      [
        {
          text: "Yes",
          onPress: handleLockThread,
          style: "destructive",
        },
        {
          text: "No",
          style: "default",
        },
      ]
    );
  }

  async function handleLockThread() {
    if (!thread) return;
    const { error } = await supabase
      .from("thread")
      .update({ locked: !thread.locked })
      .eq("thread_id", thread.id);
    if (error) {
      console.error(error);
      Alert.alert("Lock Failed", "Thread couldn't lock", [
        {
          text: "Okay",
          style: "default",
        },
      ]);
      return;
    }
    communityStackNavigation.goBack();
  }

  function cleanString(input: string) {
    let cleaned = input.replace(/\s+/g, "_");
    cleaned = cleaned.replace(/[.,\/#!$%\^&\*;:{}=\-`~()?"'<>@+|\\]/g, "");
    return cleaned;
  }

  async function handleDeleteThread() {
    if (!thread || !user) return;
    const { error: postsToDeleteError } = await supabase
      .from("post")
      .delete()
      .eq("thread_id", thread.id);
    if (postsToDeleteError) {
      ThreadAlert("Error", postsToDeleteError.message);
      setIsLoading(false);
      return;
    }

    const { error: deleteThreadError } = await supabase
      .from("thread")
      .delete()
      .eq("id", thread.id);
    if (deleteThreadError) {
      console.error(deleteThreadError);
      ThreadAlert("Error", deleteThreadError.message);
      setIsLoading(false);
      return;
    }
    const { error: removeError } = await supabase.storage
      .from("Public")
      .remove([`Threads/${user.id}-${cleanString(thread.title)}`]);

    if (removeError) {
      ThreadAlert("Error", removeError.message);
      setIsLoading(false);
      return;
    }
    communityStackNavigation.goBack();
    return;
  }

  useEffect(() => {
    if (!thread) return;
    if (thread.id) {
      setThreadPosts(posts.filter((post) => post.thread_id === thread.id));
    }
  }, [thread, posts]);

  const ThreadAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      flex: 1,
      width: height * aspect,
      height: width,
      justifyContent: "flex-start",
    },
    header: {
      marginVertical: 10,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.primary,
      paddingVertical: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    subject: {
      fontSize: 18,
      fontWeight: "normal",
    },
    iconRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      width: 100,
    },
    iconPressable: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      marginHorizontal: 5,
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollView: {
      flex: 1,
      width: "100%",
    },
    scrollContent: {
      paddingTop: 250,
      alignItems: isWeb ? "center" : undefined,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      minHeight: !isWeb ? 300 : 600,
    },
    section: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    createPostContainer: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
      width: "100%",
    },
    pressed: {
      opacity: 0.5,
    },
  });

  const webStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: width * 0.9,
      height: (width * 0.9) / aspect,
    },
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      backgroundColor: theme.colors.primary,
      padding: 10,
      marginBottom: 25,
    },
    header: {
      marginVertical: 10,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.primary,
      paddingVertical: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    subject: {
      fontSize: 18,
      fontWeight: "normal",
    },
    iconRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      width: 100,
    },
    iconPressable: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      marginHorizontal: 5,
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollView: {
      width: "100%",
    },
    scrollContent: {
      alignItems: "center",
    },
    contentContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      minHeight: !isWeb ? 300 : 600,
    },
    section: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    createPostContainer: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
      width: "100%",
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return !isWeb ? (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="cover"
        style={styles.image}
        source={
          thread.pictureurl
            ? { uri: thread.pictureurl }
            : require("../../../../assets/Meal.png")
        }
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          automaticallyAdjustKeyboardInsets={true}
        >
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>{thread.title}</Text>
              <Text style={styles.subject}>{thread.subject}</Text>
            </View>
            {threadPosts.length !== 0 ? (
              threadPosts.map((post) => <PostItem key={post.id} post={post} />)
            ) : (
              <View style={styles.section}>
                <Text>No posts</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
      {!thread.locked && (
        <View style={styles.createPostContainer}>
          <CreatePost id={thread.id} />
        </View>
      )}
    </View>
  ) : (
    <View style={webStyles.container}>
      <ScrollView
        style={webStyles.scrollView}
        contentContainerStyle={webStyles.scrollContent}
        automaticallyAdjustKeyboardInsets={true}
      >
        <View style={webStyles.imageContainer}>
          <Image
            style={webStyles.image}
            source={
              thread.pictureurl
                ? { uri: thread.pictureurl }
                : require("../../../../assets/Meal.png")
            }
          />
        </View>
        <View style={webStyles.contentContainer}>
          <View style={webStyles.header}>
            <Text style={webStyles.title}>{thread.title}</Text>
            <Text style={webStyles.subject}>{thread.subject}</Text>
          </View>
          {threadPosts.length !== 0 ? (
            threadPosts.map((post) => <PostItem key={post.id} post={post} />)
          ) : (
            <View style={webStyles.section}>
              <Text>No posts</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={webStyles.createPostContainer}>
        <CreatePost id={thread.id} />
      </View>
    </View>
  );
}
