import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Button from "../../../shared/components/Button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThreadStackRoutes } from "../../../navigation/Routes";
import { useState } from "react";
import Input from "../../../shared/components/Input";
import { useUserStore } from "../../../../store/UserStore";
import { supabase } from "../../../../lib/SupaBase";
import { Text, useTheme } from "@rneui/themed";
import { Tag } from "../../../../utils/Types";
import { useTagStore, useThreadStore } from "../../../../store/CommunityStore";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import SingleTagList from "../../components/threads/SingleTagList";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";

export default function CreateThreadScreen() {
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { tags } = useTagStore();
  const { addThread } = useThreadStore();

  const navigation =
    useNavigation<NativeStackNavigationProp<ThreadStackRoutes>>();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag>(tags[0]);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [inputs, setInputs] = useState({
    title: {
      value: "",
      isValid: true,
    },
    subject: {
      value: "",
      isValid: true,
    },
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

  function cleanString(input: string) {
    let cleaned = input.replace(/\s+/g, "_");
    cleaned = cleaned.replace(/[.,\/#!$%\^&\*;:{}=\-`~()?"'<>@+|\\]/g, "");
    return cleaned;
  }

  const getPublicUrl = async (filePath: string) => {
    if (!filePath) return;
    const { data: publicUrlData } = supabase.storage
      .from("Public")
      .getPublicUrl(filePath);
    if (publicUrlData) {
      return publicUrlData.publicUrl;
    }
  };

  const uploadImage = async () => {
    if (!selectedImage || !user) return;
    const filePath = `Threads/${user.id}-${cleanString(inputs.title.value)}`;
    const base64 = selectedImage.base64;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Public")
      .upload(filePath, decode(base64!), {
        contentType: selectedImage.mimeType,
      });

    if (uploadError || !uploadData) {
      ThreadAlert("Error Uploading", uploadError.message);
      return;
    }

    return await getPublicUrl(uploadData.path);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      base64: true,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      if (result.assets[0].height < 1080 || result.assets[0].width < 1080) {
        ThreadAlert(
          "Warning",
          "For best quality, please select an image with a minimum resolution of 1080x1080."
        );
      }
      setSelectedImage(result.assets[0]);
    }
    return;
  };

  function handleConfirmCreateThread() {
    Alert.alert(
      "Create Thread",
      "Are you sure you want to create this thread?",
      [
        {
          text: "Cancel",
          style: "default",
        },
        {
          text: "Confirm",
          onPress: handleSubmit,
          style: "destructive",
        },
      ]
    );
  }
  async function handleSubmit() {
    const validate = (data: any) => {
      const titleIsValid = (title: string) => {
        return title.length > 0 && title.length <= 50;
      };
      const subjectIsValid = (subject: string) => {
        return subject.length > 0 && subject.length <= 200;
      };
      if (
        titleIsValid(data.title.value) &&
        subjectIsValid(data.subject.value)
      ) {
        return true;
      }

      if (!titleIsValid(data.title.value)) {
        setInputs((currentInputs) => {
          return {
            ...currentInputs,
            title: { value: data.title, isValid: false },
          };
        });
        ThreadAlert(
          "Invalid Title",
          "Please ensure title is greater than 0 and less than ."
        );
      }
      if (!subjectIsValid(data.subject.value)) {
        setInputs((currentInputs) => {
          return {
            ...currentInputs,
            subject: { value: data.subject, isValid: false },
          };
        });
        ThreadAlert(
          "Invalid Subject",
          "Please ensure subject is greater than 0 characters."
        );
      }
    };

    if (validate(inputs)) {
      await handleCreateThread();
    }
  }

  async function handleCreateThread() {
    setIsLoading(true);
    if (!user || !selectedTag.id || !user.id) return;

    const pictureurl = await uploadImage();
    if (!pictureurl) {
      setIsLoading(false);
      return;
    }
    const { data: addThreadData, error: addThreadError } = await supabase
      .from("thread")
      .insert([
        {
          tag_id: selectedTag.id,
          author_id: user.id,
          authorname: user.firstname,
          authorsurname: user.lastname,
          title: inputs.title.value,
          subject: inputs.subject.value,
          pictureurl: pictureurl,
        },
      ])
      .select("*")
      .single();

    if (addThreadError) {
      setIsLoading(false);
      ThreadAlert("Error", addThreadError.message);
      return;
    }

    const { data: tagData, error: tagError } = await supabase
      .from("tag")
      .select("totalthreads")
      .eq("id", selectedTag.id)
      .single();

    if (tagError) {
      setIsLoading(false);
      ThreadAlert("Error", tagError.message);
      return;
    }

    const { error: updateTagError } = await supabase
      .from("tag")
      .update({ totalthreads: tagData.totalthreads + 1 })
      .eq("id", selectedTag.id);

    if (updateTagError) {
      setIsLoading(false);
      ThreadAlert("Error", updateTagError.message);
      return;
    }
    addThread(addThreadData);
    setIsLoading(false);
    navigation.navigate("Threads");
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
      flex: 1,
      alignItems: "center",
      marginBottom: 20,
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    input: {
      flexDirection: "row",
      width: "90%",
      // height: 50,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 25,
      borderColor: theme.colors.primary,
    },
    inputContainer: {
      marginTop: 5,
      width: Platform.OS !== "web" ? "100%" : "25%",
      alignItems: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
    },
    titleContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    pressable: {
      paddingVertical: 20,
      alignItems: "center",
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Select a tag for the thread!</Text>
      </View>
      <SingleTagList
        tags={tags}
        selectedTag={selectedTag}
        onPress={(item) => setSelectedTag(item)}
      />
      <Pressable
        onPress={pickImage}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <Image
          source={
            selectedImage
              ? { uri: selectedImage.uri }
              : require("../../../../assets/Meal.png")
          }
          style={styles.image}
        />
      </Pressable>
      <View style={styles.inputContainer}>
        <Input
          containerStyle={styles.input}
          onUpdateValue={(value: any) => handleInputChange("title", value)}
          value={inputs.title.value}
          isValid={inputs.title.isValid}
          placeholder={"Title of Thread"}
          popup={false}
          keyboardType="default"
          icon={"newspaper-outline"}
          charLimit={50}
        />
        <Input
          containerStyle={styles.input}
          onUpdateValue={(value: any) => handleInputChange("subject", value)}
          value={inputs.subject.value}
          isValid={inputs.subject.isValid}
          placeholder={"Subject of Thread"}
          popup={false}
          keyboardType="default"
          multiLine={true}
          icon={"document-outline"}
          charLimit={200}
        />
      </View>
      <View style={{ flex: 1 }}></View>
      <Button onPress={handleConfirmCreateThread}>Save</Button>
    </View>
  );
}
