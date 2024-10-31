import {
  useDietitianStore,
  usePhysioStore,
  usePsychologistStore,
} from "../../../store/UserStore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
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
import { CheckBox, Text, useTheme } from "@rneui/themed";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker";
import { formatDate } from "../../../utils/FormatDate";
import { Picker } from "@react-native-picker/picker";
import AuthProfessional from "../components/AuthProfessional";
import { useNewAssessmentStore } from "../../../store/AssessmentStore";
import WebDatePicker from "../../shared/components/web/WebDatePicker";

const { width, height } = Dimensions.get("window");

export default function RegisterScreen() {
  const { theme } = useTheme();
  const { addDietitian } = useDietitianStore();
  const { addPhysician } = usePhysioStore();
  const { addPsychologist } = usePsychologistStore();
  const { setUser, user: assessmentUser } = useNewAssessmentStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthNavigationRoutes>>();

  useEffect(() => {
    if (assessmentUser) {
      navigation.navigate("AuthAssessmentStack", {
        screen: "Goals",
      });
    }
  }, [assessmentUser]);

  const [isLoading, setIsLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  // const { setUser } = useUserStore();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const roles = ["Athlete", "Physio", "Psychologist", "Dietitian"];
  const [selectedRole, setSelectedRole] = useState("Athlete");

  const genders = ["Male", "Female", "Other"];
  const [selectedGender, setSelectedGender] = useState("");
  const [inputs, setInputs] = useState({
    email: {
      value: "",
      isValid: true,
    },
    firstname: {
      value: "",
      isValid: true,
    },
    lastname: {
      value: "",
      isValid: true,
    },
    username: {
      value: "",
      isValid: true,
    },
    dateofbirth: {
      value: new Date(),
      isValid: true,
    },
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
    if (inputType === "dateofbirth") {
      setShowDatePicker(false);
    }
  }

  const [professionalInputs, setProfessionalInputs] = useState({
    qualification: {
      value: "",
      isValid: true,
    },
    yearsofexperience: {
      value: 0,
      isValid: true,
    },
  });

  function updateProfessionalInputValueHandler(inputType: string, value: any) {
    setProfessionalInputs((previousValues) => ({
      ...previousValues,
      [inputType]: {
        value: value,
        isValid: true,
      },
    }));
  }

  async function submitHandler() {
    if (!terms) {
      RegisterAlert(
        "Error Registering",
        "Please agree to the terms and conditions."
      );
      return;
    }
    const validate = (data: any) => {
      const emailIsValid = (email: string) => {
        const re =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      };

      const firstnameIsValid = (firstname: string) => {
        const re = /^[a-zA-Z]+$/;
        return re.test(firstname);
      };

      const lastnameIsValid = (lastname: string) => {
        const re = /^[a-zA-Z\s]+$/;
        return re.test(lastname);
      };

      const usernameIsValid = (username: string) => {
        const re = /^[a-zA-Z0-9]+$/;
        return re.test(username);
      };

      const dateofbirthIsValid = (dateofbirth: Date) => {
        const currentYear = new Date().getFullYear();
        return new Date(dateofbirth).getFullYear() !== currentYear;
      };

      const passwordIsValid = (password: string) => {
        const re =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{6,}$/;
        return re.test(password);
      };

      if (
        emailIsValid(data.email.value) &&
        passwordIsValid(data.password.value) &&
        firstnameIsValid(data.firstname.value) &&
        lastnameIsValid(data.lastname.value) &&
        usernameIsValid(data.username.value) &&
        dateofbirthIsValid(data.dateofbirth.value) &&
        data.password.value === data.confirmPassword.value
      ) {
        return true;
      } else {
        if (!emailIsValid(data.email.value)) {
          setInputs((previousValues) => ({
            ...previousValues,
            email: {
              value: data.email.value,
              isValid: false,
            },
          }));
          RegisterAlert("Error Authenticating", "Not a valid email.");
        }
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
          RegisterAlert("Error Authenticating", "Not a valid password.");
        }
        if (data.password.value !== data.confirmPassword.value) {
          setInputs((previousValues) => ({
            ...previousValues,
            confirmPassword: {
              value: data.confirmPassword.value,
              isValid: false,
            },
          }));
          RegisterAlert("Error Authenticating", "Passwords do not match.");
        }
        if (!firstnameIsValid(data.firstname.value)) {
          setInputs((previousValues) => ({
            ...previousValues,
            firstname: {
              value: data.firstname.value,
              isValid: false,
            },
          }));
          RegisterAlert("Error Authenticating", "Not a valid first name.");
        }
        if (!lastnameIsValid(data.lastname.value)) {
          setInputs((previousValues) => ({
            ...previousValues,
            lastname: {
              value: data.lastname.value,
              isValid: false,
            },
          }));
          RegisterAlert("Error Authenticating", "Not a valid last name.");
        }
        if (!usernameIsValid(data.username.value)) {
          setInputs((previousValues) => ({
            ...previousValues,
            username: {
              value: data.username.value,
              isValid: false,
            },
          }));
          RegisterAlert("Error Authenticating", "Not a valid username.");
        }
        if (!dateofbirthIsValid(data.dateofbirth.value)) {
          setInputs((previousValues) => ({
            ...previousValues,
            dateofbirth: {
              value: data.dateofbirth.value,
              isValid: false,
            },
          }));
          RegisterAlert("Error Authenticating", "Not a valid date of birth.");
        }
        return false;
      }
    };

    const validateProfessional = () => {
      const qualificationIsValid = (qualification: string) => {
        return qualification.length > 0;
      };

      if (qualificationIsValid(professionalInputs.qualification.value)) {
        return true;
      } else {
        if (!qualificationIsValid(professionalInputs.qualification.value)) {
          setProfessionalInputs((currentValues) => {
            return {
              ...currentValues,
              qualification: {
                value: professionalInputs.qualification.value,
                isValid: false,
              },
            };
          });
          RegisterAlert(
            "Invalid qualification",
            "Please enter your qualification."
          );
        }
        return false;
      }
    };

    console.log("Before Validate");
    if (validate(inputs)) {
      console.log("After Validate");
      setIsLoading(true);
      const user = await signupHandler(
        inputs.email.value,
        inputs.password.value
      );
      if (!user) return;
      console.log("we have user.");
      if (selectedRole && selectedRole !== "Athlete") {
        console.log("we have role.");
        if (validateProfessional()) {
          console.log("we have validate.");
          console.log(selectedRole);
          console.log(selectedRole === "Physio");
          if (selectedRole === "Physio") {
            console.log("physio");
            await physioHandler(user.id);
          }
          if (selectedRole === "Psychologist") {
            await psychologistHandler(user.id);
          }
          if (selectedRole === "Dietitian") {
            await dietitianHandler(user.id);
          }
        }
      }
      setUser({
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        gender: user.gender,
        dob: user.dob,
        role: user.role,
        accessToken: user.accessToken,
        approvedstatus_id: user.approvedstatus_id,
      });
      setIsLoading(false);
    }
  }

  async function signupHandler(email: any, password: any) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      { email, password }
    );

    if (signUpError) {
      RegisterAlert("Error Authenticating", signUpError.message);
      setIsLoading(false);
      return;
    }
    if (signUpData.user === null || signUpData.session === null) {
      setIsLoading(false);
      return;
    }

    const { error: termError } = await supabase
      .from("termsandconditions")
      .insert([
        {
          user_id: signUpData.user.id,
          datecreated: new Date(),
        },
      ]);

    if (termError) {
      RegisterAlert("Error Authenticating", termError.message);
      setIsLoading(false);
      return;
    }

    const gender = selectedGender ? selectedGender : "Male";
    const { data: profileData, error: profileError } = await supabase
      .from("profile")
      .insert([
        {
          user_id: signUpData.user.id,
          firstname: inputs.firstname.value,
          lastname: inputs.lastname.value,
          gender: gender,
          username: inputs.username.value,
          dateofbirth: inputs.dateofbirth.value,
        },
      ])
      .select();

    if (profileError || !profileData) {
      RegisterAlert("Error Authenticating", profileError.message);
      setIsLoading(false);
      return;
    }

    let role_id;
    switch (selectedRole) {
      case "Athlete":
        role_id = 1;
        break;
      case "Physio":
        role_id = 2;
        break;
      case "Psychologist":
        role_id = 3;
        break;
      case "Dietitian":
        role_id = 4;
        break;
    }
    const { data: roleData, error: roleError } = await supabase
      .from("userrole")
      .insert([{ role_id: role_id, user_id: signUpData.user.id }])
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
      .single();

    if (roleError) {
      RegisterAlert("Error Authenticating", roleError.message);
      setIsLoading(false);
      return;
    }
    //Sets user in AssessmentStore
    const details = {
      id: signUpData.user.id,
      email: signUpData.user.email,
      firstname: profileData[0].firstname,
      lastname: profileData[0].lastname,
      username: profileData[0].username,
      gender: gender,
      dob: profileData[0].dateofbirth,
      role: roleData.role.name,
      accessToken: signUpData.session.access_token,
      approvedstatus_id: role_id === 1 ? null : 1,
    };
    return details;

    // if (signUpData.user && signUpData.session) {
    //   await AsyncStorage.setItem("user", JSON.stringify(signUpData.user));
    //   await AsyncStorage.setItem("session", JSON.stringify(signUpData.session));
    // }
  }

  async function dietitianHandler(user_id: string) {
    const { data: insertProData, error: insertProError } = await supabase
      .from("dietitian")
      .insert([
        {
          user_id: user_id,
          professionalstatus_id: 1,
          approvedstatus_id: 1,
          qualification: professionalInputs.qualification.value,
          yearsofexperience: professionalInputs.yearsofexperience.value,
        },
      ])
      .select()
      .single();
    if (insertProError) {
      RegisterAlert("Error", insertProError.message);
      setIsLoading(false);
      return;
    }

    addDietitian(insertProData);
    setUser({
      qualification: professionalInputs.qualification.value,
      yearsofexperience: professionalInputs.yearsofexperience.value,
    });
  }

  async function physioHandler(user_id: string) {
    const { data: insertProData, error: insertProError } = await supabase
      .from("physio")
      .insert([
        {
          user_id: user_id,
          professionalstatus_id: 1,
          approvedstatus_id: 1,
          qualification: professionalInputs.qualification.value,
          yearsofexperience: professionalInputs.yearsofexperience.value,
        },
      ])
      .select()
      .single();

    if (insertProError) {
      RegisterAlert("Error", insertProError.message);
      setIsLoading(false);
      return;
    }

    addPhysician(insertProData);
    setUser({
      qualification: professionalInputs.qualification.value,
      yearsofexperience: professionalInputs.yearsofexperience.value,
    });
  }

  async function psychologistHandler(user_id: string) {
    const { data: insertProData, error: insertProError } = await supabase
      .from("psychologist")
      .insert([
        {
          user_id: user_id,
          professionalstatus_id: 1,
          approvedstatus_id: 1,
          qualification: professionalInputs.qualification.value,
          yearsofexperience: professionalInputs.yearsofexperience.value,
        },
      ])
      .select()
      .single();
    if (insertProError) {
      RegisterAlert("Error", insertProError.message);
      setIsLoading(false);
      return;
    }

    addPsychologist(insertProData);
    setUser({
      qualification: professionalInputs.qualification.value,
      yearsofexperience: professionalInputs.yearsofexperience.value,
    });
  }

  function RegisterAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "Ok",
        style: "default",
      },
    ]);
  }

  const switchAuthModeHandler = () => {
    navigation.replace("Login");
  };

  function toggleDatePicker() {
    setShowDatePicker(!showDatePicker);
  }

  const styles = StyleSheet.create({
    authContent: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 75,
      paddingTop: "10%",
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
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    halfInput: {
      width: "45%",
      padding: 0,
      margin: 0,
    },
    passConditionsContainer: {
      flexDirection: "column",
      padding: 3,
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
    pickerContainer: {
      width: "45%",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 10,
      marginVertical: 10,
      alignSelf: "center",
    },
  });

  const webStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    rowContainer: {
      width: "50%",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    content: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      padding: 16,
    },
    dateInput: {
      width: "100%",
    },
    block: {
      width: "50%",
      alignItems: "center",
      justifyContent: "center",
    },
    scrollView: {
      width: "50%",
      height: height <= 743 ? height * 0.85 : height * 0.9,
    },
    scrollViewContent: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      width: "40%",
    },

    halfInputContainer: {
      width: "47%",
    },
    halfInput: {
      width: "90%",
    },
    pickerContainer: {
      width: "47%",
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
            <View style={styles.rowContainer}>
              <View style={styles.pickerContainer}>
                <Picker
                  style={{
                    width: "100%",
                    height: 50,
                    color: theme.colors.black,
                    borderWidth: 0,
                  }}
                  itemStyle={{ color: theme.colors.black }}
                  dropdownIconColor={theme.colors.primary}
                  selectedValue={selectedRole}
                  onValueChange={(itemValue) => setSelectedRole(itemValue)}
                  prompt="Who are you?"
                >
                  {roles &&
                    roles.map((role) => (
                      <Picker.Item key={role} label={role} value={role} />
                    ))}
                </Picker>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  style={{
                    width: "100%",
                    height: 50,
                    color: theme.colors.black,
                  }}
                  itemStyle={{ color: theme.colors.black }}
                  dropdownIconColor={theme.colors.primary}
                  selectedValue={selectedGender}
                  onValueChange={(itemValue: string) =>
                    setSelectedGender(itemValue)
                  }
                  prompt="What is your gender?"
                >
                  {genders &&
                    genders.map((gender, index) => (
                      <Picker.Item key={index} label={gender} value={gender} />
                    ))}
                </Picker>
              </View>
            </View>
            <View style={styles.rowContainer}>
              <Input
                containerStyle={styles.halfInput}
                onUpdateValue={(value: any) =>
                  updateInputValueHandler("firstname", value)
                }
                value={inputs.firstname.value}
                isValid={inputs.firstname.isValid}
                keyboardType="default"
                secure={false}
                placeholder={"First Name"}
              />
              <Input
                onUpdateValue={(value: any) =>
                  updateInputValueHandler("lastname", value)
                }
                containerStyle={styles.halfInput}
                value={inputs.lastname.value}
                isValid={inputs.lastname.isValid}
                keyboardType="default"
                secure={false}
                placeholder={"Last Name"}
              />
            </View>
            <Input
              onUpdateValue={(value: any) =>
                updateInputValueHandler("email", value)
              }
              value={inputs.email.value}
              keyboardType="email-address"
              isValid={inputs.email.isValid}
              secure={false}
              placeholder={"Enter your email"}
              icon={"mail-outline"}
            />
            <Input
              onUpdateValue={(value: any) =>
                updateInputValueHandler("username", value)
              }
              keyboardType="default"
              value={inputs.username.value}
              isValid={inputs.username.isValid}
              placeholder={"Username"}
              icon={"at"}
            />
            <Pressable onPress={toggleDatePicker}>
              <Input
                onUpdateValue={(value: any) =>
                  updateInputValueHandler("dateofbirth", value)
                }
                disabled={true}
                value={formatDate(inputs.dateofbirth.value).toString()}
                isValid={inputs.dateofbirth.isValid}
                placeholder={"Date of Birth"}
                icon={"calendar-outline"}
              />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={inputs.dateofbirth.value}
                onChange={(event, selecteDate) => {
                  const date = selecteDate || inputs.dateofbirth.value;
                  updateInputValueHandler("dateofbirth", date);
                }}
                mode="date"
                display="spinner"
              />
            )}
            {selectedRole && selectedRole !== "Athlete" && (
              <AuthProfessional
                inputs={professionalInputs}
                onUpdateValue={updateProfessionalInputValueHandler}
              />
            )}
            <Input
              onUpdateValue={updateInputValueHandler.bind(null, "password")}
              secure={true}
              value={inputs.password.value}
              isValid={inputs.password.isValid}
              placeholder={"Enter your password"}
              icon={"lock-closed-outline"}
              keyboardType="default"
            />
            <Input
              onUpdateValue={updateInputValueHandler.bind(
                null,
                "confirmPassword"
              )}
              secure
              value={inputs.confirmPassword.value}
              isValid={inputs.confirmPassword.isValid}
              placeholder={"Confirm your password"}
              icon={"lock-closed-outline"}
              keyboardType="default"
            />
            <View style={{ marginVertical: 15 }}>
              <Button onPress={submitHandler}>
                {!isLoading ? (
                  "Create Account"
                ) : (
                  <ActivityIndicator size="small" />
                )}
              </Button>
            </View>
            <View style={styles.row}>
              <CheckBox checked={terms} onPress={() => setTerms(!terms)} />
              <FlatButton
                onPress={() => navigation.navigate("TermsAndConditions")}
              >
                I agree to the{" "}
                <Text style={{ color: theme.colors.primary }}>
                  Terms and Conditions
                </Text>
              </FlatButton>
            </View>

            <AuthProviders />
            <View style={styles.buttons}>
              <FlatButton onPress={switchAuthModeHandler}>
                Log in instead
              </FlatButton>
            </View>
          </ScrollView>
          {inputs.password.value.length !== 0 && (
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
          )}
        </View>
      </View>
    </View>
  ) : (
    <View style={webStyles.container}>
      <View style={webStyles.content}>
        <View style={webStyles.block}>
          <Image
            style={webStyles.image}
            source={require("../assets/WebRegister.png")}
          />
        </View>
        <ScrollView
          style={webStyles.scrollView}
          contentContainerStyle={webStyles.scrollViewContent}
        >
          <View style={webStyles.rowContainer}>
            <View style={webStyles.pickerContainer}>
              <Picker
                style={{
                  width: "100%",
                  height: 50,
                  color: theme.colors.black,
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.primary,
                  borderRadius: 10,
                  paddingHorizontal: 5,
                }}
                itemStyle={{ color: theme.colors.black }}
                dropdownIconColor={theme.colors.primary}
                selectedValue={selectedRole}
                onValueChange={(itemValue) => setSelectedRole(itemValue)}
                prompt="Who are you?"
              >
                {roles &&
                  roles.map((role) => (
                    <Picker.Item key={role} label={role} value={role} />
                  ))}
              </Picker>
            </View>
            <View style={webStyles.pickerContainer}>
              <Picker
                style={{
                  width: "100%",
                  height: 50,
                  color: theme.colors.black,
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.primary,
                  borderRadius: 10,
                  paddingHorizontal: 5,
                }}
                itemStyle={{ color: theme.colors.black }}
                dropdownIconColor={theme.colors.primary}
                selectedValue={selectedGender}
                onValueChange={(itemValue: string) =>
                  setSelectedGender(itemValue)
                }
                prompt="What is your gender?"
              >
                {genders &&
                  genders.map((gender, index) => (
                    <Picker.Item key={index} label={gender} value={gender} />
                  ))}
              </Picker>
            </View>
          </View>
          <View style={webStyles.rowContainer}>
            <Input
              containerStyle={webStyles.halfInputContainer}
              inputStyle={webStyles.halfInput}
              onUpdateValue={(value: any) =>
                updateInputValueHandler("firstname", value)
              }
              value={inputs.firstname.value}
              isValid={inputs.firstname.isValid}
              keyboardType="default"
              secure={false}
              placeholder={"First Name"}
            />
            <Input
              onUpdateValue={(value: any) =>
                updateInputValueHandler("lastname", value)
              }
              containerStyle={webStyles.halfInputContainer}
              inputStyle={webStyles.halfInput}
              value={inputs.lastname.value}
              isValid={inputs.lastname.isValid}
              keyboardType="default"
              secure={false}
              placeholder={"Last Name"}
            />
          </View>
          <Input
            onUpdateValue={(value: any) =>
              updateInputValueHandler("email", value)
            }
            value={inputs.email.value}
            keyboardType="email-address"
            isValid={inputs.email.isValid}
            secure={false}
            placeholder={"Enter your email"}
            icon={"mail-outline"}
            containerStyle={webStyles.input}
          />
          <Input
            onUpdateValue={(value: any) =>
              updateInputValueHandler("username", value)
            }
            keyboardType="default"
            value={inputs.username.value}
            isValid={inputs.username.isValid}
            placeholder={"Username"}
            icon={"at"}
            containerStyle={webStyles.input}
          />
          <WebDatePicker
            date={inputs.dateofbirth.value}
            onChange={updateInputValueHandler}
            inputType="dateofbirth"
          />
          {selectedRole && selectedRole !== "Athlete" && (
            <AuthProfessional
              inputs={professionalInputs}
              onUpdateValue={updateProfessionalInputValueHandler}
            />
          )}
          <Input
            onUpdateValue={updateInputValueHandler.bind(null, "password")}
            secure={true}
            value={inputs.password.value}
            isValid={inputs.password.isValid}
            placeholder={"Enter your password"}
            icon={"lock-closed-outline"}
            keyboardType="default"
            containerStyle={webStyles.input}
          />
          <Input
            onUpdateValue={updateInputValueHandler.bind(
              null,
              "confirmPassword"
            )}
            secure
            value={inputs.confirmPassword.value}
            isValid={inputs.confirmPassword.isValid}
            placeholder={"Confirm your password"}
            icon={"lock-closed-outline"}
            keyboardType="default"
            containerStyle={webStyles.input}
          />
          <View style={{ marginVertical: 15 }}>
            <Button onPress={submitHandler}>
              {!isLoading ? (
                "Create Account"
              ) : (
                <ActivityIndicator size="small" />
              )}
            </Button>
          </View>
          <View style={styles.row}>
            <CheckBox checked={terms} onPress={() => setTerms(!terms)} />
            <FlatButton
              onPress={() => navigation.navigate("TermsAndConditions")}
            >
              I agree to the{" "}
              <Text style={{ color: theme.colors.primary }}>
                Terms and Conditions
              </Text>
            </FlatButton>
          </View>

          <AuthProviders />
          <View style={styles.buttons}>
            <FlatButton onPress={switchAuthModeHandler}>
              Log in instead
            </FlatButton>
          </View>
          {inputs.password.value.length !== 0 && (
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
          )}
        </ScrollView>
      </View>
    </View>
  );
}
