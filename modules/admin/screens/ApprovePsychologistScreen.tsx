import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import {
  useProfileStore,
  usePsychologistStore,
} from "../../../store/UserStore";
import { ProfessionalProfile } from "../../../utils/Types";
import ApproveList from "../components/ApproveList";

export default function ApprovePsychologistScreen() {
  const { profiles } = useProfileStore();
  const { psychologists } = usePsychologistStore();

  const professionalProfiles = psychologists
    .filter((psychologist) => psychologist.approvedstatus_id === 1)
    .map((psychologist) => {
      const profile = profiles?.find(
        (profile) => profile.user_id === psychologist.user_id
      );
      if (!profile) return null;
      return {
        user_id: psychologist.user_id,
        firstname: profile.firstname,
        lastname: profile.lastname,
        avatarurl: profile.avatarurl,
        qualification: psychologist.qualification,
        yearsofexperience: psychologist.yearsofexperience,
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
          type="Psychologist"
        />
      ) : (
        <Text>No Psychologist requests.</Text>
      )}
    </View>
  );
}
