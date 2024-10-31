import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text, useTheme } from "@rneui/themed";
import StarRating from "react-native-star-rating-widget";
import Input from "../../shared/components/Input";
import { supabase } from "../../../lib/SupaBase";
import { useUserStore } from "../../../store/UserStore";
import Button from "../../shared/components/Button";

export default function FeedbackScreen() {
  const { theme } = useTheme();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    rating: {
      value: 0,
    },
    difficulty: {
      value: "",
      isValid: true,
    },
    liked: {
      value: "",
      isValid: true,
    },
  });

  function handleInputChange(inputName: any, valueEntered: any) {
    setInputs((previousInputs) => ({
      ...previousInputs,
      [inputName]: {
        value: valueEntered,
        isValid: true,
      },
    }));
  }

  async function handleSubmit() {
    const validate = () => {
      const difficultyIsValid = (difficulty: string) => {
        return difficulty.length > 0;
      };

      const likedIsValid = (liked: string) => {
        return liked.length > 0;
      };

      if (
        difficultyIsValid(inputs.difficulty.value) &&
        likedIsValid(inputs.liked.value)
      ) {
        return true;
      } else {
        if (!difficultyIsValid(inputs.difficulty.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              username: { value: inputs.difficulty.value, isValid: false },
            };
          });
          FeedbackAlert("Invalid name", "Please enter a name.");
        }
        if (!likedIsValid(inputs.liked.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              firstname: {
                value: inputs.liked.value,
                isValid: false,
              },
            };
          });
          FeedbackAlert("Invalid description", "Please enter a description.");
        }
        return false;
      }
    };

    if (validate()) {
      await addFeedback();
    }
    return false;
  }

  async function addFeedback() {
    if (!user) return;
    setIsLoading(true);

    const { error: feedbackError } = await supabase.from("feedback").insert([
      {
        user_id: user.id,
        rating: inputs.rating.value,
        difficulty: inputs.difficulty.value,
        liked: inputs.liked.value,
        datecreated: new Date(),
      },
    ]);

    if (feedbackError) {
      FeedbackAlert("Feedback Error", feedbackError.message);
      setIsLoading(false);
      return;
    }
    FeedbackAlert("Feedback Submitted", "Thank you for your feedback!");

    setInputs({
      rating: {
        value: 0,
      },
      difficulty: {
        value: "",
        isValid: true,
      },
      liked: {
        value: "",
        isValid: true,
      },
    });

    setIsLoading(false);
    return;
  }

  function ConfirmFeedback() {
    Alert.alert("Feedback Submitted", "Thank you for your feedback!", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Ok",
        style: "default",
        onPress: () => handleSubmit(),
      },
    ]);
  }

  function FeedbackAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "Ok",
        style: "default",
      },
    ]);
  }

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      paddingBottom: 20,
    },
    ratingContainer: {
      marginBottom: 20,
      alignItems: "center",
    },
    titleContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      backgroundColor: theme.colors.primary,
      width: "100%",
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    text: {
      fontSize: 16,
      marginBottom: 16,
    },
    inputContainer: {
      width: "100%",
      padding: 16,
      margin: 5,
    },
    input: {
      height: 150,
    },
    inputView: {
      height: 125,
    },
  });

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      automaticallyAdjustKeyboardInsets={true}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Thank you for taking part 😍 </Text>
        <Text style={styles.text}>
          Please complete this feedback form to help us improve future updates.
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <Text>
          1. Please describe any challenges you've encountered while using the
          app.
        </Text>
        <Input
          onUpdateValue={(value: any) => handleInputChange("difficulty", value)}
          isValid={inputs.difficulty.isValid}
          value={inputs.difficulty.value}
          inputStyle={styles.input}
          containerStyle={styles.inputView}
          multiLine={true}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>
          2. What aspects of the app do you find most valuable, and why?
        </Text>
        <Input
          onUpdateValue={(value: any) => handleInputChange("liked", value)}
          isValid={inputs.liked.isValid}
          value={inputs.liked.value}
          inputStyle={styles.input}
          containerStyle={styles.inputView}
          multiLine={true}
        />
      </View>
      <View style={[styles.inputContainer, styles.ratingContainer]}>
        <Text>3. Give us a rating!</Text>
        <StarRating
          rating={inputs.rating.value}
          onChange={(value: any) => handleInputChange("rating", value)}
          maxStars={5}
          starSize={32}
        />
      </View>

      <Button onPress={ConfirmFeedback}>
        {isLoading ? <ActivityIndicator /> : "Submit Feedback"}
      </Button>
    </ScrollView>
  );
}
