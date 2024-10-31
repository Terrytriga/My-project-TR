import { Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import GuideList from "../../components/guides/GuideList";
import {
  useDietitianGuideStore,
  usePhysioGuideStore,
} from "../../../../store/CommunityStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  DietitianGuideStack,
  PhysioGuideStack,
} from "../../../navigation/Routes";
import FloatingButton from "../../../shared/components/FloatingButton";
import { useUserStore } from "../../../../store/UserStore";
import { useEffect, useLayoutEffect, useState } from "react";
import { Guide } from "../../../../utils/Types";
import AddButtonHeader from "../../../shared/components/AddButtonHeader";

export default function PhysioGuideScreen() {
  const { user } = useUserStore();
  const { physioGuides } = usePhysioGuideStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioGuideStack>>();
  function navigationHandler() {
    navigation.navigate("AddPhysioGuides");
  }
  const [guides, setGuides] = useState<Guide[]>([]);
  useEffect(() => {
    setGuides(physioGuides.filter((guide) => guide.user_id === user?.id));
  }, [physioGuides]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AddButtonHeader onPress={navigationHandler}>Add</AddButtonHeader>
      ),
      headerShown: true,
      title: "",
    });
  }, [navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: physioGuides.length === 0 ? "center" : undefined,
    },
  });

  return (
    <View style={styles.container}>
      {physioGuides.length === 0 ? (
        <Text>No Guides!</Text>
      ) : (
        <GuideList guideList={guides} />
      )}
    </View>
  );
}
