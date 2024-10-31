import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../../../shared/components/Button";
import { useState } from "react";
import Input from "../../../shared/components/Input";
import { useUserStore } from "../../../../store/UserStore";
import { supabase } from "../../../../lib/SupaBase";
import { useTheme } from "@rneui/themed";
import IconButton from "../../../shared/components/IconButton";
import { usePostStore } from "../../../../store/CommunityStore";

const { height } = Dimensions.get("window");
export default function CreatePost({ id }: { id: number | null | undefined }) {
  const [isLoading, setIsLoading] = useState(false);

  const { addPost } = usePostStore();

  const { user } = useUserStore();
  const { theme } = useTheme();
  const [inputs, setInputs] = useState({
    id: {
      value: id,
    },
    author_id: {
      value: user?.id,
    },
    post: {
      value: "",
      isValid: true,
    },
    datecreated: new Date(),
  });

  function handleInputChange(inputName: string, value: string) {
    setInputs((previousInputs) => ({
      ...previousInputs,
      [inputName]: {
        value: value,
        isValid: true,
      },
    }));
  }
  async function handleSubmit() {
    const validate = (data: any) => {
      const postIsValid = (title: string) => {
        return title.length > 0;
      };
      if (postIsValid(data.post.value)) {
        return true;
      }
      if (!postIsValid(data.post.value)) {
        setInputs((currentInputs) => {
          return {
            ...currentInputs,
            post: { value: data.title, isValid: false },
          };
        });
        ThreadAlert(
          "Invalid post.",
          "Please ensure post is greater than 0 characters."
        );
      }
      return false;
    };

    if (validate(inputs)) {
      await handleCreatePost();
    }
  }

  async function handleCreatePost() {
    setIsLoading(true);
    if (!user || !id || !user.id) {
      return;
    }
    const { data: postData, error: postError } = await supabase
      .from("post")
      .insert([
        {
          author_id: user.id,
          authorname: user.firstname,
          authorsurname: user.lastname,
          post: inputs.post.value,
          datecreated: inputs.datecreated,
          thread_id: id,
        },
      ])
      .select("*")
      .single();

    if (postError) {
      ThreadAlert("Error", postError.message);
      setIsLoading(false);
      return;
    }

    setInputs((previousInputs) => {
      return {
        ...previousInputs,
        post: {
          value: "",
          isValid: true,
        },
      };
    });
    addPost(postData);
    setIsLoading(false);
    return;
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: height / 10,
      width: Platform.OS !== "web" ? "100%" : "50%",
      paddingHorizontal: 10,
    },
    inputContainer: {
      width: "90%",
    },
  });

  return (
    <View style={styles.container}>
      <Input
        onUpdateValue={(value: any) => handleInputChange("post", value)}
        value={inputs.post.value}
        isValid={inputs.post.isValid}
        placeholder={"Reply to Thread"}
        multiLine={true}
        containerStyle={styles.inputContainer}
        popup={false}
      />
      <IconButton disabled={isLoading} onPress={handleSubmit} />
    </View>
  );
}
