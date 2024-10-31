import { useState } from "react";
import { Text, useTheme } from "@rneui/themed";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useUserStore } from "../../../store/UserStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { supabase } from "../../../lib/SupaBase";
import { AuthNavigationRoutes } from "../../navigation/Routes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const aspectRation = 1080 / 2400;
const { width } = Dimensions.get("window");
const height = width * aspectRation;

export default function OTPScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthNavigationRoutes>>();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    otp: {
      value: "",
      isValid: true,
    },
  });

  const updateInputValueHandler = (inputType: any, enteredValue: any) => {
    setInputs((previousInputs) => {
      return {
        ...previousInputs,
        [inputType]: { value: enteredValue, isValid: true },
      };
    });
  };

  async function handleSubmit() {
    setIsLoading(true);
    const email = await AsyncStorage.getItem("email");
    const validate = () => {
      const isSixDigitNumeric = (input: string) => {
        const re = /^\d{6}$/;
        return re.test(input);
      };

      if (isSixDigitNumeric(inputs.otp.value)) {
        return true;
      } else {
        return false;
      }
    };

    if (validate() && email) {
      const { data: verifyOTPData, error: verifyOTPError } =
        await supabase.auth.verifyOtp({
          email: email,
          token: inputs.otp.value,
          type: "email",
        });
      if (verifyOTPError) {
        OTPAlert("Error", verifyOTPError.message);
        setIsLoading(false);
        return;
      }
      if (verifyOTPData.user && verifyOTPData.session) {
        const { data: profileData, error: profileError } = await supabase
          .from("profile")
          .select(
            "username, firstname, lastname, avatarurl, dateofbirth, biography, totalfollowings, totalfollowers"
          )
          .eq("user_id", verifyOTPData.user.id);
        if (profileError) {
          OTPAlert("Error", profileError.message);
          setIsLoading(false);
          return;
        }
        if (profileData.length === 0) {
          OTPAlert(
            "Profile Reminder",
            "Please remember to update your profile information!"
          );
        }
        const profile =
          profileData && profileData.length > 0 ? profileData[0] : null;

        const { data: roleData, error: roleError } = await supabase
          .from("userrole")
          .select(
            `
          *,
          role (
            role_id,
            name,
            description
          )
        `
          )
          .eq("user_id", verifyOTPData.user.id);

        if (roleError) {
          OTPAlert("Error", roleError.message);
          setIsLoading(false);
          return;
        }
        let proDetails;
        if (
          roleData[0].role.name !== "admin" ||
          roleData[0].role.name !== "user"
        ) {
          const { data: proData, error: proError } = await supabase
            .from("professional")
            .select(
              `
            *,
            professionalstatus (
              professionalstatus_id,
              status
            )
          `
            )
            .eq("user_id", verifyOTPData.user.id);
          if (proError) {
            OTPAlert("Error", proError.message);
            setIsLoading(false);
            return;
          }
          proDetails = proData[0];
        }
        const user = {
          id: verifyOTPData.user.id,
          role: roleData.length > 0 ? roleData[0].role.name : null,
          email: verifyOTPData.user.email,
          username: profile ? profile.username : null,
          firstname: profile ? profile.firstname : null,
          lastname: profile ? profile.lastname : null,
          avatarurl: profile ? profile.avatarurl : null,
          dob: profile ? profile.dateofbirth : null,
          biography: profile ? profile.biography : null,
          accessToken: verifyOTPData.session.access_token,
          totalfollowings: profile ? profile.totalfollowings : 0,
          totalfollowers: profile ? profile.totalfollowers : 0,
          qualification: proDetails ? proDetails.qualification : null,
          yearsofexperience: proDetails ? proDetails.yearsofexperience : null,
          status: proDetails ? proDetails.professionalstatus.status : null,
        };
        await AsyncStorage.removeItem("email");
        await AsyncStorage.setItem("user", JSON.stringify(user));
        setIsLoading(false);
        navigation.navigate("ChangePassword");
      }
    } else {
      setInputs({
        otp: { value: "", isValid: false },
      });
      OTPAlert("Invalid input", "Please check your entered OTP.");
    }
  }
  function OTPAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  }

  const styles = StyleSheet.create({
    authContent: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
      borderTopRightRadius: 75,
      borderTopLeftRadius: 0,
      paddingTop: "7.5%",
    },
    buttons: {
      marginTop: 10,
    },
    image: {
      flex: 1,
      borderBottomLeftRadius: 100,
      borderBottomRightRadius: 0,
      top: 0,
      height: height * 1,
      width: width,
      overflow: "hidden",
    },
    container: {
      flex: 4,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });

  const webStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      padding: 16,
    },
    block: {
      width: "50%",
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      width: "40%",
    },
    buttonContainer: {
      width: "33%",
    },
    image: {
      width: width / 2,
    },
  });

  return Platform.OS !== "web" ? (
    <View style={styles.container}>
      <Image
        source={require("../assets/backgroundSmaller.png")}
        style={styles.image}
      />
      <View style={styles.container}>
        <Image
          source={require("../assets/BackgroundBottomSmaller.png")}
          style={{
            ...StyleSheet.absoluteFillObject,
            height: height * 0.372,
            width: width,
          }}
        />
        <View style={styles.authContent}>
          <ScrollView automaticallyAdjustKeyboardInsets={true}>
            <Text>
              Enter the OTP pin you should have received either through SMS or
              Email
            </Text>

            <Input
              onUpdateValue={(value: any) =>
                updateInputValueHandler("otp", value)
              }
              secure={false}
              value={inputs.otp.value}
              keyboardType="number-pad"
              isValid={inputs.otp.isValid}
              placeholder={"123456"}
              label={"OTP Pin:"}
              icon={"flame-outline"}
            />

            <Button onPress={handleSubmit}>
              {!isLoading ? "Confirm OTP" : <ActivityIndicator size="small" />}
            </Button>
          </ScrollView>
        </View>
      </View>
    </View>
  ) : (
    <View style={webStyles.container}>
      <View style={webStyles.content}>
        <View style={webStyles.block}>
          <Image
            style={webStyles.image}
            source={require("../assets/WebOTP.png")}
          />
        </View>
        <View style={webStyles.block}>
          <Text>
            Enter the OTP pin you should have received either through SMS or
            Email
          </Text>

          <Input
            onUpdateValue={(value: any) =>
              updateInputValueHandler("otp", value)
            }
            secure={false}
            value={inputs.otp.value}
            keyboardType="number-pad"
            isValid={inputs.otp.isValid}
            placeholder={"123456"}
            label={"OTP Pin:"}
            icon={"flame-outline"}
            containerStyle={webStyles.input}
          />
          <View style={webStyles.buttonContainer}>
            <Button onPress={handleSubmit}>
              {!isLoading ? "Confirm OTP" : <ActivityIndicator size="small" />}
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
