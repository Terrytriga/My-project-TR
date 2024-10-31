import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianMealStack } from "../../../navigation/Routes";
import Button from "../../../shared/components/Button";
import {
  useEditMealStore,
  useFoodCategoryStore,
  useFoodStore,
  useNewMealStore,
} from "../../../../store/MealStore";
import FoodList from "../../components/foods/FoodList";
import FoodTypeList from "../../components/FoodTypeList";
import { useEffect, useState } from "react";
import { Food, FoodCategory } from "../../../../utils/Types";
import AddMealFoodList from "../../components/meals/AddMealFoodList";
import { useTheme } from "@rneui/themed";
import Input from "../../../shared/components/Input";

export default function AddFoodToMealScreen() {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianMealStack>>();
  const { foods } = useFoodStore();
  const { foodCategories } = useFoodCategoryStore();

  const [searchText, setSearchText] = useState<string>("");
  const [selectedType, setSelectedType] = useState<FoodCategory>(
    foodCategories[0]
  );
  const [foodList, setFoodList] = useState<Food[]>([]);
  const { mealFoods: newMealFoods } = useNewMealStore();
  const { mealFoods: editMealFoods } = useEditMealStore();

  useEffect(() => {
    let foodIds: number[] = [];
    let filterFoods = foods.filter((food) => {
      return !foodIds.includes(food.food_id);
    });
    if (editMealFoods.length > 0) {
      foodIds = editMealFoods.map((mealFood) => mealFood.food_id);
      filterFoods = foods.filter((food) => {
        return !foodIds.includes(food.food_id);
      });
    }
    if (newMealFoods.length > 0) {
      foodIds = newMealFoods.map((mealFood) => mealFood.food_id);
      filterFoods = foods.filter((food) => {
        return !foodIds.includes(food.food_id);
      });
    }
    if (searchText.length > 0) {
      setFoodList(
        filterFoods.filter((food) =>
          food.name.toLowerCase().includes(searchText.toLocaleLowerCase())
        )
      );
    } else {
      const filterMeals = filterFoods.filter((food) => {
        return food.foodcategory_id === selectedType.foodcategory_id;
      });
      setFoodList(filterMeals);
    }
  }, [foods, selectedType, searchText, newMealFoods, editMealFoods]);

  function navigationAddFoodHandler() {
    navigation.navigate("AddMealFood");
  }

  function navigationNextHandler() {
    navigation.navigate("AddMealInstruction");
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingBottom: 20,
    },
    input: {
      flexDirection: "row",
      width: "100%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 25,
      borderColor: theme.colors.primary,
    },
    inputContainer: {
      // marginTop: 5,
      width: "100%",
      alignItems: "center",
      paddingHorizontal: 15,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          containerStyle={styles.input}
          placeholder={"Search..."}
          icon={"search-outline"}
          secure={false}
          keyboardType={"default"}
          value={searchText}
          onUpdateValue={(value: string) => setSearchText(value)}
          isValid={true}
          popup={false}
        />
      </View>
      <FoodTypeList
        foodTypes={foodCategories}
        onPress={setSelectedType}
        selectedType={selectedType}
      />
      <AddMealFoodList foodList={foodList} />
    </View>
  );
}
