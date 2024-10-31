import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { usePhysioStore, useProfileStore } from "../../../store/UserStore";
import ApproveList from "../components/ApproveList";
import { ProfessionalProfile } from "../../../utils/Types";

export default function ApprovePhysioScreen() {
  const { profiles } = useProfileStore();
  const { physicians } = usePhysioStore();

  const professionalProfiles = physicians
    .filter((physician) => physician.approvedstatus_id === 1)
    .map((physician) => {
      const profile = profiles?.find(
        (profile) => profile.user_id === physician.user_id
      );
      if (!profile) return null;
      return {
        user_id: physician.user_id,
        firstname: profile.firstname,
        lastname: profile.lastname,
        avatarurl: profile.avatarurl,
        qualification: physician.qualification,
        yearsofexperience: physician.yearsofexperience,
      };
    })
    .filter((profile): profile is ProfessionalProfile => profile !== null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: professionalProfiles.length === 0 ? "center" : undefined,
      alignItems: "center",
    },
  });
  return (
    <View style={styles.container}>
      {professionalProfiles.length !== 0 ? (
        <ApproveList
          professionalProfiles={professionalProfiles}
          type="Physio"
        />
      ) : (
        <Text>No Physician requests.</Text>
      )}
    </View>
  );
}
