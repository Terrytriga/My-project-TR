import { StyleSheet, View } from "react-native";
import MealFoodList from "../../components/meals/MealFoodList";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianMealStack } from "../../../navigation/Routes";
import Button from "../../../shared/components/Button";
import FloatingButton from "../../../shared/components/FloatingButton";
import { useNewMealStore } from "../../../../store/MealStore";
import { useLayoutEffect } from "react";
import AddButtonHeader from "../../../shared/components/AddButtonHeader";

export default function AddMealFoodScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianMealStack>>();
  const { mealFoods } = useNewMealStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AddButtonHeader onPress={navigationAddFoodHandler}>
          Food
        </AddButtonHeader>
      ),
    });
  }, [navigation]);

  function navigationAddFoodHandler() {
    navigation.navigate("AddFoodToMeal");
  }

  function navigationNextHandler() {
    navigation.navigate("AddMealInstruction");
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 20,
    },
  });

  return (
    <View style={styles.container}>
      <MealFoodList mealFoods={mealFoods} />
      <Button onPress={navigationNextHandler} disable={mealFoods.length == 0}>
        Next
      </Button>
    </View>
  );
}
