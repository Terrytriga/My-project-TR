import {
  View,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Text, useTheme } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUserStore } from "../../../store/UserStore";
import { formatDate } from "../../../utils/FormatDate";
import Button from "../../shared/components/Button";
import { supabase } from "../../../lib/SupaBase";
import { decode } from "base64-arraybuffer";
import ProfessionalProfile from "../components/profile/ProfessionalProfile";
import {
  useProfessionalStatusStore,
  useDietitianStore,
} from "../../../store/UserStore";
import { Picker } from "@react-native-picker/picker";
import Input from "../../auth/components/ui/Input";
import { usePostStore, useThreadStore } from "../../../store/CommunityStore";
import StatusList from "../components/profile/StatusList";
import { ProfessionalStatus } from "../../../utils/Types";
import { set } from "react-datepicker/dist/date_utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { useWorkoutProgramStore } from "../../../store/WorkoutStore";
import { useMealPlanStore } from "../../../store/MealStore";
import { useTrackingStore } from "../../../store/TrackingStore";

export default function ProfileSettingScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { user, setUser } = useUserStore();

  const { threads: threadStore } = useThreadStore();
  const { posts: postStore } = usePostStore();
  const { workoutPrograms } = useWorkoutProgramStore();
  const { mealPlans } = useMealPlanStore();
  const { trackingSteps, trackingSleep, trackingWater } = useTrackingStore();

  const threads = threadStore.filter(
    (thread) => thread.author_id === user?.id
  ).length;
  const posts = postStore.filter((post) => post.author_id === user?.id).length;
  const workoutsCompleted = workoutPrograms.filter(
    (program) => program.completed
  ).length;
  const mealsCompleted = mealPlans.filter((plan) => plan.completed).length;
  const totalSteps = trackingSteps.reduce((acc, curr) => acc + curr.steps, 0);
  const totalWater = trackingWater.reduce((acc, curr) => acc + curr.bottles, 0);
  const totalSleep = trackingSleep.reduce((acc, curr) => acc + curr.hours, 0);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset>();
  const { professionalStatuses } = useProfessionalStatusStore();
  const professionalStatus = professionalStatuses.find(
    (status) => status.status === user?.status
  );
  const [selectedStatus, setSelectedStatus] = useState(professionalStatus!);
  const { dietitians, addDietitian, updateDietitian } = useDietitianStore();
  const [isProfessional] = useState(
    user?.role === "Physio" ||
      user?.role === "Psychologist" ||
      user?.role === "Dietitian"
  );
  const isApproved = user?.approvedstatus_id === 2;

  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    username: {
      value: user?.username ? user.username : "",
      isValid: true,
    },
    biography: {
      value: user?.biography ? user.biography : "",
    },
    avatarurl: {
      value: user?.avatarurl ? user.avatarurl : "",
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

  const [professionalInputs, setProfessionalInputs] = useState({
    qualification: {
      value: user?.qualification ? user?.qualification : "",
      isValid: true,
    },
    yearsofexperience: {
      value: user?.yearsofexperience ? user?.yearsofexperience : 0,
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

  function toggleEdit() {
    setIsEditing(!isEditing);
  }
  function toggleCancel() {
    resetFields();
    toggleEdit();
  }

  function toggleConfirm() {
    Alert.alert("Confirm", "Please check your entered credentials.", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {
          resetFields(), toggleEdit();
        },
      },
      {
        text: "Okay",
        style: "default",
        onPress: () => {
          submitHandler();
          toggleEdit();
        },
      },
    ]);
  }

  function resetFields() {
    setInputs({
      username: {
        value: user?.username ? user.username : "",
        isValid: true,
      },
      biography: {
        value: user?.biography ? user.biography : "",
      },
      avatarurl: {
        value: user?.avatarurl ? user.avatarurl : "",
      },
    });
    setProfessionalInputs({
      qualification: {
        value: user?.qualification ? user.qualification : "",
        isValid: true,
      },
      yearsofexperience: {
        value: user?.yearsofexperience ? user.yearsofexperience : 0,
        isValid: true,
      },
    });
  }

  const pickImage = async () => {
    if (isEditing) {
      // Request permission to access the media library
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

      // Open the image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    }
    return;
  };

  const uploadImage = async () => {
    if (!selectedImage || !selectedImage.mimeType || !selectedImage.base64)
      return;

    const { data: listData, error: listError } = await supabase.storage
      .from("Public")
      .list(`ProfilePictures/${user?.id}`);

    if (listError) return;

    if (listData?.length > 0) {
      const filesToRemove = listData.map(
        (file) => `ProfilePictures/${user?.id}/${file.name}`
      );
      const { error: removeError } = await supabase.storage
        .from("Public")
        .remove(filesToRemove);

      if (removeError) return;
    }

    const filePath = `ProfilePictures/${user?.id}/${selectedImage.fileName}`;
    const base64 = selectedImage.base64;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Public")
      .upload(filePath, decode(base64!), {
        contentType: selectedImage.mimeType,
      });
    if (uploadError || !uploadData) {
      ProfileAlert("Error Uploading", uploadError.message);
      return;
    }
    return await getPublicUrl(uploadData.path);
  };

  const getPublicUrl = async (filePath: string) => {
    if (!filePath) return;
    const { data: publicUrlData } = supabase.storage
      .from("Public")
      .getPublicUrl(filePath);
    if (publicUrlData) {
      return publicUrlData.publicUrl;
    }
  };

  async function submitHandler() {
    const validate = () => {
      const usernameIsValid = (username: string) => {
        return username.length > 0;
      };

      if (usernameIsValid(inputs.username.value)) {
        return true;
      } else {
        if (!usernameIsValid(inputs.username.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              username: { value: inputs.username.value, isValid: false },
            };
          });
          ProfileAlert("Invalid username", "Please enter a username.");
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
          ProfileAlert(
            "Invalid qualification",
            "Please enter your qualification."
          );
        }
        return false;
      }
    };
    if (validate()) {
      await updateProfileHandler();
      if (isProfessional) {
        if (validateProfessional()) {
          if (user?.role === "Dietitian") {
            await updateDietitianHandler();
          }
          if (user?.role === "Physio") {
            await updatePhysioHandler();
          }
          if (user?.role === "Psychologist") {
            await updatePsychologistHandler();
          }
        }
      }
      ProfileAlert("Profile updated", "Your profile has been updated.");
    }
    return;
  }

  const ProfileAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  };

  async function updatePsychologistHandler() {
    if (!user?.id || !user.role) return;
    setIsLoading(true);
    const professional = dietitians.find((pro) => pro.user_id === user.id);
    if (!professional) {
      const { data: insertProData, error: insertProError } = await supabase
        .from("psychologist")
        .insert([
          {
            user_id: user.id,
            professionalstatus_id: 1,
            qualification: professionalInputs.qualification.value,
            yearsofexperience: professionalInputs.yearsofexperience.value,
          },
        ])
        .select();
      if (insertProError) {
        ProfileAlert("Error", insertProError.message);
        return;
      }
      if (insertProData.length > 0) {
        addDietitian(insertProData[0]);
        setUser({
          qualification: professionalInputs.qualification.value,
          yearsofexperience: professionalInputs.yearsofexperience.value,
        });
      }
    } else {
      const { data: updateProData, error: updateProError } = await supabase
        .from("psychologist")
        .update({
          qualification: professionalInputs.qualification.value,
          yearsofexperience: professionalInputs.yearsofexperience.value,
        })
        .eq("user_id", user.id)
        .select();
      if (updateProError) {
        ProfileAlert("Error", updateProError.message);
        return;
      }
      if (updateProData.length > 0) {
        updateDietitian(updateProData[0]);
        setUser({
          qualification: professionalInputs.qualification.value,
          yearsofexperience: professionalInputs.yearsofexperience.value,
        });
      }
    }
    setIsLoading(false);
  }

  async function updatePhysioHandler() {
    if (!user?.id || !user.role) return;
    setIsLoading(true);
    const professional = dietitians.find((pro) => pro.user_id === user.id);
    if (!professional) {
      const { data: insertProData, error: insertProError } = await supabase
        .from("physio")
        .insert([
          {
            user_id: user.id,
            professionalstatus_id: 1,
            qualification: professionalInputs.qualification.value,
            yearsofexperience: professionalInputs.yearsofexperience.value,
          },
        ])
        .select();
      if (insertProError) {
        ProfileAlert("Error", insertProError.message);
        return;
      }
      if (insertProData.length > 0) {
        addDietitian(insertProData[0]);
        setUser({
          qualification: professionalInputs.qualification.value,
          yearsofexperience: professionalInputs.yearsofexperience.value,
        });
      }
    } else {
      const { data: updateProData, error: updateProError } = await supabase
        .from("physio")
        .update({
          qualification: professionalInputs.qualification.value,
          yearsofexperience: professionalInputs.yearsofexperience.value,
        })
        .eq("user_id", user.id)
        .select();
      if (updateProError) {
        ProfileAlert("Error", updateProError.message);
        return;
      }
      if (updateProData.length > 0) {
        updateDietitian(updateProData[0]);
        setUser({
          qualification: professionalInputs.qualification.value,
          yearsofexperience: professionalInputs.yearsofexperience.value,
        });
      }
    }
    setIsLoading(false);
  }

  async function updateDietitianHandler() {
    if (!user?.id || !user.role) return;
    setIsLoading(true);
    const professional = dietitians.find((pro) => pro.user_id === user.id);
    if (!professional) {
      const { data: insertProData, error: insertProError } = await supabase
        .from("dietitian")
        .insert([
          {
            user_id: user.id,
            professionalstatus_id: 1,
            qualification: professionalInputs.qualification.value,
            yearsofexperience: professionalInputs.yearsofexperience.value,
          },
        ])
        .select();
      if (insertProError) {
        ProfileAlert("Error", insertProError.message);
        return;
      }
      if (insertProData.length > 0) {
        addDietitian(insertProData[0]);
        setUser({
          qualification: professionalInputs.qualification.value,
          yearsofexperience: professionalInputs.yearsofexperience.value,
        });
      }
    } else {
      const { data: updateProData, error: updateProError } = await supabase
        .from("dietitian")
        .update({
          qualification: professionalInputs.qualification.value,
          yearsofexperience: professionalInputs.yearsofexperience.value,
        })
        .eq("user_id", user.id)
        .select();
      if (updateProError) {
        ProfileAlert("Error", updateProError.message);
        return;
      }
      if (updateProData.length > 0) {
        updateDietitian(updateProData[0]);
        setUser({
          qualification: professionalInputs.qualification.value,
          yearsofexperience: professionalInputs.yearsofexperience.value,
        });
      }
    }
    setIsLoading(false);
  }

  async function updateProfileHandler() {
    setIsLoading(true);
    if (!user?.id) return;
    const avatar = await uploadImage();
    if (
      !user.avatarurl &&
      !user.username &&
      !user.firstname &&
      !user.lastname &&
      !user.biography &&
      !user.dob
    ) {
      const { data: createProfileData, error: createProfileError } =
        await supabase
          .from("profile")
          .insert([
            {
              user_id: user.id,
              username: inputs.username.value,
              biography: inputs.biography.value,
              avatarurl: avatar,
            },
          ])
          .select();

      if (createProfileError) {
        ProfileAlert("Error Creating Profile", createProfileError.message);
        setIsLoading(false);
        return;
      }

      setUser(createProfileData[0]);
    } else {
      const { data: updateProfileData, error: updateProfileError } =
        await supabase
          .from("profile")
          .update({
            username: inputs.username.value,
            biography: inputs.biography.value,
            avatarurl: avatar,
          })
          .eq("user_id", user.id)
          .select();

      if (updateProfileError) {
        ProfileAlert("Error Updating Profile", updateProfileError.message);
        setIsLoading(false);
        return;
      }

      setUser(updateProfileData[0]);
      setIsLoading(false);
    }
  }

  useEffect(() => {});

  function confirmStatusChange(status: ProfessionalStatus) {
    if (isWeb) changeStatus(status);
    Alert.alert(
      "Confirm role change",
      "Are you sure you want to change the user's role?",
      [
        {
          text: "Confirm",
          style: "default",
          onPress: () => changeStatus(status),
        },
        {
          text: "Cancel",
          style: "destructive",
        },
      ]
    );
  }

  async function changeStatus(newStatus: ProfessionalStatus) {
    if (!user || !user.role) return;
    const table = user.role.toLowerCase();
    const { data: updateStatusData, error: updateStatusError } = await supabase
      .from(table)
      .update({
        professionalstatus_id: newStatus.professionalstatus_id,
      })
      .eq("user_id", user.id)
      .select("*");

    if (updateStatusError) return;

    if (updateStatusData.length > 0) {
      updateDietitian(updateStatusData[0]);
      setUser({ status: newStatus.status });
    }
    setSelectedStatus(newStatus);
    ProfileAlert(
      "Status updated",
      "Your professional status has been updated."
    );
  }

  function confirmDeleteAccount() {
    if (isWeb) deleteAccount();
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "default",
        },
        {
          text: "Confirm",
          style: "destructive",
          onPress: () => deleteAccount(),
        },
      ]
    );
  }
  async function deleteAccount() {
    if (!user?.id) return;
    const secret =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxbnp6ZGhmcWNzbWRjdWVicml5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTY2ODU3NSwiZXhwIjoyMDI1MjQ0NTc1fQ.wYRnphcUXedgH4TRjRegY0-tDF06W1w7AASL_bEaZX0";
    const url = "https://hqnzzdhfqcsmdcuebriy.supabase.co";
    const adminSupaBase = createClient(url, secret, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    const { error } = await adminSupaBase.auth.admin.deleteUser(user.id);
    // const { error } = await supabase.functions.invoke("deleteuser", {
    //   body: { id: user.id },
    // });
    if (error) {
      ProfileAlert("Error", error.message);
      return;
    }
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("session");
    setUser(null);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 10,
    },
    statusContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    statusTitle: {
      fontSize: 20,
      fontWeight: "bold",
    },
    statusPendingContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
    },
    statusPendingText: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: "bold",
    },
    placeholder: {
      width: 200,
      height: 200,
      backgroundColor: "#e1e1e1",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 100,
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    inputContainer: {
      marginVertical: 5,
      width: isWeb ? "25%" : "100%",
      alignItems: "center",
    },
    button: {
      marginHorizontal: 5,
    },
    buttonContainer: {
      paddingVertical: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    cancelButton: {
      backgroundColor: theme.colors.senary,
    },
    deleteButton: {
      backgroundColor: theme.colors.error,
    },
    pressable: {
      paddingVertical: 20,
    },
    pressed: {
      opacity: isEditing ? 0.5 : 1,
    },
    scrollViewContainer: {
      flex: 1,
      width: "100%",
    },
    scrollViewContent: {
      alignItems: "center",
    },
    detailsSection: {
      flexDirection: "row",
      // justifyContent: "space-between",
      // alignItems: "center",
      width: isWeb ? "25%" : "100%",
    },
    details: {
      padding: 5,
      backgroundColor: theme.colors.senary,
      borderColor: theme.colors.secondary,
      borderWidth: 1,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 125,
      marginHorizontal: 5,
    },
    horizontalScrollView: {
      // width: isWeb ? "100%" : "100%",
      // backgroundColor: "red",
      minHeight: 40,
      maxHeight: 40,
    },
    horizontalScrollViewContent: {
      // flexDirection: "row",
      // alignItems: "center",
      // justifyContent: "flex-start", // Align items to the left
      // flexGrow: 1,
      // backgroundColor: "blue",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.scrollViewContainer}>
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={styles.scrollViewContent}
        >
          {isProfessional && isApproved && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>Select your Status</Text>
              <StatusList
                onPress={confirmStatusChange}
                statuses={professionalStatuses}
                selectedStatus={selectedStatus}
              />
            </View>
          )}
          <Pressable
            onPress={pickImage}
            style={({ pressed }) => [
              styles.pressable,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.placeholder}>
              <Image
                source={
                  selectedImage?.uri
                    ? { uri: selectedImage?.uri }
                    : user?.avatarurl
                    ? { uri: user?.avatarurl }
                    : require("../../../assets/Profile.png")
                }
                style={styles.image}
              />
            </View>
          </Pressable>
          {user?.approvedstatus_id !== 2 && (
            <View style={styles.statusPendingContainer}>
              {user?.approvedstatus_id === 1 && (
                <Text style={styles.statusPendingText}>
                  Your request is pending!
                </Text>
              )}
              {user?.approvedstatus_id === 3 && (
                <Text style={styles.statusPendingText}>
                  Your request was declined!
                </Text>
              )}
            </View>
          )}
          <ScrollView
            horizontal
            style={styles.horizontalScrollView}
            contentContainerStyle={styles.horizontalScrollViewContent}
          >
            <View style={styles.details}>
              <Text>Follows: {user?.totalfollowers}</Text>
            </View>
            <View style={styles.details}>
              <Text>Followings: {user?.totalfollowings}</Text>
            </View>
            <View style={styles.details}>
              <Text>Threads: {threads}</Text>
            </View>
            <View style={styles.details}>
              <Text>Posts: {posts}</Text>
            </View>
            <View style={styles.details}>
              <Text>Workouts: {workoutsCompleted}</Text>
            </View>
            <View style={styles.details}>
              <Text>Meals: {mealsCompleted}</Text>
            </View>
            <View style={styles.details}>
              <Text>Total Steps: {totalSteps}</Text>
            </View>
            <View style={styles.details}>
              <Text>Total Water: {totalWater}</Text>
            </View>
          </ScrollView>

          <View style={styles.inputContainer}>
            <Input
              disabled={!isEditing}
              isValid={inputs.username.isValid}
              keyboardType="default"
              placeholder={"Username"}
              value={inputs.username.value}
              onUpdateValue={(value: any) =>
                updateInputValueHandler("username", value)
              }
              icon={"at"}
            />
          </View>
          <View style={styles.inputContainer}>
            <Input
              disabled={!isEditing}
              isValid={true}
              keyboardType="default"
              placeholder={"Biography"}
              multiLine={true}
              inputStyle={{ height: 100 }}
              value={inputs.biography.value}
              onUpdateValue={(value: any) =>
                updateInputValueHandler("biography", value)
              }
              icon={"book-outline"}
            />
          </View>
          {isProfessional && (
            <ProfessionalProfile
              inputs={professionalInputs}
              onUpdateValue={updateProfessionalInputValueHandler}
              isEditing={isEditing}
            />
          )}
          <View style={styles.buttonContainer}>
            {!isEditing ? (
              <Button disable={isLoading} onPress={toggleEdit}>
                {isLoading ? (
                  <ActivityIndicator
                    color={theme.colors.senary}
                    size={"small"}
                  />
                ) : (
                  "Edit"
                )}
              </Button>
            ) : (
              <>
                <Button
                  style={[styles.cancelButton, styles.button]}
                  onPress={toggleCancel}
                >
                  Cancel
                </Button>
                <Button style={styles.button} onPress={toggleConfirm}>
                  Save
                </Button>
              </>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              disable={!isEditing}
              style={styles.deleteButton}
              onPress={confirmDeleteAccount}
            >
              Delete Account
            </Button>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
