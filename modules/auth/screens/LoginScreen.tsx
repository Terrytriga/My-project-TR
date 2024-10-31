import { useState } from "react";
import { useUserStore } from "../../../store/UserStore";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthNavigationRoutes } from "../../navigation/Routes";
import FlatButton from "../components/ui/FlatButton";
import { supabase } from "../../../lib/SupaBase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthProviders from "../components/AuthProviders";
import { CheckBox, Text, useTheme } from "@rneui/themed";
import { Platform } from "react-native";

const { width, height } = Dimensions.get("window");

function LoginScreen() {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthNavigationRoutes>>();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useUserStore();

  const [inputs, setInputs] = useState({
    email: {
      value: "",
      isValid: true,
    },
    password: {
      value: "",
      isValid: true,
    },
  });

  function updateInputValueHandler(inputType: any, enteredValue: any) {
    setInputs((previousValues) => ({
      ...previousValues,
      [inputType]: {
        value: enteredValue,
        isValid: true,
      },
    }));
  }

  async function submitHandler() {
    const validate = (data: any) => {
      const emailIsValid = (email: string) => {
        const re =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      };

      const passwordIsValid = (password: string) => {
        const re =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{6,}$/;
        return re.test(password);
      };

      if (
        emailIsValid(data.email.value) &&
        passwordIsValid(data.password.value)
      ) {
        return true;
      } else {
        if (!emailIsValid) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              email: { value: data.email, isValid: false },
            };
          });
          Alert.alert("Invalid email", "Please enter a valid email.", [
            {
              text: "Okay",
              style: "default",
            },
          ]);
        }
        if (!passwordIsValid) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              password: { value: data.password, isValid: false },
            };
          });
          Alert.alert("Invalid password", "Please enter a password.", [
            {
              text: "Okay",
              style: "default",
            },
          ]);
        }
        if (!emailIsValid && !passwordIsValid) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              email: { value: data.email, isValid: false },
              password: { value: data.password, isValid: false },
            };
          });
        }
        return false;
      }
    };

    if (validate(inputs)) {
      await loginHandler(inputs.email.value, inputs.password.value);
    } else {
      Alert.alert("Invalid input", "Please check your entered credentials.", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Okay",
          style: "default",
        },
      ]);
    }
  }

  async function loginHandler(email: any, password: any) {
    setIsLoading(true);
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });
    if (signInError) {
      LoginAlert("Error", signInError.message);
      setIsLoading(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profile")
      .select(
        "username, firstname, lastname, gender, avatarurl, dateofbirth, biography, totalfollowings, totalfollowers"
      )
      .eq("user_id", signInData.user.id)
      .single();

    if (profileError) {
      LoginAlert("Error", profileError.message);
      setIsLoading(false);
      return;
    }
    if (!profileData) {
      Alert.alert(
        "Profile Reminder",
        "Please remember to update your profile information!",
        [
          {
            text: "Ok",
            style: "default",
          },
        ]
      );
    }

    const profile = profileData ? profileData : null;

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
      .eq("user_id", signInData.user.id)
      .single();

    if (roleError) {
      LoginAlert("Error", roleError.message);
      setIsLoading(false);
      return;
    }
    let proDetails;
    if (roleData.role.name !== "Admin" && roleData.role.name !== "User") {
      const { data: proData, error: proError } = await supabase
        .from(roleData.role.name.toLowerCase())
        .select(
          `
            *,
            professionalstatus (
              professionalstatus_id,
              status
            )
          `
        )
        .eq("user_id", signInData.user.id)
        .single();
      if (proError) {
        LoginAlert("Error", proError.message);
        setIsLoading(false);
        return;
      }
      proDetails = proData;
    }
    const user = {
      id: signInData.user.id,
      role: roleData ? roleData.role.name : null,
      email: signInData.user.email,
      username: profile ? profile.username : null,
      firstname: profile ? profile.firstname : null,
      lastname: profile ? profile.lastname : null,
      gender: profile ? profile.gender : null,
      avatarurl: profile ? profile.avatarurl : null,
      dob: profile ? profile.dateofbirth : null,
      biography: profile ? profile.biography : null,
      accessToken: signInData.session.access_token,
      totalfollowings: profile ? profile.totalfollowings : 0,
      totalfollowers: profile ? profile.totalfollowers : 0,
      qualification: proDetails ? proDetails.qualification : null,
      yearsofexperience: proDetails ? proDetails.yearsofexperience : null,
      status: proDetails ? proDetails.professionalstatus.status : null,
      approvedstatus_id: proDetails ? proDetails.approvedstatus_id : null,
    };
    setUser(user);

    if (user && user.accessToken && user.id && rememberMe) {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("session", JSON.stringify(signInData.session));
    }
    setIsLoading(false);
  }

  function LoginAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  }

  function navigationHandlerRegister() {
    navigation.replace("Register");
  }
  function navigationHandlerForgotPassword() {
    navigation.navigate("ForgotPassword");
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
            <View>
              <Input
                onUpdateValue={updateInputValueHandler.bind(null, "email")}
                value={inputs.email.value}
                keyboardType="email-address"
                isValid={inputs.email.isValid}
                secure={false}
                placeholder={"Enter your email"}
                icon={"mail-outline"}
              />
              <Input
                onUpdateValue={updateInputValueHandler.bind(null, "password")}
                secure
                value={inputs.password.value}
                isValid={inputs.password.isValid}
                placeholder={"Enter your password"}
                icon={"lock-closed-outline"}
              />
              <View style={{ marginTop: 12 }}>
                <Button disabled={isLoading} onPress={submitHandler}>
                  {!isLoading ? "Log In" : <ActivityIndicator size="small" />}
                </Button>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.row}>
                <CheckBox
                  checked={rememberMe}
                  onPress={() => setRememberMe(!rememberMe)}
                />
                <Text>Remember me</Text>
              </View>
              <View>
                <FlatButton onPress={navigationHandlerForgotPassword}>
                  Forgot Password
                </FlatButton>
              </View>
            </View>
          </ScrollView>
          <AuthProviders />
          <View style={styles.buttons}>
            <FlatButton onPress={navigationHandlerRegister}>
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
            source={require("../assets/WebLogin.png")}
          />
        </View>
        <View style={webStyles.block}>
          <Input
            onUpdateValue={updateInputValueHandler.bind(null, "email")}
            value={inputs.email.value}
            keyboardType="email-address"
            isValid={inputs.email.isValid}
            secure={false}
            placeholder={"Enter your email"}
            icon={"mail-outline"}
            containerStyle={webStyles.input}
          />
          <Input
            onUpdateValue={updateInputValueHandler.bind(null, "password")}
            secure
            value={inputs.password.value}
            isValid={inputs.password.isValid}
            placeholder={"Enter your password"}
            icon={"lock-closed-outline"}
            containerStyle={webStyles.input}
          />
          <View style={webStyles.buttonContainer}>
            <Button disabled={isLoading} onPress={submitHandler}>
              {!isLoading ? "Log In" : <ActivityIndicator size="small" />}
            </Button>
          </View>

          <View style={styles.row}>
            <View style={styles.row}>
              <CheckBox
                checked={rememberMe}
                onPress={() => setRememberMe(!rememberMe)}
              />
              <Text>Remember me</Text>
            </View>
            <View>
              <FlatButton onPress={navigationHandlerForgotPassword}>
                Forgot Password
              </FlatButton>
            </View>
          </View>
          <AuthProviders />
          <View style={styles.buttons}>
            <FlatButton onPress={navigationHandlerRegister}>
              Create a Account
            </FlatButton>
          </View>
        </View>
      </View>
    </View>
  );
}

export default LoginScreen;
