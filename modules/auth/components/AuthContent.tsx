import { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import FlatButton from "./ui/FlatButton";
import AuthForm from "./AuthForm";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import AuthFooter from "./AuthFooter";
import { Ionicons } from "@expo/vector-icons";
import { AuthNavigationRoutes } from "../../navigation/Routes";
import AuthProviders from "./AuthProviders";

const aspectRation = 1080 / 2400;
const { width } = Dimensions.get("window");
const height = width * aspectRation;

interface AuthContentProps {
  isLogin: boolean;
  onAuthenticate: (credentials: { email: string; password: string }) => void;
}

function AuthContent({ isLogin, onAuthenticate }: AuthContentProps) {
  const [rememberMe, setRememberMe] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthNavigationRoutes>>();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace("Register");
    } else {
      navigation.replace("Login");
    }
  }

  function submitHandler(credentials: any) {
    let { email, password } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;
    const passwordsAreEqual = password;

    if (!emailIsValid || !passwordIsValid || (!isLogin && !passwordsAreEqual)) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      setCredentialsInvalid({
        email: !emailIsValid,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({ email, password });
  }

  const styles = StyleSheet.create({
    authContent: {
      padding: 16,
      backgroundColor: "#2B3040",
      borderTopRightRadius: isLogin ? 75 : 0,
      borderTopLeftRadius: isLogin ? 0 : 75,
      paddingTop: "7.5%",
    },
    buttons: {
      marginTop: 30,
    },
    image: {
      borderBottomLeftRadius: isLogin ? 100 : 0,
      borderBottomRightRadius: isLogin ? 0 : 100,
      top: 0,
      height: height * 1,
      width: width,
      overflow: "hidden",
    },
    container: {
      flex: 1,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    space: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    text: {
      color: "white",
    },
  });

  return (
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
            height: height * 1.2,
            width: width,
          }}
        />
        <View style={styles.authContent}>
          <AuthForm
            isLogin={isLogin}
            onSubmit={submitHandler}
            credentialsInvalid={credentialsInvalid}
          />
          {/* {isLogin && (
              <View style={styles.row}>
                <View style={styles.row}>
                  <CheckBox
                    checked={rememberMe}
                    onPress={() => setRememberMe(!rememberMe)}
                  />
                  <Text style={styles.text}>Remember me</Text>
                </View>
                <View>
                  <FlatButton>Forgot Password?</FlatButton>
                </View>
              </View>
            )} */}
          {/* Providers Here */}
          {/* <AuthProviders /> */}

          <View style={styles.buttons}>
            <FlatButton onPress={switchAuthModeHandler}>
              {isLogin ? "Create a new user" : "Log in instead"}
            </FlatButton>
          </View>
        </View>
      </View>
    </View>
  );
}

export default AuthContent;
