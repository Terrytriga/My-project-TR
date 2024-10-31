import { StyleSheet, View } from "react-native";
import { useMealStore, useMealTypeStore } from "../../../../store/MealStore";
import { useEffect, useState } from "react";
import { Meal, MealType } from "../../../../utils/Types";
import MealList from "../../components/meals/MealList";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietitianMealStack } from "../../../navigation/Routes";
import MealTypeList from "../../components/meals/MealTypeList";
import { useTheme } from "@rneui/themed";
import Input from "../../../shared/components/Input";
import AddButton from "../../../shared/components/AddButton";

export default function MealScreen() {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianMealStack>>();

  const { meals: mealStore } = useMealStore();
  const { mealTypes } = useMealTypeStore();
  const [selectedType, setSelectedType] = useState<MealType>(mealTypes[0]);
  const [searchText, setSearchText] = useState<string>("");
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    if (searchText.length > 0) {
      setMeals(
        mealStore.filter((meal) =>
          meal.name.toLowerCase().includes(searchText.toLocaleLowerCase())
        )
      );
    } else {
      const filterMeals = mealStore.filter((meal) => {
        return meal.mealtype_id === selectedType.mealtype_id;
      });
      setMeals(filterMeals);
    }
  }, [mealStore, selectedType, searchText]);

  function navigationHandler() {
    console.log("Hi");
    navigation.navigate("AddMeal", { mealtype_id: selectedType.mealtype_id });
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
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
      marginTop: 5,
      width: "75%",
      alignItems: "flex-start",
      paddingHorizontal: 15,
      alignSelf: "flex-start",
    },
  });
  return (
    <View style={styles.container}>
      <AddButton onPress={() => navigationHandler()}>Meal</AddButton>
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
      <MealTypeList
        mealTypes={mealTypes}
        selectedType={selectedType}
        onPress={setSelectedType}
      />
      <MealList meals={meals} />
      {/* <FloatingButton icon={"add-circle-outline"} /> */}
    </View>
  );
}
