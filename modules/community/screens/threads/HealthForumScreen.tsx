import { StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";
import { Forum, Thread } from "../../../../utils/Types";
import { useEffect, useState } from "react";
<<<<<<<< HEAD:modules/community/screens/forum/HealthForumScreen.tsx
import ThreadList from "../../components/forum/ThreadList";
========
import ThreadList from "../../components/threads/ThreadList";
>>>>>>>> main:modules/community/screens/threads/HealthForumScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunityStackRoutes } from "../../../navigation/Routes";
import FloatingButton from "../../../shared/components/FloatingButton";
import {
  useForumStore,
  useThreadStore,
} from "../../../../store/CommunityStore";

const forumName = "Health";
export default function HealthForumScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackRoutes>>();
  const { forums } = useForumStore();
  const forum = forums?.find((forum: Forum) => forum.name === forumName);
  const { threads } = useThreadStore();
  const [healthThreads, setHealthThreads] = useState<Thread[]>([]);

  useEffect(() => {
    if (threads) {
      setHealthThreads(
        threads.filter((thread) => thread.forum_id === forum?.forum_id)
      );
    }
  }, []);

  function handleCreateThread() {
    if (forum?.forum_id)
      navigation.navigate("CreateThread", { forum_id: forum?.forum_id });
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    totalThreads: {
      paddingVertical: 10,
      fontSize: 20,
      fontWeight: "bold",
    },
    text: {
      fontSize: 20,
      fontWeight: "bold",
    },
    noThreadsContainer: {
      flex: 1,
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.totalThreads}>
        Total Threads: {healthThreads?.length}
      </Text>
      {threads?.length !== 0 ? (
        <ThreadList threads={healthThreads || []} />
      ) : (
        <View style={styles.noThreadsContainer}>
          <Text style={styles.text}>No threads</Text>
        </View>
      )}
      <FloatingButton
        icon={"add-circle-outline"}
        onPress={handleCreateThread}
      />
    </View>
  );
}
