import { Text, useTheme } from "@rneui/themed";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Food, NutritionalFact } from "../../../../utils/Types";
import { useNutritionalFactStore } from "../../../../store/MealStore";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianFoodStack } from "../../../navigation/Routes";

interface FoodItemProps {
  food: Food;
}

export default function FoodListItem({ food }: FoodItemProps) {
  const isWeb = Platform.OS === "web";
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianFoodStack>>();
  const { theme } = useTheme();
  const { nutritionalFacts } = useNutritionalFactStore();
  const [nutritionalFact, setNutritionalFact] = useState<NutritionalFact>();

  useEffect(() => {
    const nutritionalFact = nutritionalFacts?.find(
      (nutritionalFact) => nutritionalFact.food_id === food.food_id
    );
    setNutritionalFact(nutritionalFact);
  }, [food, nutritionalFacts]);

  function handlePress() {
    navigation.navigate("EditFood", { food_id: food.food_id });
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      alignItems: "center",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      padding: 10,
      borderRadius: 10,
      width: Platform.OS !== "web" ? "100%" : 450,
    },
    nutritionalContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    nutritionalBlock: {
      flexDirection: "column",
      flex: 1,
    },
    nutrionalText: {
      fontSize: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      borderBottomWidth: 1,
      marginBottom: 10,
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
  });
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <Text style={styles.title}>{food.name}</Text>
      <View style={styles.nutritionalContainer}>
        <View style={styles.nutritionalBlock}>
          <Text style={styles.nutrionalText}>
            Total Carbs: {nutritionalFact?.totalcarbs}
          </Text>
          <Text style={styles.nutrionalText}>
            Cholesterol: {nutritionalFact?.cholesterol}
          </Text>
          <Text style={styles.nutrionalText}>
            Dietary Fiber: {nutritionalFact?.dietaryfiber}
          </Text>
          <Text style={styles.nutrionalText}>
            Saturated Fat: {nutritionalFact?.saturatedfat}
          </Text>
          <Text style={styles.nutrionalText}>
            Polyunsaturated Fat: {nutritionalFact?.polyunsaturatedfat}
          </Text>
          <Text style={styles.nutrionalText}>
            Monounsaturated Fat: {nutritionalFact?.monounsaturatedfat}
          </Text>
          <Text style={styles.nutrionalText}>
            Trans Fat: {nutritionalFact?.transfat}
          </Text>
          <Text style={styles.nutrionalText}>
            TotalFat: {nutritionalFact?.totalfat}
          </Text>
        </View>
        <View style={styles.nutritionalBlock}>
          <Text style={styles.nutrionalText}>
            Calcium: {nutritionalFact?.calcium}
          </Text>
          <Text style={styles.nutrionalText}>
            Iron: {nutritionalFact?.iron}
          </Text>
          <Text style={styles.nutrionalText}>
            Potassium: {nutritionalFact?.potassium}
          </Text>
          <Text style={styles.nutrionalText}>
            Protein: {nutritionalFact?.protein}
          </Text>
          <Text style={styles.nutrionalText}>
            Sugar: {nutritionalFact?.sugar}
          </Text>
          <Text style={styles.nutrionalText}>
            Sodium: {nutritionalFact?.sodium}
          </Text>
          <Text style={styles.nutrionalText}>
            Vitamin A: {nutritionalFact?.vitamina}
          </Text>
          <Text style={styles.nutrionalText}>
            Vitamin C: {nutritionalFact?.vitaminc}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
