import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Text, useTheme } from "@rneui/themed";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { DietitianMealStack } from "../../../navigation/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  useEditMealStore,
  useFoodStore,
  useMealFoodStore,
  useMealInstructionStore,
  useMealPlanStore,
  useMealStore,
  useMealTypeStore,
  useNewMealStore,
  useNutritionalFactStore,
} from "../../../../store/MealStore";
import {
  Food,
  MealNutrition,
  NewMealInstruction,
} from "../../../../utils/Types";
import { supabase } from "../../../../lib/SupaBase";
import NutrionalList from "../../components/meals/NutritionalList";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";

const { width, height } = Dimensions.get("window");
const aspect = width / height;

export default function ViewMealScreen() {
  const isWeb = Platform.OS === "web";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { theme } = useTheme();
  const { mealInstructions } = useMealInstructionStore();
  const { foods } = useFoodStore();
  const { mealFoods } = useMealFoodStore();
  const { nutritionalFacts } = useNutritionalFactStore();
  const { deleteMealPlanMeal } = useMealPlanStore();
  const { deleteMealInstruction } = useMealInstructionStore();
  const { deleteMealFood } = useMealFoodStore();
  const { deleteMeal } = useMealStore();
  const { mealTypes } = useMealTypeStore();
  const { meals } = useMealStore();
  const { setMeal, setMealFoods, setMealInstructions } = useEditMealStore();
  const { clearMeal } = useNewMealStore();
  const route = useRoute<RouteProp<DietitianMealStack, "ViewMeal">>();
  const meal_id = route.params?.meal_id;

  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianMealStack>>();

  const meal = meals.find((meal) => meal.meal_id === meal_id);
  const instructions = mealInstructions?.filter(
    (mi) => mi.meal_id === meal?.meal_id
  );
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
    if (!meal) return;
    navigation.setOptions({
      title: meal.name,
      headerShown: true,
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
              onPress={confirmDeleteMeal}
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
  }, [navigation, route.params]);

  function navigationEditMealHandler() {
    if (!meal || !mealFoods || !instructions) return;
    clearMeal();
    setMeal(meal);
    setMealFoods(
      mealFoods.filter((mealFood) => mealFood.meal_id === meal.meal_id)
    );
    setMealInstructions(instructions as NewMealInstruction[]);

    navigation.navigate("EditMeal");
  }

  function confirmDeleteMeal() {
    if (isWeb) deleteTheMeal();
    Alert.alert("Delete Meal", "Are you sure you want to delete this meal?", [
      {
        text: "No",
        style: "default",
      },
      {
        text: "Yes",
        onPress: () => deleteTheMeal(),
        style: "destructive",
      },
    ]);
  }
  async function deleteTheMeal() {
    setIsLoading(true);
    if (!meal?.meal_id || !mealTypes) return;
    const mealType = mealTypes.find(
      (type) => type.mealtype_id === meal.mealtype_id
    );
    if (!mealType) return;

    const { error: deleteMealPlanError } = await supabase
      .from("mealplan")
      .delete()
      .eq("meal_id", meal.meal_id);

    if (deleteMealPlanError) {
      MealAlert("Error", deleteMealPlanError.message);
      return;
    }
    deleteMealPlanMeal(meal.meal_id);

    const { error: deleteMealFoodData } = await supabase
      .from("mealfood")
      .delete()
      .eq("meal_id", meal.meal_id);
    if (deleteMealFoodData) {
      MealAlert("Error", deleteMealFoodData.message);
      return;
    }
    deleteMealFood(meal.meal_id);

    const { error: deleteMealInstructionData } = await supabase
      .from("mealinstruction")
      .delete()
      .eq("meal_id", meal.meal_id);
    if (deleteMealInstructionData) {
      MealAlert("Error", deleteMealInstructionData.message);
      return;
    }
    deleteMealInstruction(meal.meal_id);

    const { error: deleteMealData } = await supabase
      .from("meal")
      .delete()
      .eq("meal_id", meal.meal_id);

    if (deleteMealData) {
      MealAlert("Error", deleteMealData.message);
      return;
    }
    deleteMeal(meal.meal_id);

    const { error: removeError } = await supabase.storage
      .from("Public")
      .remove([`Meals/${mealType.mealtype}/${meal.name}`]);

    if (removeError) {
      MealAlert("Error", removeError.message);
      return;
    }

    MealAlert("Meal Deleted", `Successfully deleted meal ${meal.name}.`);
    setIsLoading(false);
    navigation.goBack();
  }

  const MealAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    pressed: {
      opacity: 0.5,
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

  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : !isWeb ? (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        resizeMode="cover"
        source={
          meal?.pictureurl
            ? { uri: meal.pictureurl }
            : require("../../../../assets/icon.png")
        }
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>{meal?.name}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutrition</Text>
              <View style={styles.nutritionContainer}>
                <NutrionalList mealNutrition={mealNutrition} />
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
                    : require("../../../../assets/icon.png")
                }
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
