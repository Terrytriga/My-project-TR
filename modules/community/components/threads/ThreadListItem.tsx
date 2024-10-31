import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import TouchableScale from "react-native-touchable-scale";
import { Thread } from "../../../../utils/Types";
import { useTheme } from "@rneui/themed";
import { Text } from "@rneui/themed";
import { ThreadStackRoutes } from "../../../navigation/Routes";
import { formatDate } from "../../../../utils/FormatDate";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { supabase } from "../../../../lib/SupaBase";
import { useUserStore } from "../../../../store/UserStore";

const { width } = Dimensions.get("window");
const aspect = 12 / 9;

interface ThreadListItemProps {
  thread: Thread;
}

export default function ThreadListItem({ thread }: ThreadListItemProps) {
  const { theme } = useTheme();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<ThreadStackRoutes>>();

  async function handleLike() {
    setIsLoading(true);
    const { error: likeError } = await supabase
      .from("threadlike")
      .insert([{ thread_id: thread.id, user_id: user?.id }]);
    if (likeError) {
      const { error: deleteLikeError } = await supabase
        .from("threadlike")
        .delete()
        .eq("thread_id", thread.id)
        .eq("user_id", user?.id);

      if (deleteLikeError) {
        ThreadAlert("Error", deleteLikeError.message);
        setIsLoading(false);
        return;
      }
      //Real-time Sub updates the store on App.tsx
      const { error: decreaseError } = await supabase
        .from("thread")
        .update({ likes: thread.likes - 1 })
        .eq("id", thread.id);
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
      .from("thread")
      .update({ likes: thread.likes + 1 })
      .eq("id", thread.id);
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
      flexDirection: "column",
      alignItems: "center",
      alignSelf: "center",
      justifyContent: "space-between",
      width: Platform.OS === "web" ? "50%" : "100%",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 10,
    },
    contentContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    textContainer: {
      width: "50%",
      padding: 10,
    },
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "50%",
    },
    bodyContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
    subject: {
      fontSize: 15,
      marginBottom: 10,
    },
    author: {
      fontSize: 14,
      fontFamily: "Playball",
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
    },
    date: {
      fontSize: 10,
    },
    image: {
      width: Platform.OS !== "web" ? width / 2 : width / 6,
      height: Platform.OS !== "web" ? width / 2 / aspect : width / 6 / aspect,
      borderRadius: 10,
    },
    icon: {
      marginRight: 5,
    },
    toolContainer: {
      width: "90%",
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 10,
      marginVertical: 5,
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
    <TouchableScale
      friction={90}
      tension={100}
      activeScale={0.85}
      onPress={() =>
        navigation.navigate("ViewThread", {
          id: thread.id,
        })
      }
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{thread.title}</Text>
          <Text style={styles.subject}>{thread.subject}</Text>
          <Text style={styles.author}>
            {thread.authorname} {thread.authorsurname}
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: thread.pictureurl }} />
        </View>
      </View>
      <View style={styles.toolContainer}>
        <Pressable
          disabled={isLoading}
          style={({ pressed }) => [pressed && styles.pressed, styles.toolItem]}
          onPress={async () => handleLike()}
        >
          <Text>{thread.likes}</Text>
          <Ionicons
            style={styles.toolIcon}
            name="heart"
            size={24}
            color="red"
          />
        </Pressable>
        <View style={styles.dateContainer}>
          <Ionicons
            style={styles.icon}
            name="ellipse-sharp"
            size={16}
            color={theme.colors.primary}
          />
          <Text style={styles.date}>
            {formatDate(new Date(thread.datecreated))}
          </Text>
        </View>
      </View>
    </TouchableScale>
  );
}
