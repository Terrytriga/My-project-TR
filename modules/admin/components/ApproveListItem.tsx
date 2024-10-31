import { Text, useTheme } from "@rneui/themed";
import { Alert, Dimensions, Image, StyleSheet, View } from "react-native";
import { Professional, ProfessionalProfile } from "../../../utils/Types";
import TouchableScale from "react-native-touchable-scale";
import { supabase } from "../../../lib/SupaBase";
import {
  useDietitianStore,
  usePhysioStore,
  usePsychologistStore,
} from "../../../store/UserStore";

const { height, width } = Dimensions.get("window");

interface ApproveListItemProps {
  professionalProfile: ProfessionalProfile;
  type: string;
}

export default function ApproveListItem({
  professionalProfile,
  type,
}: ApproveListItemProps) {
  const { theme } = useTheme();
  const { updateDietitian } = useDietitianStore();
  const { updatePhysician } = usePhysioStore();
  const { updatePsychologist } = usePsychologistStore();

  async function approveRequest() {
    const { data, error } = await supabase
      .from(type.toLowerCase())
      .update({
        approvedstatus_id: 2,
      })
      .eq("user_id", professionalProfile.user_id)
      .select("*")
      .single();
    if (error) {
      ItemAlert("Error", error.message);
    }
    if (type === "Physio") {
      updatePhysician(data as Professional);
    }
    if (type === "Dietitian") {
      updateDietitian(data as Professional);
    }
    if (type === "Psychologist") {
      updatePsychologist(data as Professional);
    }
  }

  async function declineRequest() {
    const { data, error } = await supabase
      .from(type.toLowerCase())
      .update({
        approvedstatus_id: 3,
      })
      .eq("user_id", professionalProfile.user_id)
      .select("*")
      .single();
    if (error) {
      ItemAlert("Error", error.message);
    }
    if (type === "Physio") {
      updatePhysician(data as Professional);
    }
    if (type === "Dietitian") {
      updateDietitian(data as Professional);
    }
    if (type === "Psychologist") {
      updatePsychologist(data as Professional);
    }
  }

  function confirmApproval() {
    Alert.alert(
      "Approve or Decline",
      "This will approve or decline the professional's request.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Decline",
          onPress: () => declineRequest(),
          style: "destructive",
        },
        {
          text: "Approve",
          onPress: () => approveRequest(),
          style: "default",
        },
      ]
    );
  }

  function ItemAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "ok", style: "default" }]);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      maxHeight: height / 5,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 10,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginHorizontal: 10,
    },
    textContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      marginLeft: 15,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    date: {
      fontSize: 12,
    },
    followsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
  });

  return (
    <TouchableScale
      friction={90}
      tension={100}
      activeScale={0.85}
      style={styles.container}
      onPress={confirmApproval}
    >
      <Image
        style={styles.image}
        source={
          professionalProfile.avatarurl
            ? { uri: professionalProfile.avatarurl }
            : require("../../../assets/Profile.png")
        }
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {professionalProfile.firstname} {professionalProfile.lastname}
        </Text>
        <View style={styles.followsContainer}>
          <Text>Qualification: {professionalProfile.qualification}</Text>
          <Text>
            Years of Experience: {professionalProfile.yearsofexperience}
          </Text>
        </View>
      </View>
    </TouchableScale>
  );
}
