import { View } from "react-native";
import FoodList from "../../components/foods/FoodList";
import {
  useFoodCategoryStore,
  useFoodStore,
} from "../../../../store/MealStore";
import { useEffect, useState } from "react";
import { Food } from "../../../../utils/Types";
import FloatingButton from "../../../shared/components/FloatingButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianFoodStack } from "../../../navigation/Routes";

export default function FoodFruitScreen() {
  const { foodCategories } = useFoodCategoryStore();
  const { foods } = useFoodStore();
  const [foodList, setFoodList] = useState<Food[] | undefined>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianFoodStack>>();

  useEffect(() => {
    setFoodList(
      foods?.filter(
        (food) =>
          food.foodcategory_id ===
          foodCategories?.find((category) => category.name === "Fruits")
            ?.foodcategory_id
      )
    );
  }, [foods]);

  function navigationHandler() {
    if (!foodCategories) return;
    const foodcategory_id = foodCategories?.find(
      (category) => category.name === "Fruits"
    )?.foodcategory_id;
    if (!foodcategory_id) return;

    navigation.navigate("AddFood", { foodcategory_id });
  }
  return (
    <View>
      <FoodList foodList={foodList} />
      <FloatingButton icon={"add-circle-outline"} onPress={navigationHandler} />
    </View>
  );
}
