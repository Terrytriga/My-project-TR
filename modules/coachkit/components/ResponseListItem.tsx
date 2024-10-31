import { Text, useTheme } from "@rneui/themed";
import { Dimensions, StyleSheet, View, Animated } from "react-native";
import { AiResponse, Message } from "../../../utils/Types";
import { formatDate, formatTime } from "../../../utils/FormatDate";
import { useUserStore } from "../../../store/UserStore";
import Markdown from "react-native-markdown-display";
import { useEffect, useRef, useState } from "react";
import AnimateTyping from "./AnimateTyping";

const { height, width } = Dimensions.get("window");

interface ResponseListItemProps {
  response: AiResponse;
  lastItem: boolean;
}

export default function ResponseListItem({
  response,
  lastItem,
}: ResponseListItemProps) {
  const { user } = useUserStore();
  const { theme } = useTheme();
  const [completed, setCompleted] = useState(false);
  const responseArray = response.response.trim().split("\n");
  const styles = StyleSheet.create({
    response: {
      maxWidth: width * 0.75,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      marginVertical: 15,
      marginHorizontal: 20,
      borderWidth: 2,
      borderRadius: 10,
      borderColor: completed ? theme.colors.secondary : theme.colors.senary,
      backgroundColor: theme.colors.primary,
      alignSelf: "flex-start",
    },
    message: {
      maxWidth: width * 0.75,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      marginVertical: 15,
      marginHorizontal: 20,
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: theme.colors.senary,
      alignSelf: "flex-end",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    content: {
      fontSize: 16,
    },
    date: {
      fontSize: 14,
      fontFamily: "Playball",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.secondary,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.background,
      elevation: 5,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      marginTop: 10,
    },
  });

  return (
    <>
      <View style={styles.message}>
        <Text style={styles.content}>{response.message}</Text>
        <Text style={styles.date}>
          {formatTime(new Date(response.datecreated))}
          {" - "}
          {formatDate(new Date(response.datecreated))}
        </Text>
      </View>
      <View style={styles.response}>
        {lastItem ? (
          <AnimateTyping
            text={responseArray}
            onComplete={() => setCompleted(true)}
          />
        ) : (
          <Markdown style={{ body: { color: theme.colors.black } }}>
            {response.response}
          </Markdown>
        )}
        <Text style={styles.date}>
          {formatTime(new Date(response.datecreated))}
          {" - "}
          {formatDate(new Date(response.datecreated))}
        </Text>
      </View>
    </>
  );
}
