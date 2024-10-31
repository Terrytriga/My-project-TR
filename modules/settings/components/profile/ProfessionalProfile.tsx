import { useTheme } from "@rneui/themed";
import { Platform, StyleSheet, View } from "react-native";
import Input from "../../../shared/components/Input";

export default function ProfessionalProfile({
  isEditing,
  inputs,
  onUpdateValue,
}: {
  isEditing: boolean;
  inputs: any;
  onUpdateValue: (inputType: string, value: any) => void;
}) {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    inputContainer: {
      marginVertical: 5,
      width: isWeb ? "25%" : "100%",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          disabled={!isEditing}
          isValid={inputs.qualification.isValid}
          keyboardType="default"
          placeholder={"Qualification"}
          value={inputs.qualification.value}
          onUpdateValue={(value: any) => onUpdateValue("qualification", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          disabled={!isEditing}
          isValid={inputs.yearsofexperience.isValid}
          keyboardType="number-pad"
          placeholder={"Years Of Experience"}
          value={inputs.yearsofexperience.value.toString()}
          onUpdateValue={(value: any) =>
            onUpdateValue("yearsofexperience", value)
          }
        />
      </View>
    </View>
  );
}
