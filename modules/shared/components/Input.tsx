import { View, TextInput, StyleSheet, Platform } from "react-native";
import { Text } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import { useState } from "react";

function Input({
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isValid,
  placeholder,
  icon,
  multiLine,
  inputStyle,
  containerStyle,
  disabled,
  popup = true,
  charLimit,
}: any) {
  const { theme } = useTheme();
  const isWeb = Platform.OS === "web";
  const [height, setHeight] = useState(50);

  const styles = StyleSheet.create({
    inputContainer: {
      marginVertical: 12,
      paddingVertical: 0,
      paddingHorizontal: 4,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: theme.colors.primary,
      flexDirection: "column",
      // alignSelf: "center",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      width: "90%",
      height: multiLine && isWeb ? height : undefined,
      maxHeight: multiLine && isWeb ? 500 : undefined,
    },
    labelInvalid: {
      color: "red",
    },
    label: {
      marginHorizontal: 12,
    },
    input: {
      paddingVertical: 8,
      paddingHorizontal: 6,
      borderRadius: 4,
      fontSize: 16,
      color: isValid ? theme.colors.black : "red",
      flex: 1,
      width: "100%",
      height: multiLine && isWeb ? height : undefined,
    },
    icon: {
      paddingHorizontal: 12,
      color: isValid ? theme.colors.primary : "red",
    },
    charLimitContainer: {
      alignItems: "flex-end",
      justifyContent: "flex-end",
    },
  });
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {icon ? <Ionicons style={styles.icon} name={icon} size={24} /> : null}
      {value && popup ? (
        <Text style={[!isValid && styles.labelInvalid, styles.label]}>
          {placeholder}
        </Text>
      ) : null}
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
        onContentSizeChange={(event) => {
          if (multiLine && isWeb) {
            setHeight(event.nativeEvent.contentSize.height);
          }
        }}
      />
      {charLimit && (
        <View style={styles.charLimitContainer}>
          <Text>
            {value.length}/{charLimit}
          </Text>
        </View>
      )}
    </View>
  );
}

export default Input;
