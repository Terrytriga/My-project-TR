import { StyleSheet, View } from "react-native";
import MealFoodList from "../../components/meals/MealFoodList";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianMealStack } from "../../../navigation/Routes";
import Button from "../../../shared/components/Button";
import FloatingButton from "../../../shared/components/FloatingButton";
import { useEditMealStore } from "../../../../store/MealStore";
import { useLayoutEffect } from "react";
import AddButtonHeader from "../../../shared/components/AddButtonHeader";

export default function EditMealFoodScreen() {
  const { mealFoods } = useEditMealStore();

  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianMealStack>>();

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
    navigation.navigate("EditMealInstruction");
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
      <FloatingButton
        onPress={navigationAddFoodHandler}
        icon={"add-circle-outline"}
      />
      <Button onPress={navigationNextHandler} disable={mealFoods.length == 0}>
        Next
      </Button>
    </View>
  );
}
