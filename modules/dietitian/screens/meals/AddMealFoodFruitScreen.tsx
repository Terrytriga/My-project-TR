import { View } from "react-native";
import {
  useEditMealStore,
  useFoodCategoryStore,
  useFoodStore,
  useNewMealStore,
} from "../../../../store/MealStore";
import { useEffect, useState } from "react";
import { Food } from "../../../../utils/Types";
import AddMealFoodList from "../../components/meals/AddMealFoodList";

export default function AddMealFoodFruitScreen() {
  const { foodCategories } = useFoodCategoryStore();
  const { foods } = useFoodStore();
  const [foodList, setFoodList] = useState<Food[] | undefined>([]);
  const { mealFoods: editMealFoods, meal: editMeal } = useEditMealStore();
  const { mealFoods: newMealFoods, meal: newMeal } = useNewMealStore();
  useEffect(() => {
    const dairyCategoryId = foodCategories?.find(
      (category) => category.name === "Fruits"
    )?.foodcategory_id;
    if (newMeal) {
      setFoodList(
        foods
          ?.filter((food) => food.foodcategory_id === dairyCategoryId)
          .filter(
            (food) =>
              !newMealFoods.some(
                (mealFood) => mealFood.food_id === food.food_id
              )
          )
      );
    } else if (editMeal) {
      setFoodList(
        foods
          ?.filter((food) => food.foodcategory_id === dairyCategoryId)
          .filter(
            (food) =>
              !editMealFoods.some(
                (mealFood) => mealFood.food_id === food.food_id
              )
          )
      );
    }
  }, [foods, editMealFoods, newMealFoods, foodCategories]);

  return (
    <View>
      <AddMealFoodList foodList={foodList} />
    </View>
  );
}
