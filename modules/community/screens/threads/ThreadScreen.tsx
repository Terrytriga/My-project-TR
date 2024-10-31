import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "@rneui/themed";
import { Tag, Thread } from "../../../../utils/Types";
import { useEffect, useLayoutEffect, useState } from "react";
import ThreadList from "../../components/threads/ThreadList";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThreadStackRoutes } from "../../../navigation/Routes";
import { useTagStore, useThreadStore } from "../../../../store/CommunityStore";
import CreateThreadButton from "../../components/threads/CreateThreadButton";
import Input from "../../../shared/components/Input";
import MultiTagList from "../../components/threads/MultiTagList";
import AddButton from "../../../shared/components/AddButton";

export default function ThreadScreen() {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ThreadStackRoutes>>();
  const { tags } = useTagStore();
  const { threads } = useThreadStore();
  const [threadList, setThreadList] = useState<Thread[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [tagList, setTagList] = useState<Tag[]>([]);

  function handleSelectTag(tag: Tag) {
    const exists = selectedTags.some((item) => item.id === tag.id);
    if (exists) {
      setSelectedTags(selectedTags.filter((item) => item.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  useEffect(() => {
    setTagList(tags.sort((a, b) => a.id - b.id));
    if (selectedTags.length === 0 && isStringEmpty(searchText)) {
      setThreadList(threads);
    }
    if (selectedTags.length > 0 && isStringEmpty(searchText)) {
      setThreadList(
        threads.filter((thread) =>
          selectedTags.some((tag) => thread.tag_id === tag.id)
        )
      );
    }
    if (searchText) {
      setThreadList(
        threads.filter((thread) =>
          thread.title.toLowerCase().includes(searchText.toLocaleLowerCase())
        )
      );
    }
  }, [selectedTags, searchText, threads]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      fontSize: 20,
      fontWeight: "bold",
    },
    noThreadsContainer: {
      flex: 1,
      justifyContent: "center",
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
      width: "75%",
      alignItems: "flex-start",
      paddingHorizontal: 15,
      alignSelf: "flex-start",
    },
  });

  return (
    <View style={styles.container}>
      <AddButton onPress={() => navigation.navigate("CreateThread")}>
        Thread
      </AddButton>
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
      <MultiTagList
        tags={tagList}
        selectedTags={selectedTags}
        onPress={(item) => handleSelectTag(item)}
      />
      {threads?.length !== 0 ? (
        <ThreadList threads={threadList} />
      ) : (
        <View style={styles.noThreadsContainer}>
          <Text style={styles.text}>No threads</Text>
        </View>
      )}
    </View>
  );
}

function isStringEmpty(string: string) {
  const trimmedString = string.trim();
  return trimmedString.length === 0;
}
