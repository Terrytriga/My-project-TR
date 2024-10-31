import { StyleSheet, View } from "react-native";
import { useDietitianGuideStore } from "../../../../store/CommunityStore";
import GuideList from "../../components/resources/GuideList";

export default function AllDietitianGuideScreen() {
  const { dietitianGuides } = useDietitianGuideStore();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
    },
  });
  return (
    <View style={styles.container}>
      <GuideList type="dietitian" guideList={dietitianGuides} />
    </View>
  );
}
