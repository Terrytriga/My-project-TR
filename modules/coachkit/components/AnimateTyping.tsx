import { Text, useTheme } from "@rneui/themed";
import { useRef, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Markdown from "react-native-markdown-display";

export default function AnimateTyping(props: any) {
  const { theme } = useTheme();
  const [text, setText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [timeouts, setTimeouts] = useState<{
    typingTimeout: NodeJS.Timeout | null;
    firstNewLineTimeout: NodeJS.Timeout | null;
    secondNewLineTimeout: NodeJS.Timeout | null;
  }>({
    typingTimeout: null,
    firstNewLineTimeout: null,
    secondNewLineTimeout: null,
  });

  let textRef = useRef(text);
  textRef.current = text;

  let messageIndexRef = useRef(messageIndex);
  messageIndexRef.current = messageIndex;

  let textIndexRef = useRef(textIndex);
  textIndexRef.current = textIndex;

  let timeoutsRef = useRef(timeouts);
  timeoutsRef.current = timeouts;

  const typingAnimation = () => {
    if (textIndexRef.current < props.text[messageIndexRef.current].length) {
      setText(
        textRef.current +
          props.text[messageIndexRef.current].charAt(textIndexRef.current)
      );
      setTextIndex(textIndexRef.current + 1);

      let updatedTimeouts = { ...timeoutsRef.current };
      updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 10);
      setTimeouts(updatedTimeouts);
    } else if (messageIndexRef.current + 1 < props.text.length) {
      setMessageIndex(messageIndexRef.current + 1);
      setTextIndex(0);

      let updatedTimeouts = { ...timeoutsRef.current };
      updatedTimeouts.firstNewLineTimeout = setTimeout(newLineAnimation, 30);
      updatedTimeouts.secondNewLineTimeout = setTimeout(newLineAnimation, 50);
      updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 70);
      setTimeouts(updatedTimeouts);
    } else {
      if (props.onComplete) {
        props.onComplete();
      }
    }
  };

  useEffect(() => {
    let updatedTimeouts = { ...timeoutsRef.current };
    updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 250);
    setTimeouts(updatedTimeouts);

    return () => {
      clearTimeout(timeoutsRef.current.typingTimeout as NodeJS.Timeout);
      clearTimeout(timeoutsRef.current.firstNewLineTimeout as NodeJS.Timeout);
      clearTimeout(timeoutsRef.current.secondNewLineTimeout as NodeJS.Timeout);
    };
  }, []);

  const newLineAnimation = () => {
    setText(textRef.current + "\n");
  };

  const styles = StyleSheet.create({
    container: {
      padding: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Markdown style={{ body: { color: theme.colors.black } }}>
        {text}
      </Markdown>
    </View>
  );
}
