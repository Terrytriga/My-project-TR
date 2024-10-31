import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Text, useTheme } from "@rneui/themed";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { MealPlanStackRoutes } from "../../navigation/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  useFoodStore,
  useMealFoodStore,
  useMealInstructionStore,
  useMealPlanStore,
  useNutritionalFactStore,
} from "../../../store/MealStore";
import {
  Food,
  MealInstruction,
  MealNutrition,
  NutritionalFact,
} from "../../../utils/Types";
import Button from "../../shared/components/Button";
import { useUserStore } from "../../../store/UserStore";
import { supabase } from "../../../lib/SupaBase";
import NutrionalList from "../components/NutritionalList";
import { formatDate } from "../../../utils/FormatDate";

const { width, height } = Dimensions.get("window");
const aspect = width / height;

export default function MealScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { mealInstructions } = useMealInstructionStore();
  const { foods } = useFoodStore();
  const { mealFoods } = useMealFoodStore();
  const { nutritionalFacts } = useNutritionalFactStore();
  const { user } = useUserStore();
  const { addMealPlan, deleteMealPlan } = useMealPlanStore();

  const route = useRoute<RouteProp<MealPlanStackRoutes, "Meal">>();
  const meal = route.params.meal;
  const date = route.params.date;
  const mealplan_id = route.params?.mealplan_id;

  const navigation =
    useNavigation<NativeStackNavigationProp<MealPlanStackRoutes>>();

  const [instructions, setInstructions] = useState<MealInstruction[]>([]);
  const [foodsInMeal, setFoodsInMeal] = useState<Food[]>([]);
  const [mealNutrition, setMealNutrition] = useState<MealNutrition>({
    totalcarbs: 0,
    calcium: 0,
    cholesterol: 0,
    dietaryfiber: 0,
    saturatedfat: 0,
    polyunsaturatedfat: 0,
    monounsaturatedfat: 0,
    transfat: 0,
    totalfat: 0,
    iron: 0,
    potassium: 0,
    protein: 0,
    sugar: 0,
    sodium: 0,
    vitamina: 0,
    vitaminc: 0,
  });

  useEffect(() => {
    if (!nutritionalFacts || !foodsInMeal) return;
    const accumulatedNutrition = nutritionalFacts
      .filter((nf) => foodsInMeal.find((food) => food.food_id === nf.food_id))
      .reduce(
        (acc, nf) => {
          acc.totalcarbs += nf.totalcarbs;
          acc.calcium += nf.calcium;
          acc.cholesterol += nf.cholesterol;
          acc.dietaryfiber += nf.dietaryfiber;
          acc.saturatedfat += nf.saturatedfat;
          acc.polyunsalturatedfat += nf.polyunsaturatedfat;
          acc.monounsaturatedfat += nf.monounsaturatedfat;
          acc.transfat += nf.transfat;
          acc.totalfat += nf.totalfat;
          acc.iron += nf.iron;
          acc.potassium += nf.potassium;
          acc.protein += nf.protein;
          acc.sugar += nf.sugar;
          acc.sodium += nf.sodium;
          acc.vitamina += nf.vitamina;
          acc.vitaminc += nf.vitaminc;
          return acc;
        },
        {
          totalcarbs: 0,
          calcium: 0,
          cholesterol: 0,
          dietaryfiber: 0,
          saturatedfat: 0,
          polyunsalturatedfat: 0,
          monounsaturatedfat: 0,
          transfat: 0,
          totalfat: 0,
          iron: 0,
          potassium: 0,
          protein: 0,
          sugar: 0,
          sodium: 0,
          vitamina: 0,
          vitaminc: 0,
        }
      );

    setMealNutrition((previous) => ({
      ...previous,
      ...accumulatedNutrition,
    }));
  }, [meal, navigation, foodsInMeal]);

  useEffect(() => {
    setInstructions(
      mealInstructions?.filter((mi) => mi.meal_id === meal?.meal_id) || []
    );
  }, [meal, navigation]);

  useEffect(() => {
    if (!foods || !mealFoods) return;
    setFoodsInMeal(
      foods.filter((food) =>
        mealFoods?.find(
          (mf) => mf.food_id === food.food_id && mf.meal_id === meal?.meal_id
        )
      ) || []
    );
  }, [mealFoods, meal]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: formatDate(new Date(date)),
    });
  }, [navigation, route.params]);

  async function manageMeal() {
    if (!mealplan_id) {
      function appendTimeToDate(
        date: Date,
        hours: number,
        minutes: number
      ): Date {
        const newDate = new Date(date);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        return newDate;
      }
      if (date && user && meal) {
        let mealPlanDate = new Date(date);
        if (meal.mealtype_id === 1)
          mealPlanDate = appendTimeToDate(mealPlanDate, 9, 0);
        if (meal.mealtype_id === 2)
          mealPlanDate = appendTimeToDate(mealPlanDate, 14, 0);
        if (meal.mealtype_id === 3)
          mealPlanDate = appendTimeToDate(mealPlanDate, 20, 0);
        const { data: mealPlanData, error: mealPlanError } = await supabase
          .from("mealplan")
          .insert([
            {
              user_id: user.id,
              meal_id: meal.meal_id,
              mealtime: mealPlanDate,
            },
          ])
          .select();
        if (mealPlanError) {
          console.error(mealPlanError);
          return;
        }
        addMealPlan(mealPlanData[0]);
      }
    } else {
      const { error: mealPlanError } = await supabase
        .from("mealplan")
        .delete()
        .eq("mealplan_id", mealplan_id);

      if (mealPlanError) return;
      deleteMealPlan(mealplan_id);
    }
    navigation.navigate("MealSchedule");
  }

  async function submitHandler() {
    if (isWeb) await manageMeal();
    Alert.alert(
      mealplan_id ? "Remove meal from Plan" : "Add meal to Plan",
      `By confirming, this meal will be ${
        mealplan_id ? "removed from" : "added to"
      } your schedule.`,
      [
        { text: "Cancel", style: "destructive" },
        {
          text: "OK",
          style: "default",
          onPress: async () => await manageMeal(),
        },
      ]
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      width: height * aspect,
      height: width,
      justifyContent: "flex-start",
    },
    scrollContent: {
      paddingTop: 300,
    },
    contentContainer: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 16,
      color: "gray",
    },
    section: {
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    nutritionContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    nutrition: {
      fontSize: 16,
      backgroundColor: theme.colors.senary,
      padding: 5,
      borderRadius: 10,
    },
    description: {
      fontSize: 16,
    },
    button: {
      marginVertical: 15,
    },
  });

  const webStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      width: width / 3,
      height: width / 3,
      borderRadius: 40,
    },
    scrollContent: {},
    contentContainer: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 16,
      color: "gray",
    },
    section: {
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    nutritionContainer: {
      // flexDirection: "row",
      // justifyContent: "space-between",
      width: "100%",
    },
    nutrition: {
      fontSize: 16,
      backgroundColor: theme.colors.senary,
      padding: 5,
      borderRadius: 10,
    },
    description: {
      fontSize: 16,
    },
    button: {
      marginVertical: 15,
    },
    block: {
      width: "50%",
      paddingHorizontal: 50,
      // alignItems: "center",
      // justifyContent: "center",
    },
    imageBlock: {
      width: "50%",
      alignItems: "center",
      justifyContent: "center",
    },
    blockContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
  });

  return !isWeb ? (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        resizeMode="cover"
        source={
          meal?.pictureurl
            ? { uri: meal.pictureurl }
            : require("../../../assets/icon.png")
        }
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>{meal?.name}</Text>
              {/* <Text style={styles.subtitle}>by James Ruth</Text> */}
              <Ionicons name="heart-outline" size={24} color="red" />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutrition</Text>
              <View style={styles.nutritionContainer}>
                <NutrionalList mealNutrition={mealNutrition} />
                {/* <Text style={styles.nutrition}>
                  🔥 {mealNutrition.totalcarbs}Kcal
                </Text>
                <Text style={styles.nutrition}>
                  🥑 {mealNutrition.totalfat}g fats
                </Text>
                <Text style={styles.nutrition}>
                  🍗 {mealNutrition.protein}g proteins
                </Text> */}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descriptions</Text>
              <Text style={styles.description}>{meal?.description}</Text>
            </View>
            <View style={styles.section}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.sectionTitle}>
                  Ingredients That You Will Need
                </Text>
                <Text style={styles.subtitle}>
                  {foodsInMeal.length + " items"}
                </Text>
              </View>
              {foodsInMeal.map((food, index) => (
                <Text key={index}>{index + 1 + ". " + food.name + " "}</Text>
              ))}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              {instructions.map((instruction, index) => (
                <View key={index}>
                  <Text> {index + 1 + ". " + instruction.instruction}</Text>
                </View>
              ))}
            </View>
          </View>
          {mealplan_id ? (
            <Button onPress={submitHandler} style={styles.button}>
              Remove from Plan
            </Button>
          ) : (
            <Button onPress={submitHandler} style={styles.button}>
              Add to Plan
            </Button>
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  ) : (
    <View style={webStyles.container}>
      <ScrollView contentContainerStyle={webStyles.scrollContent}>
        <View style={webStyles.contentContainer}>
          <View style={webStyles.blockContainer}>
            <View style={webStyles.block}>
              <View style={webStyles.header}>
                <Text style={webStyles.title}>{meal?.name}</Text>
                {/* <Text style={styles.subtitle}>by James Ruth</Text> */}
                <Ionicons name="heart-outline" size={24} color="red" />
              </View>
              <View style={webStyles.section}>
                <Text style={webStyles.sectionTitle}>Nutrition</Text>
                <View style={webStyles.nutritionContainer}>
                  <NutrionalList mealNutrition={mealNutrition} />
                </View>
              </View>
              <View style={webStyles.section}>
                <Text style={webStyles.sectionTitle}>Descriptions</Text>
                <Text style={webStyles.description}>{meal?.description}</Text>
              </View>
              <View style={webStyles.section}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={webStyles.sectionTitle}>
                    Ingredients That You Will Need
                  </Text>
                  <Text style={webStyles.subtitle}>
                    {foodsInMeal.length + " items"}
                  </Text>
                </View>
                {foodsInMeal.map((food, index) => (
                  <Text key={index}>{index + 1 + ". " + food.name + " "}</Text>
                ))}
              </View>
              <View style={webStyles.section}>
                <Text style={webStyles.sectionTitle}>Instructions</Text>
                {instructions.map((instruction, index) => (
                  <View key={index}>
                    <Text> {index + 1 + ". " + instruction.instruction}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={webStyles.imageBlock}>
              <Image
                style={webStyles.image}
                source={
                  meal?.pictureurl
                    ? { uri: meal.pictureurl }
                    : require("../../../assets/icon.png")
                }
              />
            </View>
          </View>
        </View>
        {mealplan_id ? (
          <Button onPress={submitHandler} style={webStyles.button}>
            Remove from Plan
          </Button>
        ) : (
          <Button onPress={submitHandler} style={webStyles.button}>
            Add to Plan
          </Button>
        )}
      </ScrollView>
    </View>
  );
}
