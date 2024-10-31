import { ThemeContext, useTheme } from "@rneui/themed";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
export default function ContactUsScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
    },
    contactContainer: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 10,
      width: !isWeb ? width * 0.9 : "40%",
      height: height * 0.3,
      alignItems: "center",
      padding: 20,
      marginVertical: 10,
    },
    heading: {
      fontSize: 30,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginVertical: 30,
      borderBottomColor: theme.colors.primary,
      borderBottomWidth: 1,
    },
    text: {
      fontSize: 16,
      color: theme.colors.black,
      marginVertical: 10,
    },
    textBold: {
      fontWeight: "bold",
    },
    row: {
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      width: "80%",
    },
    icon: {
      marginRight: 10,
    },
    disclaimerContainer: {
      paddingHorizontal: 10,
      width: !isWeb ? width * 0.9 : "40%",
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Contact Us</Text>
      <View style={styles.contactContainer}>
        <View style={styles.row}>
          <Feather
            style={styles.icon}
            name="phone"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.text}>+27 82 999 8888</Text>
        </View>
        <View style={styles.row}>
          <Feather
            style={styles.icon}
            name="mail"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.text}>info@profit.co.za</Text>
        </View>
        <View style={styles.row}>
          <Feather
            style={styles.icon}
            name="map-pin"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.text}>
            5 Kingsway Ave, Rossmore, Johannesburg
          </Text>
        </View>
      </View>
      <View style={styles.disclaimerContainer}>
        <Text>
          <Text style={styles.textBold}>Contact Us Limitations:</Text>{" "}
          Currently, our system does not support direct email sending
          capabilities as we do not have an SMTP server configured. While we are
          actively working to enhance our communication features, we encourage
          you to contact us through the provided phone number or address listed
          on our page. We appreciate your understanding and are here to assist
          you through these alternative methods. Thank you for your patience as
          we improve our services to better connect with you.
        </Text>
      </View>
    </View>
  );
}
