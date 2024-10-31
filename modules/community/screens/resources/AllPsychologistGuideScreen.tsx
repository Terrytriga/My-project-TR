import { StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";
import { usePsychologistGuideStore } from "../../../../store/CommunityStore";
import GuideList from "../../components/resources/GuideList";

export default function AllPsychologistGuideScreen() {
  const { psychologistGuides } = usePsychologistGuideStore();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: psychologistGuides.length === 0 ? "center" : undefined,
    },
  });
  return (
    <View style={styles.container}>
      {psychologistGuides.length > 0 ? (
        <GuideList type="psychologist" guideList={psychologistGuides} />
      ) : (
        <Text>No Guides</Text>
      )}
    </View>
  );
}
