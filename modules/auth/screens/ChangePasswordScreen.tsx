import { useUserStore } from "../../../store/UserStore";
import { useState } from "react";
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
import FlatButton from "../components/ui/FlatButton";
import { supabase } from "../../../lib/SupaBase";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthNavigationRoutes } from "../../navigation/Routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthProviders from "../components/AuthProviders";
import { Text, useTheme } from "@rneui/themed";
import { Feather } from "@expo/vector-icons";
import { User } from "../../../utils/Types";

const { width, height } = Dimensions.get("window");
const aspect = width / height;

export default function ChangePasswordScreen() {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthNavigationRoutes>>();
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUserStore();

  const [inputs, setInputs] = useState({
    password: {
      value: "",
      isValid: true,
      isUpperCase: false,
      isLowerCase: false,
      isSpecial: false,
      isDigit: false,
      isLength: false,
    },
    confirmPassword: {
      value: "",
      isValid: true,
    },
  });

  function updateInputValueHandler(inputType: any, enteredValue: any) {
    const hasUppercase = (password: string) => {
      const re = /[A-Z]/;
      return re.test(password);
    };

    const hasLowercase = (password: string) => {
      const re = /[a-z]/;
      return re.test(password);
    };

    const hasDigit = (password: string) => {
      const re = /\d/;
      return re.test(password);
    };

    const hasSpecialCharacter = (password: string) => {
      const re = /[@$!%*?&#]/;
      return re.test(password);
    };

    const isLongerThanSix = (password: string) => {
      const re = /^.{7,}$/;
      return re.test(password);
    };

    setInputs((previousValues) => ({
      ...previousValues,
      [inputType]: {
        value: enteredValue,
        isValid: true,
      },
    }));

    if (inputType === "password") {
      setInputs((previousValues) => ({
        ...previousValues,
        password: {
          value: enteredValue,
          isValid: true,
          isUpperCase: hasUppercase(enteredValue),
          isLowerCase: hasLowercase(enteredValue),
          isSpecial: hasSpecialCharacter(enteredValue),
          isDigit: hasDigit(enteredValue),
          isLength: isLongerThanSix(enteredValue),
        },
      }));
    }
  }

  async function submitHandler() {
    const validate = (data: any) => {
      const passwordIsValid = (password: string) => {
        const re =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return re.test(password);
      };

      if (
        passwordIsValid(data.password.value) &&
        data.password.value === data.confirmPassword.value
      ) {
        return true;
      } else {
        if (!passwordIsValid(data.password.value)) {
          setInputs((previousValues) => ({
            ...previousValues,
            password: {
              value: data.password.value,
              isValid: false,
              isUpperCase: false,
              isLowerCase: false,
              isSpecial: false,
              isDigit: false,
              isLength: false,
            },
          }));
          ChangePasswordAlert("Error Authenticating", "Not a valid password.");
        }
        if (data.password.value !== data.confirmPassword.value) {
          setInputs((previousValues) => ({
            ...previousValues,
            confirmPassword: {
              value: "",
              isValid: false,
            },
          }));
          ChangePasswordAlert(
            "Error Authenticating",
            "Passwords do not match."
          );
        }
        return false;
      }
    };

    if (validate(inputs)) {
      await changePasswordHandler(inputs.password.value);
    }
  }

  async function changePasswordHandler(password: any) {
    setIsLoading(true);
    const storedUser = await AsyncStorage.getItem("user");
    if (!storedUser) {
      ChangePasswordAlert("Error", "User not found.");
      setIsLoading(false);
      return;
    }
    const user = JSON.parse(storedUser);
    const { data, error: setPasswordError } = await supabase.auth.updateUser({
      email: user.email,
      password: password,
    });

    if (setPasswordError) {
      ChangePasswordAlert("Error", setPasswordError.message);
      setIsLoading(false);
      return;
    }
    setUser({
      ...user,
    });
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("session");
    setIsLoading(false);
  }

  function ChangePasswordAlert(title: string, message: string) {
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
    scrollView: {
      paddingVertical: 0,
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
      justifyContent: "flex-start",
    },

    passConditionsContainer: {
      flexDirection: "column",
      // borderWidth: 1,
      // borderColor: theme.colors.primary,
      // borderRadius: 10,
      padding: 3,
      // marginVertical: 15,
    },
    passConditionsText: {
      fontSize: 12,
      marginLeft: 4,
    },
    passConditionsTitle: {
      fontSize: 14,
      fontWeight: "bold",
      marginVertical: 3,
    },
    isValid: {
      color: "green",
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
      // height: (width / 4) * aspect,
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
            <Input
              onUpdateValue={(value: any) =>
                updateInputValueHandler("password", value)
              }
              secure
              value={inputs.password.value}
              isValid={inputs.password.isValid}
              placeholder={"Enter your password"}
              icon={"lock-closed-outline"}
            />
            <Input
              onUpdateValue={(value: any) =>
                updateInputValueHandler("confirmPassword", value)
              }
              secure
              value={inputs.confirmPassword.value}
              isValid={inputs.confirmPassword.isValid}
              placeholder={"Confirm your password"}
              icon={"lock-closed-outline"}
            />
            <View style={{ marginVertical: 15 }}>
              <Button onPress={submitHandler}>
                {!isLoading ? (
                  "Change Password"
                ) : (
                  <ActivityIndicator size="small" />
                )}
              </Button>
            </View>
          </ScrollView>
          <View style={styles.passConditionsContainer}>
            <View style={{ alignItems: "center", paddingVertical: 5 }}>
              <Text style={styles.passConditionsTitle}>
                Password conditions
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  {inputs.password.isLength ? (
                    <Feather name="check-circle" size={12} color={"green"} />
                  ) : (
                    <Feather
                      name="circle"
                      size={12}
                      color={theme.colors.black}
                    />
                  )}
                  <Text
                    style={[
                      styles.passConditionsText,
                      inputs.password.isLength && styles.isValid,
                    ]}
                  >
                    Password length is more than 6 characters
                  </Text>
                </View>
                <View style={styles.row}>
                  {inputs.password.isLowerCase ? (
                    <Feather name="check-circle" size={12} color={"green"} />
                  ) : (
                    <Feather
                      name="circle"
                      size={12}
                      color={theme.colors.black}
                    />
                  )}
                  <Text
                    style={[
                      styles.passConditionsText,
                      inputs.password.isLowerCase && styles.isValid,
                    ]}
                  >
                    One lowercase letter
                  </Text>
                </View>

                <View style={styles.row}>
                  {inputs.password.isUpperCase ? (
                    <Feather name="check-circle" size={12} color={"green"} />
                  ) : (
                    <Feather
                      name="circle"
                      size={12}
                      color={theme.colors.black}
                    />
                  )}
                  <Text
                    style={[
                      styles.passConditionsText,
                      inputs.password.isUpperCase && styles.isValid,
                    ]}
                  >
                    One uppercase letter
                  </Text>
                </View>
              </View>

              <View>
                <View style={styles.row}>
                  {inputs.password.isDigit ? (
                    <Feather name="check-circle" size={12} color={"green"} />
                  ) : (
                    <Feather
                      name="circle"
                      size={12}
                      color={theme.colors.black}
                    />
                  )}
                  <Text
                    style={[
                      styles.passConditionsText,
                      inputs.password.isDigit && styles.isValid,
                    ]}
                  >
                    One digit
                  </Text>
                </View>
                <View style={styles.row}>
                  {inputs.password.isSpecial ? (
                    <Feather name="check-circle" size={12} color={"green"} />
                  ) : (
                    <Feather
                      name="circle"
                      size={12}
                      color={theme.colors.black}
                    />
                  )}
                  <Text
                    style={[
                      styles.passConditionsText,
                      inputs.password.isSpecial && styles.isValid,
                    ]}
                  >
                    One special character
                  </Text>
                </View>
              </View>
            </View>
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
            source={require("../assets/WebChangePassword.png")}
          />
        </View>
        <View style={webStyles.block}>
          <Input
            onUpdateValue={(value: any) =>
              updateInputValueHandler("password", value)
            }
            secure
            value={inputs.password.value}
            isValid={inputs.password.isValid}
            placeholder={"Enter your password"}
            icon={"lock-closed-outline"}
            containerStyle={webStyles.input}
          />
          <Input
            onUpdateValue={(value: any) =>
              updateInputValueHandler("confirmPassword", value)
            }
            secure
            value={inputs.confirmPassword.value}
            isValid={inputs.confirmPassword.isValid}
            placeholder={"Confirm your password"}
            icon={"lock-closed-outline"}
            containerStyle={webStyles.input}
          />
          <View style={{ marginVertical: 15 }}>
            <Button onPress={submitHandler}>
              {!isLoading ? (
                "Change Password"
              ) : (
                <ActivityIndicator size="small" />
              )}
            </Button>
          </View>
          <View style={styles.passConditionsContainer}>
            <View style={{ alignItems: "center", paddingVertical: 5 }}>
              <Text style={styles.passConditionsTitle}>
                Password conditions
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  {inputs.password.isLength ? (
                    <Feather name="check-circle" size={12} color={"green"} />
                  ) : (
                    <Feather
                      name="circle"
                      size={12}
                      color={theme.colors.black}
                    />
                  )}
                  <Text
                    style={[
                      styles.passConditionsText,
                      inputs.password.isLength && styles.isValid,
                    ]}
                  >
                    Password length is more than 6 characters
                  </Text>
                </View>
                <View style={styles.row}>
                  {inputs.password.isLowerCase ? (
                    <Feather name="check-circle" size={12} color={"green"} />
                  ) : (
                    <Feather
                      name="circle"
                      size={12}
                      color={theme.colors.black}
                    />
                  )}
                  <Text
                    style={[
                      styles.passConditionsText,
                      inputs.password.isLowerCase && styles.isValid,
                    ]}
                  >
                    One lowercase letter
                  </Text>
                </View>

                <View style={styles.row}>
                  {inputs.password.isUpperCase ? (
                    <Feather name="check-circle" size={12} color={"green"} />
                  ) : (
                    <Feather
                      name="circle"
                      size={12}
                      color={theme.colors.black}
                    />
                  )}
                  <Text
                    style={[
                      styles.passConditionsText,
                      inputs.password.isUpperCase && styles.isValid,
                    ]}
                  >
                    One uppercase letter
                  </Text>
                </View>
              </View>

              <View>
                <View style={styles.row}>
                  {inputs.password.isDigit ? (
                    <Feather name="check-circle" size={12} color={"green"} />
                  ) : (
                    <Feather
                      name="circle"
                      size={12}
                      color={theme.colors.black}
                    />
                  )}
                  <Text
                    style={[
                      styles.passConditionsText,
                      inputs.password.isDigit && styles.isValid,
                    ]}
                  >
                    One digit
                  </Text>
                </View>
                <View style={styles.row}>
                  {inputs.password.isSpecial ? (
                    <Feather name="check-circle" size={12} color={"green"} />
                  ) : (
                    <Feather
                      name="circle"
                      size={12}
                      color={theme.colors.black}
                    />
                  )}
                  <Text
                    style={[
                      styles.passConditionsText,
                      inputs.password.isSpecial && styles.isValid,
                    ]}
                  >
                    One special character
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
