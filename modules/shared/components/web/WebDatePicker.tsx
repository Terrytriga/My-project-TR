import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./WebDatePickerStyle.css";

export default function WebDatePicker({
  icon = "calendar-outline",
  containerStyle,
  date,
  onChange,
  inputType,
  enableTimeSelect = false,
}: any) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    inputContainer: {
      justifyContent: "flex-start",
      alignItems: "center",
      width: "100%",
    },
    icon: {
      paddingHorizontal: 12,
      color: theme.colors.primary,
    },
  });

  function handleChange(date: Date) {
    if (inputType) {
      onChange(inputType, date);
    } else {
      onChange(date);
    }
  }

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      <DatePicker
        selected={date}
        onChange={(selectedDate) => {
          const date = selectedDate as Date;
          handleChange(date);
        }}
        dateFormat={enableTimeSelect ? "h:mm aa" : "dd MMMM yyyy"}
        showYearDropdown={!enableTimeSelect}
        showTimeSelect={enableTimeSelect}
        showTimeSelectOnly={enableTimeSelect}
        popperPlacement="bottom-start"
        customInput={<CustomInput icon={icon} time={enableTimeSelect} />}
        portalId="root-portal"
      />
    </View>
  );
}

const CustomInput = React.forwardRef(
  ({ value, onClick, icon, time }: any, ref: any) => {
    const { theme } = useTheme();
    const styles = StyleSheet.create({
      customInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: 5,
        paddingVertical: 20,
        paddingHorizontal: 12,
        width: 378,
        marginVertical: 5,
      },
      customInput: {
        fontSize: 16,
        marginLeft: 8,
        color: theme.colors.black,
        flex: 1,
      },
      icon: {
        marginRight: 15,
        marginLeft: 5,
      },
    });
    return (
      <TouchableOpacity onPress={onClick} style={styles.customInputContainer}>
        {icon && !time ? (
          <Ionicons
            style={styles.icon}
            name={icon}
            size={24}
            color={theme.colors.primary}
          />
        ) : (
          <Ionicons
            name="time-outline"
            style={styles.icon}
            size={24}
            color={theme.colors.primary}
          />
        )}
        <TextInput
          style={styles.customInput}
          value={value}
          editable={false}
          ref={ref}
        />
      </TouchableOpacity>
    );
  }
);
