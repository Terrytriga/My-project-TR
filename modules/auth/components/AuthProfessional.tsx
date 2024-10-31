import { useTheme } from "@rneui/themed";
import { Platform, StyleSheet, View } from "react-native";
import Input from "./ui/Input";

export default function AuthProfessional({
  inputs,
  onUpdateValue,
}: {
  inputs: any;
  onUpdateValue: (inputType: string, value: any) => void;
}) {
  const { theme } = useTheme();
  const isWeb = Platform.OS === "web";
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    inputContainer: {
      marginVertical: 5,
      width: "100%",
    },
    input: {
      width: isWeb ? "40%" : "100%",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          isValid={inputs.qualification.isValid}
          keyboardType="default"
          placeholder={"Qualification"}
          value={inputs.qualification.value}
          onUpdateValue={(value: any) => onUpdateValue("qualification", value)}
          icon="newspaper-outline"
          containerStyle={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          isValid={inputs.yearsofexperience.isValid}
          keyboardType="number-pad"
          placeholder={"Years Of Experience"}
          value={inputs.yearsofexperience.value}
          onUpdateValue={(value: any) =>
            onUpdateValue("yearsofexperience", value)
          }
          icon="barbell-outline"
          containerStyle={styles.input}
        />
      </View>
    </View>
  );
}
