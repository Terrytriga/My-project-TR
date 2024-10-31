import { Text, useTheme } from "@rneui/themed";
import { Dimensions, Image, Platform, StyleSheet, View } from "react-native";
import { useNewAssessmentStore } from "../../../store/AssessmentStore";
import { useEffect, useLayoutEffect, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AssessmentStackRoutes } from "../../navigation/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../shared/components/Button";

const { width, height } = Dimensions.get("window");
const aspect = 12 / 10;

export default function ProfessionalHelpScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const [selectedHelp, setSelectedHelp] = useState<boolean>(false);

  const { setProfessionalHelp, professionalHelp, user } =
    useNewAssessmentStore();
  const route =
    useRoute<RouteProp<AssessmentStackRoutes, "ProfessionalHelp">>();

  const user_id = route.params.user_id;

  const navigation =
    useNavigation<NativeStackNavigationProp<AssessmentStackRoutes>>();

  useLayoutEffect(() => {
    const currentCount = user?.gender === "Female" ? 4 : 3;
    const totalCount = user?.gender === "Female" ? 10 : 9;
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={styles.headerContainer}>
            <Text>
              {currentCount} OF {totalCount}
            </Text>
          </View>
        );
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (!user_id || !professionalHelp) return;
    setSelectedHelp(professionalHelp.answer);
  }, [navigation]);

  function toggleHandler() {
    setSelectedHelp(!selectedHelp);
  }

  function submitHandler() {
    if (!user_id) return;
    setProfessionalHelp({
      user_id: user_id,
      answer: selectedHelp,
      datecreated: new Date(),
    });
    navigation.navigate("PhysicalDistress", { user_id: user_id });
  }
  function skip() {
    navigation.navigate("PhysicalDistress", { user_id: user_id });
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingBottom: 20,
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 20,
      marginHorizontal: 20,
    },
    headerContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.primary,
      padding: 10,
      borderRadius: 20,
    },
    helpContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: !isWeb ? "100%" : "50%",
      paddingHorizontal: 20,
      flex: 1,
    },
    button: {
      paddingVertical: 20,
      borderRadius: 30,
    },
    yesButton: {
      backgroundColor: selectedHelp
        ? theme.colors.primary
        : theme.colors.senary,
      borderWidth: selectedHelp ? 1 : 0,
      borderColor: selectedHelp ? theme.colors.secondary : undefined,
    },
    noButton: {
      backgroundColor: !selectedHelp
        ? theme.colors.primary
        : theme.colors.senary,
      borderWidth: !selectedHelp ? 1 : 0,
      borderColor: !selectedHelp ? theme.colors.secondary : undefined,
    },
    image: {
      width: Platform.OS !== "web" ? width : width / 3,
      height: Platform.OS !== "web" ? width / aspect : width / 3 / aspect,
    },
    skipButton: {
      backgroundColor: theme.colors.senary,
    },
    buttonContainer: {
      justifyContent: "space-between",
      width: !isWeb ? "100%" : "50%",
      flexDirection: "row",
      paddingHorizontal: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Have you sought professional help before?
      </Text>
      <Image
        style={styles.image}
        source={require("../assets/ProfessionalHelp.jpg")}
      />
      <View style={styles.helpContainer}>
        <Button
          onPress={toggleHandler}
          style={[styles.button, styles.yesButton]}
        >
          Yes
        </Button>
        <Button
          onPress={toggleHandler}
          style={[styles.button, styles.noButton]}
        >
          No
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.skipButton} onPress={skip}>
          Skip
        </Button>
        <Button onPress={submitHandler}>Continue</Button>
      </View>
    </View>
  );
}
