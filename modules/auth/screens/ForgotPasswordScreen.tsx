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
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { supabase } from "../../../lib/SupaBase";
import { useUserStore } from "../../../store/UserStore";
import FlatButton from "../components/ui/FlatButton";
import { AuthNavigationRoutes } from "../../navigation/Routes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const aspectRation = 1080 / 2400;
const { width } = Dimensions.get("window");
const height = width * aspectRation;

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthNavigationRoutes>>();
  const { setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    email: {
      value: "",
      isValid: true,
    },
  });

  function updateInputValueHandler(inputType: any, enteredValue: any) {
    setInputs((previousInputs) => {
      return {
        ...previousInputs,
        [inputType]: { value: enteredValue, isValid: true },
      };
    });
  }

  async function handleSubmit() {
    setIsLoading(true);
    const validate = () => {
      const emailIsValid = (email: string) => {
        const re =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      };

      if (emailIsValid(inputs.email.value)) {
        return true;
      } else {
        return false;
      }
    };

    if (validate()) {
      const { error } = await supabase.auth.resetPasswordForEmail(
        inputs.email.value
      );
      if (error) {
        setIsLoading(false);
        return false;
      }

      await AsyncStorage.setItem("email", inputs.email.value);
      navigation.navigate("OTP");
      setIsLoading(false);
      return true;
    } else {
      setInputs({
        email: { value: "", isValid: false },
      });
      forgotPasswordAlert("Invalid input", "Please check your entered email.");
      setIsLoading(false);
    }
  }

  function forgotPasswordAlert(title: string, message: string) {
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
      borderTopRightRadius: 0,
      borderTopLeftRadius: 75,
      paddingTop: "7.5%",
    },
    text: {
      fontSize: 16,
      marginHorizontal: 10,
      marginVertical: 10,
    },
    buttons: {
      marginTop: 10,
    },
    image: {
      flex: 1,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 100,
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
            <Text style={styles.text}>
              Enter your email address we will send you an OTP pin to reset your
              password.
            </Text>
            <Input
              onUpdateValue={(value: string) =>
                updateInputValueHandler("email", value)
              }
              secure={false}
              value={inputs.email.value}
              keyboardType="email-address"
              isValid={inputs.email.isValid}
              placeholder={"example@gmail.com"}
              label={"Email:"}
              icon={"mail-outline"}
            />
            <View style={styles.buttons}>
              <Button onPress={handleSubmit}>
                {!isLoading ? "Send OTP" : <ActivityIndicator size="small" />}
              </Button>
            </View>
          </ScrollView>
          <View style={styles.buttons}>
            <FlatButton onPress={() => navigation.navigate("Register")}>
              Create a Account
            </FlatButton>
          </View>
        </View>
      </View>
    </View>
  ) : (
    <View style={webStyles.container}>
      <View style={webStyles.content}>
        <View style={webStyles.block}>
          <Image
            style={webStyles.image}
            source={require("../assets/WebForgotPassword.png")}
          />
        </View>
        <View style={webStyles.block}>
          <Text style={styles.text}>
            Enter your email address we will send you an OTP pin to reset your
            password.
          </Text>
          <Input
            onUpdateValue={(value: string) =>
              updateInputValueHandler("email", value)
            }
            secure={false}
            value={inputs.email.value}
            keyboardType="email-address"
            isValid={inputs.email.isValid}
            placeholder={"example@gmail.com"}
            label={"Email:"}
            icon={"mail-outline"}
            containerStyle={webStyles.input}
          />
          <View style={webStyles.buttonContainer}>
            <Button onPress={handleSubmit}>
              {!isLoading ? "Send OTP" : <ActivityIndicator size="small" />}
            </Button>
          </View>
          <View style={styles.buttons}>
            <FlatButton onPress={() => navigation.navigate("Register")}>
              Create a Account
            </FlatButton>
          </View>
        </View>
      </View>
    </View>
  );
}
