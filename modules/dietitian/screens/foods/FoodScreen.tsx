import { StyleSheet, View } from "react-native";
import FoodList from "../../components/foods/FoodList";
import {
  useFoodCategoryStore,
  useFoodStore,
} from "../../../../store/MealStore";
import { useEffect, useLayoutEffect, useState } from "react";
import { Food, FoodCategory } from "../../../../utils/Types";
import FloatingButton from "../../../shared/components/FloatingButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianFoodStack } from "../../../navigation/Routes";
import AddButtonHeader from "../../../shared/components/AddButtonHeader";
import FoodTypeList from "../../components/FoodTypeList";
import { useTheme } from "@rneui/themed";
import Input from "../../../shared/components/Input";
import AddButton from "../../../shared/components/AddButton";

export default function FoodScreen() {
  const { theme } = useTheme();
  const { foodCategories } = useFoodCategoryStore();
  const { foods } = useFoodStore();
  const [searchText, setSearchText] = useState<string>("");
  const [foodList, setFoodList] = useState<Food[] | undefined>([]);
  const [selectedType, setSelectedType] = useState<FoodCategory>(
    foodCategories[0]
  );

  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianFoodStack>>();

  useEffect(() => {
    if (searchText.length > 0) {
      setFoodList(
        foods.filter((food) =>
          food.name.toLowerCase().includes(searchText.toLocaleLowerCase())
        )
      );
    } else {
      const filterMeals = foods.filter((food) => {
        return food.foodcategory_id === selectedType.foodcategory_id;
      });
      setFoodList(filterMeals);
    }
  }, [foods, selectedType, searchText]);

  function navigationHandler() {
    console.log(selectedType.foodcategory_id);
    navigation.navigate("AddFood", {
      foodcategory_id: selectedType.foodcategory_id,
    });
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
      width: "75%",
      alignItems: "flex-start",
      paddingHorizontal: 15,
      marginTop: 5,
      alignSelf: "flex-start",
    },
  });

  return (
    <View style={styles.container}>
      <AddButton onPress={navigationHandler}>Food</AddButton>
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
        selectedType={selectedType}
        onPress={setSelectedType}
      />
      <FoodList foodList={foodList} />
    </View>
  );
}
