import { Text, useTheme } from "@rneui/themed";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { Food, NutritionalFact } from "../../../../utils/Types";
import {
  useEditMealStore,
  useNewMealStore,
  useNutritionalFactStore,
} from "../../../../store/MealStore";
import { useEffect, useState } from "react";
import Input from "../../../shared/components/Input";

interface FoodItemProps {
  food: Food;
}

export default function AddMealFoodListItem({ food }: FoodItemProps) {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { meal: NewMeal, addMealFood: newAddMealFood } = useNewMealStore();
  const { meal: EditMeal, addMealFood: editAddMealFood } = useEditMealStore();
  const [quantity, setQuantity] = useState<number>(0);
  const { nutritionalFacts } = useNutritionalFactStore();
  const [nutritionalFact, setNutritionalFact] =
    useState<NutritionalFact | null>();

  useEffect(() => {
    const nutritionalFact = nutritionalFacts?.find(
      (nutritionalFact) => nutritionalFact.food_id === food.food_id
    );
    setNutritionalFact(nutritionalFact);
  }, [food]);

  function addFoodToMeal() {
    if (quantity === 0) {
      Alert.alert("Quantity cannot be zero", "", [
        {
          text: "OK",
          style: "default",
        },
      ]);
      return;
    }
    if (NewMeal) {
      newAddMealFood({
        food_id: food.food_id,
        quantity: quantity,
      });
      Alert.alert(`${food.name} added to meal`, "", [
        {
          text: "OK",
          style: "default",
        },
      ]);
    } else if (EditMeal) {
      editAddMealFood({
        meal_id: EditMeal.meal_id,
        food_id: food.food_id,
        quantity: quantity,
      });
      Alert.alert(`${food.name} added to meal`, "", [
        {
          text: "OK",
          style: "default",
        },
      ]);
    }
  }

  function confirmAddFood() {
    if (isWeb) addFoodToMeal();
    Alert.alert(
      `Add ${food.name} to meal?`,
      "Confirming will add this food to the meal.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => addFoodToMeal(),
        },
      ]
    );
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      alignItems: "center",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      padding: 10,
      borderRadius: 10,
      width: "100%",
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
    inputContainer: {
      marginVertical: 5,
      width: "100%",
      flex: 1,
    },
  });
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => confirmAddFood()}
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
        <View style={styles.inputContainer}>
          <Input
            isValid={true}
            keyboardType="number-pad"
            placeholder={"Quantity"}
            value={quantity}
            onUpdateValue={(value: number) => setQuantity(value)}
          />
        </View>
      </View>
    </Pressable>
  );
}
