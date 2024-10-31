import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "@rneui/themed";
import {
  useDietitianGuideStore,
  usePhysioGuideStore,
  usePsychologistGuideStore,
} from "../../../../store/CommunityStore";
import GuideList from "../../components/resources/GuideList";
import GuideTypeList from "../../components/resources/GuideTypeList";
import { useEffect, useState } from "react";
import { Guide } from "../../../../utils/Types";
import Input from "../../../shared/components/Input";

const guideTypes = ["Dietitian", "Physio", "Psychologist"];

export default function GuideScreen() {
  const { theme } = useTheme();
  const { physioGuides } = usePhysioGuideStore();
  const { psychologistGuides } = usePsychologistGuideStore();
  const { dietitianGuides } = useDietitianGuideStore();

  const [selectedType, setSelectedType] = useState<string>(guideTypes[0]);
  const [guideList, setGuideList] = useState<Guide[]>(physioGuides);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    if (searchText.length > 0) {
      if (selectedType === "Dietitian") {
        setGuideList(
          dietitianGuides.filter((guide) => {
            return guide.title
              .toLowerCase()
              .includes(searchText.toLocaleLowerCase());
          })
        );
      }
      if (selectedType === "Physio") {
        setGuideList(
          physioGuides.filter((guide) => {
            return guide.title
              .toLowerCase()
              .includes(searchText.toLocaleLowerCase());
          })
        );
      }
      if (selectedType === "Psychologist") {
        setGuideList(
          psychologistGuides.filter((guide) => {
            return guide.title
              .toLowerCase()
              .includes(searchText.toLocaleLowerCase());
          })
        );
      }
    } else {
      if (selectedType === "Dietitian") {
        setGuideList(dietitianGuides);
      }
      if (selectedType === "Physio") {
        setGuideList(physioGuides);
      }
      if (selectedType === "Psychologist") {
        setGuideList(psychologistGuides);
      }
    }
  }, [selectedType, searchText]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
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
      width: "100%",
      alignItems: "flex-start",
      paddingHorizontal: 15,
      alignSelf: "flex-start",
    },
  });

  return (
    <View style={styles.container}>
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
      <GuideTypeList
        guideTypes={guideTypes}
        selectedType={selectedType}
        onPress={setSelectedType}
      />
      <View style={{ flex: 1, justifyContent: "center" }}>
        {physioGuides.length > 0 ? (
          <GuideList type="physio" guideList={guideList} />
        ) : (
          <Text>No Guides</Text>
        )}
      </View>
    </View>
  );
}
