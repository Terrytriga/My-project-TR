import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import CreateMessage from "../components/CreateMessage";
import { supabase } from "../../../lib/SupaBase";
import { useLayoutEffect, useState } from "react";
import ResponseList from "../components/ResponseList";
import { useResponseStore } from "../../../store/CoackKitStore";
import { Text, useTheme } from "@rneui/themed";
import { useUserStore } from "../../../store/UserStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CoachKitStack } from "../../navigation/Routes";
import { Ionicons } from "@expo/vector-icons";
import TrackingButton from "../components/TrackingButton";
import { useTrackingStore } from "../../../store/TrackingStore";

export default function CoachKitScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { trackingSteps, trackingWater, trackingSleep } = useTrackingStore();

  const navigation = useNavigation<NativeStackNavigationProp<CoachKitStack>>();
  const { responses, addResponse, deleteResponse } = useResponseStore();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    message: {
      value: "",
      isValid: true,
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={styles.iconRow}>
            <TrackingButton
              disabled={isLoading}
              onPress={promptSleep}
              icon={"sleep"}
            />
            <TrackingButton
              disabled={isLoading}
              onPress={promptSteps}
              icon={"walk"}
            />
            <TrackingButton
              disabled={isLoading}
              onPress={promptWater}
              icon={"water"}
            />
            <Pressable
              style={({ pressed }) => [
                styles.iconPressable,
                pressed && styles.pressed,
              ]}
              onPress={confirmDeleteReponses}
              disabled={isLoading}
            >
              <Ionicons
                name="trash-outline"
                size={26}
                color={theme.colors.secondary}
              />
            </Pressable>
          </View>
        );
      },
    });
  }, [navigation]);

  function confirmDeleteReponses() {
    if (isWeb) deleteResponses();
    Alert.alert(
      "Delete Responses",
      "Are you sure you want to delete all responses?",
      [
        {
          text: "Cancel",
          style: "default",
        },
        {
          text: "Confirm",
          onPress: () => deleteResponses(),
          style: "destructive",
        },
      ]
    );
  }
  async function deleteResponses() {
    setIsLoading(true);
    if (!user) return;
    const { data, error } = await supabase
      .from("airesponse")
      .delete()
      .eq("user_id", user.id)
      .select("*");
    if (error) {
      CoachKitAlert("Error", error.message);
      return;
    }
    console.log(data);
    data.forEach((response) => {
      deleteResponse(response);
    });
    setIsLoading(false);
  }

  async function promptWater() {
    if (!user) return;
    setIsLoading(true);
    const trackingdata = trackingWater.map((data) => {
      return {
        fullname: `${user.firstname} ${user.lastname}`,
        date: data.datecreated,
        milliliters: data.bottles * 500,
      };
    });
    const { data, error } = await supabase.functions.invoke("trackingchatbot", {
      body: {
        tracking: "Water Tracking Analysis",
        trackingData: JSON.stringify(trackingdata),
      },
    });
    if (error) {
      setIsLoading(false);
      CoachKitAlert("Error", error.message);
      return;
    }
    const { data: reponseData, error: responseError } = await supabase
      .from("airesponse")
      .insert([
        {
          user_id: user?.id,
          message: "Water Tracking Analysis",
          response: data.answer.message.content,
          datecreated: new Date(),
        },
      ])
      .select("*")
      .single();
    if (responseError) {
      setIsLoading(false);
      CoachKitAlert("Error", responseError.message);
      return;
    }
    addResponse(reponseData);
    setInputs((previousInputs) => {
      return {
        ...previousInputs,
        message: {
          value: "",
          isValid: true,
        },
      };
    });
    setIsLoading(false);
  }
  async function promptSteps() {
    if (!user) return;
    setIsLoading(true);
    const trackingdata = trackingSteps.map((data) => {
      return {
        fullname: `${user.firstname} ${user.lastname}`,
        date: data.datecreated,
        steps: data.steps,
      };
    });
    const { data, error } = await supabase.functions.invoke("trackingchatbot", {
      body: {
        tracking: "Steps Tracking Analysis",
        trackingData: JSON.stringify(trackingdata),
      },
    });
    if (error) {
      setIsLoading(false);
      CoachKitAlert("Error", error.message);
      return;
    }
    const { data: reponseData, error: responseError } = await supabase
      .from("airesponse")
      .insert([
        {
          user_id: user?.id,
          message: "Steps Tracking Analysis",
          response: data.answer.message.content,
          datecreated: new Date(),
        },
      ])
      .select("*")
      .single();
    if (responseError) {
      setIsLoading(false);
      CoachKitAlert("Error", responseError.message);
      return;
    }
    addResponse(reponseData);
    setInputs((previousInputs) => {
      return {
        ...previousInputs,
        message: {
          value: "",
          isValid: true,
        },
      };
    });
    setIsLoading(false);
  }
  async function promptSleep() {
    if (!user) return;
    setIsLoading(true);
    const trackingdata = trackingSleep.map((data) => {
      return {
        fullname: `${user.firstname} ${user.lastname}`,
        date: data.datecreated,
        hours: data.hours,
      };
    });
    const { data, error } = await supabase.functions.invoke("trackingchatbot", {
      body: {
        tracking: "Sleep Tracking Analysis",
        trackingData: JSON.stringify(trackingdata),
      },
    });
    if (error) {
      setIsLoading(false);
      CoachKitAlert("Error", error.message);
      return;
    }
    const { data: reponseData, error: responseError } = await supabase
      .from("airesponse")
      .insert([
        {
          user_id: user?.id,
          message: "Sleep Tracking Analysis",
          response: data.answer.message.content,
          datecreated: new Date(),
        },
      ])
      .select("*")
      .single();
    if (responseError) {
      setIsLoading(false);
      CoachKitAlert("Error", responseError.message);
      return;
    }
    addResponse(reponseData);
    setInputs((previousInputs) => {
      return {
        ...previousInputs,
        message: {
          value: "",
          isValid: true,
        },
      };
    });
    setIsLoading(false);
  }

  async function promptCoachKit() {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase.functions.invoke("chatbot", {
      body: { message: inputs.message.value },
    });
    if (error) {
      setIsLoading(false);
      CoachKitAlert("Error", error.message);
      return;
    }
    const { data: reponseData, error: responseError } = await supabase
      .from("airesponse")
      .insert([
        {
          user_id: user?.id,
          message: inputs.message.value,
          response: data.answer.message.content,
          datecreated: new Date(),
        },
      ])
      .select("*")
      .single();
    if (responseError) {
      setIsLoading(false);
      CoachKitAlert("Error", responseError.message);
      return;
    }
    addResponse(reponseData);
    setInputs((previousInputs) => {
      return {
        ...previousInputs,
        message: {
          value: "",
          isValid: true,
        },
      };
    });
    setIsLoading(false);
  }

  function CoachKitAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "Okay", style: "default" }]);
  }

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
      const messageIsValid = (title: string) => {
        return title.length > 0;
      };
      if (messageIsValid(data.message.value)) {
        return true;
      }

      if (!messageIsValid(data.message.value)) {
        setInputs((currentInputs) => {
          return {
            ...currentInputs,
            message: { value: data.title, isValid: false },
          };
        });
        Alert.alert(
          "Invalid message.",
          "Please ensure message is greater than 0 characters.",
          [
            {
              text: "Okay",
              style: "default",
            },
          ]
        );
      }
    };

    if (validate(inputs)) {
      await promptCoachKit();
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: responses.length === 0 ? "center" : undefined,
      alignItems: "center",
    },
    iconRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      width: 100,
    },
    iconPressable: {
      borderRadius: 30,
      borderWidth: 1,
      borderColor: theme.colors.secondary,
      backgroundColor: theme.colors.primary,
      width: 60,
      height: 60,
      marginHorizontal: 5,
      justifyContent: "center",
      alignItems: "center",
      margin: 10,
    },
    scrollView: {
      minHeight: 75,
      maxHeight: 75,
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      {responses.length > 0 ? (
        <ResponseList responses={responses} />
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Ask CoachKit something!</Text>
        </View>
      )}
      <CreateMessage
        disabled={isLoading}
        onPress={handleSubmit}
        onUpdate={handleInputChange}
        inputs={inputs}
      />
    </View>
  );
}
