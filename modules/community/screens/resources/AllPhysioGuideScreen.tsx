import { StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";
import { usePhysioGuideStore } from "../../../../store/CommunityStore";
import GuideList from "../../components/resources/GuideList";

export default function AllPhysioGuideScreen() {
  const { physioGuides } = usePhysioGuideStore();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: physioGuides.length === 0 ? "center" : undefined,
    },
  });
  return (
    <View style={styles.container}>
      {physioGuides.length > 0 ? (
        <GuideList type="physio" guideList={physioGuides} />
      ) : (
        <Text>No Guides</Text>
      )}
    </View>
  );
}
