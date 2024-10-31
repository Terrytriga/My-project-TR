import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import { useDietitianStore, useProfileStore } from "../../../store/UserStore";
import { ProfessionalProfile } from "../../../utils/Types";
import ApproveList from "../components/ApproveList";

export default function ApproveDietitianScreen() {
  const { profiles } = useProfileStore();
  const { dietitians } = useDietitianStore();

  const professionalProfiles = dietitians
    .filter((dietitian) => dietitian.approvedstatus_id === 1)
    .map((dietitian) => {
      const profile = profiles?.find(
        (profile) => profile.user_id === dietitian.user_id
      );
      if (!profile) return null;
      return {
        user_id: dietitian.user_id,
        firstname: profile.firstname,
        lastname: profile.lastname,
        avatarurl: profile.avatarurl,
        qualification: dietitian.qualification,
        yearsofexperience: dietitian.yearsofexperience,
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
          type="Dietitian"
        />
      ) : (
        <Text>No dietitians requests.</Text>
      )}
    </View>
  );
}
