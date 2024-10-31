import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

export default function Input({
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
  placeholder,
  icon,
  inputStyle,
}: any) {
  const styles = StyleSheet.create({
    inputContainer: {
      marginVertical: 12,
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderWidth: 1,
      borderRadius: 5,
      flexDirection: "row",
      alignSelf: "center",
      justifyContent: "flex-start",
      alignItems: "center",
      width: "90%",
    },
    labelInvalid: {
      color: "red",
    },
    input: {
      paddingVertical: 8,
      paddingHorizontal: 6,
      height: height / 4,
      borderRadius: 4,
      fontSize: 16,
      color: "#E70696",
      flex: 1,
    },
    icon: {
      paddingHorizontal: 12,
      color: !isInvalid ? "white" : "#E70696",
    },
  });

  return (
    <View style={styles.inputContainer}>
      <Ionicons
        style={styles.icon}
        name={icon}
        size={24}
        // color={theme.colors.black}
      />
      <TextInput
        multiline={true}
        style={[styles.input, inputStyle]}
        placeholderTextColor="white"
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
        placeholder={placeholder}
      />
    </View>
  );
}
