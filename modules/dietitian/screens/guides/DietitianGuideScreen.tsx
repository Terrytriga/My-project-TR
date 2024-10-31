import { Text, useTheme } from "@rneui/themed";
import { StyleSheet, View } from "react-native";
import GuideList from "../../components/guides/GuideList";
import { useDietitianGuideStore } from "../../../../store/CommunityStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianGuideStack } from "../../../navigation/Routes";
import FloatingButton from "../../../shared/components/FloatingButton";
import { useUserStore } from "../../../../store/UserStore";
import { useEffect, useState } from "react";
import { Guide } from "../../../../utils/Types";
import AddButton from "../../../shared/components/AddButton";
import Input from "../../../shared/components/Input";

export default function DietitianGuideScreen() {
  const { theme } = useTheme();
  const { user } = useUserStore();
  const { dietitianGuides } = useDietitianGuideStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianGuideStack>>();
  function navigationHandler() {
    navigation.navigate("AddDietitianGuide");
  }
  const [guides, setGuides] = useState<Guide[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    if (searchText.length > 0) {
      setGuides(
        dietitianGuides.filter((guide) => {
          return (
            guide.title
              .toLowerCase()
              .includes(searchText.toLocaleLowerCase()) &&
            guide.user_id === user?.id
          );
        })
      );
    } else {
      setGuides(dietitianGuides.filter((guide) => guide.user_id === user?.id));
    }
  }, [dietitianGuides]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      // justifyContent: dietitianGuides.length === 0 ? "center" : undefined,
    },
    input: {
      flexDirection: "row",
      width: "100%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 25,
      borderColor: theme.colors.primary,
    },
    inputContainer: {
      marginTop: 5,
      width: "75%",
      alignItems: "flex-start",
      paddingHorizontal: 15,
      alignSelf: "flex-start",
    },
  });

  return (
    <View style={styles.container}>
      <AddButton onPress={() => navigationHandler()}>Guide</AddButton>
      <View style={styles.inputContainer}>
        <Input
          containerStyle={styles.input}
          placeholder={"Search..."}
          icon={"search-outline"}
          secure={false}
          keyboardType={"default"}
          value={searchText}
          onUpdateValue={(value: string) => setSearchText(value)}
          isValid={true}
          popup={false}
        />
      </View>

      {dietitianGuides.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>No Guides!</Text>
        </View>
      ) : (
        <GuideList guideList={guides} />
      )}
    </View>
  );
}
