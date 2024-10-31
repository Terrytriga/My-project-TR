import { Text, useTheme } from "@rneui/themed";
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import {
  useDietitianGuideStore,
  usePhysioGuideStore,
  usePsychologistGuideStore,
} from "../../../../store/CommunityStore";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  DietitianGuideStack,
  ResourcesGuideStackRoutes,
} from "../../../navigation/Routes";
import { formatDate } from "../../../../utils/FormatDate";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Guide } from "../../../../utils/Types";

const { width } = Dimensions.get("window");
const aspect = 16 / 9;
export default function ViewGuideScreen() {
  const { dietitianGuides } = useDietitianGuideStore();
  const { physioGuides } = usePhysioGuideStore();
  const { psychologistGuides } = usePsychologistGuideStore();

  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianGuideStack>>();
  const route = useRoute<RouteProp<ResourcesGuideStackRoutes, "ViewGuide">>();
  const id = route.params.id;
  const type = route.params.type;
  const [guide, setGuide] = useState<Guide>();

  useEffect(() => {
    if (type === "dietitian") {
      setGuide(dietitianGuides.find((guide) => guide.id === id));
    }
    if (type === "physio") {
      setGuide(physioGuides.find((guide) => guide.id === id));
    }
    if (type === "psychologist") {
      setGuide(psychologistGuides.find((guide) => guide.id === id));
    }
  }, [id, type]);

  useLayoutEffect(() => {
    if (!guide) return;
    navigation.setOptions({
      title: guide?.title,
    });
  }, [navigation, route, guide?.title]);

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      paddingBottom: 20,
    },
    icon: {
      marginRight: 5,
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
    },
    date: {
      fontSize: 15,
      marginBottom: 10,
      color: theme.colors.primary,
    },
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      backgroundColor: theme.colors.primary,
      padding: 10,
      marginBottom: 25,
    },
    image: {
      width: width * 0.9,
      height: (width * 0.9) / aspect,
    },
    textContent: {
      paddingHorizontal: 10,
    },
    textDescription: {
      paddingHorizontal: 10,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
  });
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.dateContainer}>
        <Ionicons
          style={styles.icon}
          name="ellipse-sharp"
          size={16}
          color={theme.colors.primary}
        />
        <Text>
          Published On{" "}
          {formatDate(
            guide?.datecreated ? new Date(guide.datecreated) : new Date()
          )}
        </Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={
            guide
              ? { uri: guide.pictureurl }
              : require("../../../../assets/Meal.png")
          }
        />
      </View>
      <Text style={styles.textDescription}>{guide?.description}</Text>
      <Text style={styles.textContent}>{guide?.content}</Text>
    </ScrollView>
  );
}
