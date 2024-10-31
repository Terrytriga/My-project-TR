import { Text, useTheme } from "@rneui/themed";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { usePhysioGuideStore } from "../../../../store/CommunityStore";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { PhysioGuideStack } from "../../../navigation/Routes";
import { formatDate } from "../../../../utils/FormatDate";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../../lib/SupaBase";
import { useUserStore } from "../../../../store/UserStore";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";

const { width } = Dimensions.get("window");
const aspect = 16 / 9;

export default function ViewPhysioGuideScreen() {
  const isWeb = Platform.OS === "web";
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { theme } = useTheme();
  const { physioGuides, deleteGuide } = usePhysioGuideStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioGuideStack>>();
  const route = useRoute<RouteProp<PhysioGuideStack, "ViewPhysioGuides">>();
  const id = route.params.id;
  const guide = physioGuides.find((guide) => guide.id === id);

  function navigationEditMealHandler() {
    navigation.navigate("EditPhysioGuides", { id });
  }

  function confirmDeleteGuide() {
    if (isWeb) deleteTheGuide();
    Alert.alert("Delete Guide", "Are you sure you want to delete this guide?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => deleteTheGuide(),
      },
    ]);
  }
  async function deleteTheGuide() {
    if (!user) return;
    setIsLoading(true);
    const { error: deleteGuideError } = await supabase
      .from("physioguide")
      .delete()
      .eq("id", id);
    if (deleteGuideError) {
      GuideAlert("Error", deleteGuideError.message);
      return;
    }

    const index = physioGuides
      .filter((guide) => guide.user_id === user?.id)
      .sort(
        (a, b) =>
          new Date(a.datecreated).getTime() - new Date(b.datecreated).getTime()
      )
      .findIndex((guide) => guide.id === id);

    const { error: removeError } = await supabase.storage
      .from("Public")
      .remove([`Guides/Physio/${user.id}-GuideID-${index + 1}`]);

    if (removeError) {
      GuideAlert("Error", removeError.message);
      return;
    }
    deleteGuide(id);
    GuideAlert("Success", "Guide deleted successfully!");
    navigation.navigate("PhysioGuides");
    setIsLoading(false);
  }

  function GuideAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "OK",
        style: "cancel",
      },
    ]);
  }

  useLayoutEffect(() => {
    if (!guide) return;
    navigation.setOptions({
      title: guide?.title,
      headerRight: () => {
        return (
          <View style={styles.iconRow}>
            <Pressable
              style={({ pressed }) => [
                pressed && styles.pressed,
                styles.iconPressable,
              ]}
              onPress={navigationEditMealHandler}
            >
              <Ionicons name="pencil" size={24} color={theme.colors.primary} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.iconPressable,
                pressed && styles.pressed,
              ]}
              onPress={confirmDeleteGuide}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
        );
      },
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
      paddingHorizontal: !isWeb ? 10 : 40,
    },
    textDescription: {
      paddingHorizontal: 10,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    iconRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      width: 100,
    },
    iconPressable: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      width: 36,
      height: 36,
      marginHorizontal: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    pressed: {
      opacity: 0.5,
    },
  });
  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : (
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
