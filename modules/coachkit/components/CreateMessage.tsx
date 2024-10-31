import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Input from "../../shared/components/Input";
import { useState } from "react";
import { useUserStore } from "../../../store/UserStore";
import { useTheme } from "@rneui/themed";
import IconButton from "../../shared/components/IconButton";
import { supabase } from "../../../lib/SupaBase";

const { height } = Dimensions.get("window");

interface CoachkitProps {
  onUpdate: (inputName: string, value: string) => void;
  inputs: any;
  onPress: () => void;
  disabled: boolean;
}
export default function CreateMessage({
  onPress,
  onUpdate,
  inputs,
  disabled,
}: CoachkitProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: height / 10,
      width: Platform.OS !== "web" ? "100%" : "40%",
      paddingHorizontal: 10,
    },
    inputContainer: {
      width: "90%",
    },
  });

  return (
    <View style={styles.container}>
      <Input
        containerStyle={styles.inputContainer}
        onUpdateValue={(value: any) => onUpdate("message", value)}
        value={inputs.message.value}
        isValid={inputs.message.isValid}
        placeholder={"Message..."}
        multiLine={true}
        popup={false}
      />
      <Pressable onPress={onPress} disabled={disabled}>
        <IconButton />
      </Pressable>
    </View>
  );
}
