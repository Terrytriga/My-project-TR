import { useTheme } from "@rneui/themed";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GoalScreen from "../../assessment/screens/GoalScreen";
import MoodScreen from "../../assessment/screens/MoodScreen";
import ProfessionalHelpScreen from "../../assessment/screens/ProfessionalHelpScreen";
import SleepQualityScreen from "../../assessment/screens/SleepQualityScreen";
import TakingMedicationScreen from "../../assessment/screens/TakingMedicationScreen";
import SelectMedicationScreen from "../../assessment/screens/SelectMedicationScreen";
import MentalHealthSymptomScreen from "../../assessment/screens/MentalHealthSymptomScreen";
import StressLevelScreen from "../../assessment/screens/StressLevelScreen";
import PhysicalDistressScreen from "../../assessment/screens/PhysicalDistressScreen";
import BMIScreen from "../../assessment/screens/BMIScreen";
import MenstruationScreen from "../../assessment/screens/MenstruationScreen";

const Stack = createNativeStackNavigator();

/* 
----------------------------------------------------
Assessment Stack
---------------------------------------------------- 
*/

export default function AssessmentStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: "Assessment",
        headerStyle: { backgroundColor: "transparent" },
        headerTintColor: theme.colors.black,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
      initialRouteName="Goals"
    >
      <Stack.Screen name="Goals" component={GoalScreen} />
      <Stack.Screen name="Moods" component={MoodScreen} />
      <Stack.Screen name="BMI" component={BMIScreen} options={{ title: "" }} />
      <Stack.Screen name="Menstruation" component={MenstruationScreen} />
      <Stack.Screen
        name="ProfessionalHelp"
        component={ProfessionalHelpScreen}
      />
      <Stack.Screen
        name="PhysicalDistress"
        component={PhysicalDistressScreen}
      />
      <Stack.Screen name="SleepQuality" component={SleepQualityScreen} />
      <Stack.Screen
        name="TakingMedication"
        component={TakingMedicationScreen}
      />
      <Stack.Screen
        name="SelectMedication"
        component={SelectMedicationScreen}
      />
      <Stack.Screen
        name="MentalHealthSymptoms"
        component={MentalHealthSymptomScreen}
      />
      <Stack.Screen name="StressLevel" component={StressLevelScreen} />
    </Stack.Navigator>
  );
}
