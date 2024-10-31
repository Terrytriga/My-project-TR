import { useTheme } from "@rneui/themed";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";
import { Post } from "../../../../utils/Types";
import { formatDate, formatTime } from "../../../../utils/FormatDate";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../../lib/SupaBase";
import { usePostStore } from "../../../../store/CommunityStore";
import { useUserStore } from "../../../../store/UserStore";
import { useState } from "react";

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  const { theme } = useTheme();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLike() {
    setIsLoading(true);
    const { error: likeError } = await supabase
      .from("postlike")
      .insert([{ post_id: post.id, user_id: user?.id }]);
    if (likeError) {
      const { error: deleteLikeError } = await supabase
        .from("postlike")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user?.id);

      if (deleteLikeError) {
        ThreadAlert("Error", deleteLikeError.message);
        setIsLoading(false);
        return;
      }
      //Real-time Sub updates the store on App.tsx
      const { error: decreaseError } = await supabase
        .from("post")
        .update({ likes: post.likes - 1 })
        .eq("id", post.id);

      if (decreaseError) {
        ThreadAlert("Error", decreaseError.message);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      return;
    }
    //Real-time Sub updates the store on App.tsx
    const { error: increaseError } = await supabase
      .from("post")
      .update({ likes: post.likes + 1 })
      .eq("id", post.id);

    if (increaseError) {
      ThreadAlert("Error", increaseError.message);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  }

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
      backgroundColor: "transparent",
      width: "100%",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-between",
      padding: 20,
      margin: 2,
      marginVertical: 10,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    bodyContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginVertical: 10,
    },
    author: {
      fontSize: 16,
      fontWeight: "bold",
      // marginBottom: 10,
    },
    post: {
      fontSize: 14,
      marginVertical: 10,
    },
    date: {
      fontSize: 10,
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    icon: {
      marginRight: 5,
    },
    toolContainer: {
      width: "100%",
    },
    toolItem: {
      flexDirection: "row",
      // justifyContent: "center",
      alignItems: "center",
    },
    toolIcon: {
      marginHorizontal: 5,
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.author}>
        {post.authorname} {post.authorsurname}
      </Text>
      <View style={styles.bodyContainer}>
        <Text style={styles.post}>{post.post}</Text>
      </View>
      <View style={styles.dateContainer}>
        <Ionicons
          style={styles.icon}
          name="ellipse-sharp"
          size={16}
          color={theme.colors.primary}
        />
        <Text style={styles.date}>
          {formatTime(new Date(post.datecreated))}
          {", "}
          {formatDate(new Date(post.datecreated))}
        </Text>
      </View>
      <View style={styles.toolContainer}>
        <Pressable
          disabled={isLoading}
          style={({ pressed }) => [pressed && styles.pressed, styles.toolItem]}
          onPress={handleLike}
        >
          <Text>{post.likes}</Text>
          <Ionicons
            style={styles.toolIcon}
            name="heart"
            size={24}
            color="red"
          />
        </Pressable>
      </View>
    </View>
  );
}
