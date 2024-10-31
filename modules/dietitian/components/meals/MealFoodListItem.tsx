import { Text, useTheme } from "@rneui/themed";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { NewMealFood } from "../../../../utils/Types";
import {
  useEditMealStore,
  useFoodCategoryStore,
  useFoodStore,
  useMealFoodStore,
  useNewMealStore,
} from "../../../../store/MealStore";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../../lib/SupaBase";

type MealFoodListProps = {
  mealFood: NewMealFood;
};

export default function MealFoodListItem({ mealFood }: MealFoodListProps) {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const { foods } = useFoodStore();
  const { foodCategories } = useFoodCategoryStore();
  const { meal: NewMeal, deleteMealFood: newDeleteMealFood } =
    useNewMealStore();
  const { meal: EditMeal, deleteMealFood: editDeleteMealFood } =
    useEditMealStore();
  const { deleteMealFood: deleteMealFoodStore } = useMealFoodStore();

  const food = foods?.find((food) => food.food_id === mealFood.food_id);
  const foodCategory = foodCategories?.find(
    (category) => category.foodcategory_id === food?.foodcategory_id
  );

  function ItemAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  }
  async function handleDelete() {
    if (NewMeal) {
      newDeleteMealFood(mealFood);
    } else if (EditMeal) {
      if (mealFood.mealfood_id) {
        const { data, error } = await supabase
          .from("mealfood")
          .delete()
          .eq("mealfood_id", mealFood.mealfood_id);
        if (error) {
          ItemAlert("Error", error.message);
          return;
        }
        deleteMealFoodStore(mealFood.mealfood_id);
      }
      editDeleteMealFood(mealFood);
    }
  }

  function confirmDelete() {
    if (isWeb) handleDelete();
    Alert.alert(
      `Delete ${food?.name}?`,
      "Are you sure you want to delete this food?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          style: "destructive",
          onPress: handleDelete,
        },
      ]
    );
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      justifyContent: "space-between",
      padding: 10,
      borderRadius: 10,
      width: !isWeb ? "80%" : 350,
    },
    iconContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    textContainer: {
      alignItems: "center",
      flexDirection: "column",
      paddingHorizontal: 15,
      width: "50%",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 5,
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

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{food?.name}</Text>
        <Text>{foodCategory?.name}</Text>
      </View>
      <Text>Quantity: {mealFood.quantity}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.iconPressable,
          pressed && styles.pressed,
        ]}
        onPress={confirmDelete}
      >
        <Ionicons name="trash-outline" size={24} color={theme.colors.primary} />
      </Pressable>
    </Pressable>
  );
}
