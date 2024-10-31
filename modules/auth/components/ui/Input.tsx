import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";

function Input({
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isValid,
  placeholder,
  icon,
  containerStyle,
  inputStyle,
  disabled,
  multiLine = false,
}: any) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    inputContainer: {
      marginVertical: 12,
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderWidth: 1,
      borderColor: theme.colors.primary,
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
      backgroundColor: theme.colors.background,
      borderRadius: 4,
      fontSize: 16,
      color: isValid ? theme.colors.black : "red",
      flex: 1,
    },
    icon: {
      paddingHorizontal: 12,
      color: isValid ? theme.colors.primary : "red",
    },
  });
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {icon && <Ionicons style={styles.icon} name={icon} size={24} />}
      <TextInput
        editable={!disabled}
        style={[styles.input, inputStyle]}
        placeholderTextColor={theme.colors.black}
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
        placeholder={placeholder}
        multiline={multiLine}
      />
    </View>
  );
}

export default Input;
