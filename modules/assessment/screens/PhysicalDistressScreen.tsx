import { Text, useTheme } from "@rneui/themed";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { useNewAssessmentStore } from "../../../store/AssessmentStore";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AssessmentStackRoutes } from "../../navigation/Routes";
import { Feather } from "@expo/vector-icons";
import Button from "../../shared/components/Button";

export default function PhysicalDistressScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const [selectedDistress, setSelectedDistress] = useState<boolean>(false);
  const { setPhysicalDistress, physicalDistress, user } =
    useNewAssessmentStore();

  const route =
    useRoute<RouteProp<AssessmentStackRoutes, "PhysicalDistress">>();
  const user_id = route.params.user_id;

  const navigation =
    useNavigation<NativeStackNavigationProp<AssessmentStackRoutes>>();

  useLayoutEffect(() => {
    const currentCount = user?.gender === "Female" ? 5 : 4;
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
    if (!user_id || !physicalDistress) return;
    setSelectedDistress(physicalDistress.answer);
  }, [physicalDistress, navigation]);

  function toggleDistress() {
    setSelectedDistress(!selectedDistress);
  }

  function submitHandler() {
    if (!user_id) return;

    setPhysicalDistress({
      user_id: user_id,
      answer: selectedDistress,
      datecreated: new Date(),
    });
    navigation.navigate("SleepQuality", { user_id: user_id });
  }

  function skip() {
    navigation.navigate("SleepQuality", { user_id: user_id });
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
    distressContainer: {
      flexDirection: "column",
      padding: 40,
      margin: 10,
      borderRadius: 20,
    },
    yesContainer: {
      backgroundColor: selectedDistress
        ? theme.colors.primary
        : theme.colors.senary,
    },
    noContainer: {
      backgroundColor: !selectedDistress
        ? theme.colors.primary
        : theme.colors.senary,
    },
    distressIconContainer: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 24,
      backgroundColor: theme.colors.background,
      width: 48,
      height: 48,
    },
    distressTitleHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginVertical: 10,
    },
    distressTitle: {
      fontSize: 20,
      fontWeight: "bold",
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
    pressed: {
      opacity: 0.5,
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Are you experiencing any physical distress?
      </Text>
      <View style={{ flex: 1 }}>
        <Pressable
          onPress={toggleDistress}
          style={({ pressed }) => [
            styles.yesContainer,
            styles.distressContainer,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.distressIconContainer}>
            <Feather name="check" size={24} color={theme.colors.black} />
          </View>
          <View style={styles.distressTitleHeader}>
            <Text style={styles.distressTitle}>Yes, one or multiple</Text>
            {selectedDistress ? (
              <Feather
                name="check-circle"
                size={24}
                color={theme.colors.black}
              />
            ) : (
              <Feather name="circle" size={24} color={theme.colors.primary} />
            )}
          </View>
          <Text>
            I'm experiencing physical pain in different places over my body
          </Text>
        </Pressable>
        <Pressable
          onPress={toggleDistress}
          style={({ pressed }) => [
            styles.noContainer,
            styles.distressContainer,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.distressIconContainer}>
            <Feather name="x" size={24} color={theme.colors.black} />
          </View>
          <View style={styles.distressTitleHeader}>
            <Text style={styles.distressTitle}>No, physical pain at all</Text>
            {!selectedDistress ? (
              <Feather
                name="check-circle"
                size={24}
                color={theme.colors.black}
              />
            ) : (
              <Feather name="circle" size={24} color={theme.colors.primary} />
            )}
          </View>
          <Text>
            I'm not experiencing any physical pain in my body at all :)
          </Text>
        </Pressable>
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
