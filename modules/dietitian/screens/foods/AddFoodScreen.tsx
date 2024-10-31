import { Text, ThemeConsumer, useTheme } from "@rneui/themed";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";
import {
  useFoodCategoryStore,
  useFoodStore,
  useNutritionalFactStore,
} from "../../../../store/MealStore";
import { useLayoutEffect, useState } from "react";
import Input from "../../../shared/components/Input";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { DietitianFoodStack } from "../../../navigation/Routes";
import Button from "../../../shared/components/Button";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { supabase } from "../../../../lib/SupaBase";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import InputTime from "react-datepicker/dist/input_time";

export default function AddFoodScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<DietitianFoodStack>>();
  const route = useRoute<RouteProp<DietitianFoodStack, "AddFood">>();
  const [isLoading, setIsLoading] = useState(false);
  const foodcategory_id = route.params.foodcategory_id;
  const { addFood, foods } = useFoodStore();
  const { addNutritionalFact } = useNutritionalFactStore();
  const { foodCategories } = useFoodCategoryStore();
  const categoryName = foodCategories?.find(
    (category) => category.foodcategory_id === foodcategory_id
  )?.name;

  useLayoutEffect(() => {
    console.log(foodcategory_id);
    console.log(categoryName);
    navigation.setOptions({
      headerShown: true,
      title: `Add ${categoryName}`,
    });
  }, [navigation, route.params]);
  const [inputs, setInputs] = useState({
    name: {
      value: "",
      isValid: true,
    },
    totalcarbs: {
      value: 0,
      isValid: true,
    },
    calcium: {
      value: 0,
      isValid: true,
    },
    cholesterol: {
      value: 0,
      isValid: true,
    },
    dietaryfiber: {
      value: 0,
      isValid: true,
    },
    saturatedfat: {
      value: 0,
      isValid: true,
    },
    polyunsaturatedfat: {
      value: 0,
      isValid: true,
    },
    monounsaturatedfat: {
      value: 0,
      isValid: true,
    },
    transfat: {
      value: 0,
      isValid: true,
    },
    totalfat: {
      value: 0,
      isValid: true,
    },
    iron: {
      value: 0,
      isValid: true,
    },
    potassium: {
      value: 0,
      isValid: true,
    },
    protein: {
      value: 0,
      isValid: true,
    },
    sugar: {
      value: 0,
      isValid: true,
    },
    sodium: {
      value: 0,
      isValid: true,
    },
    vitamina: {
      value: 0,
      isValid: true,
    },
    vitaminc: {
      value: 0,
      isValid: true,
    },
  });

  function updateInputValueHandler(inputName: string, value: any) {
    setInputs((currentValues) => {
      return {
        ...currentValues,
        [inputName]: { value: value, isValid: true },
      };
    });
  }

  async function confirmAddFood() {
    if (isWeb) await submitHandler();
    Alert.alert("Add Food", "Are you sure you want to add this food?", [
      {
        text: "No",
        style: "destructive",
      },
      {
        text: "Yes",
        style: "default",
        onPress: async () => {
          await submitHandler();
        },
      },
    ]);
  }

  async function submitHandler() {
    const validate = () => {
      const nameIsValid = (name: string) => {
        return name.length > 0;
      };
      const totalcarbsIsValid = (totalcarbs: number) => {
        return totalcarbs >= 0;
      };
      const calciumIsValid = (calcium: number) => {
        return calcium >= 0;
      };
      const cholesterolIsValid = (cholesterol: number) => {
        return cholesterol >= 0;
      };
      const dietaryfiberIsValid = (dietaryfiber: number) => {
        return dietaryfiber >= 0;
      };
      const saturatedfatIsValid = (saturatedfat: number) => {
        return saturatedfat >= 0;
      };
      const polyunsaturatedfatValid = (polyunsaturatedfat: number) => {
        return polyunsaturatedfat >= 0;
      };
      const monounsaturatedfatIsValid = (monounsaturatedfat: number) => {
        return monounsaturatedfat >= 0;
      };
      const transfatIsValid = (transfat: number) => {
        return transfat >= 0;
      };
      const totalfatIsValid = (totalfat: number) => {
        return totalfat >= 0;
      };
      const ironIsValid = (iron: number) => {
        return iron >= 0;
      };
      const potassiumIsValid = (potassium: number) => {
        return potassium >= 0;
      };
      const proteinIsValid = (protein: number) => {
        return protein >= 0;
      };
      const sugarIsValid = (sugar: number) => {
        return sugar >= 0;
      };
      const sodiumIsValid = (sodium: number) => {
        return sodium >= 0;
      };
      const vitaminaIsValid = (vitamina: number) => {
        return vitamina >= 0;
      };
      const vitamincIsValid = (vitaminc: number) => {
        return vitaminc >= 0;
      };
      const doesFoodExist = (name: string) => {
        return foods.some(
          (food) => food.name.toLowerCase() === name.toLowerCase()
        );
      };

      if (
        nameIsValid(inputs.name.value) &&
        totalcarbsIsValid(inputs.totalcarbs.value) &&
        calciumIsValid(inputs.calcium.value) &&
        cholesterolIsValid(inputs.cholesterol.value) &&
        dietaryfiberIsValid(inputs.dietaryfiber.value) &&
        saturatedfatIsValid(inputs.saturatedfat.value) &&
        polyunsaturatedfatValid(inputs.polyunsaturatedfat.value) &&
        monounsaturatedfatIsValid(inputs.monounsaturatedfat.value) &&
        transfatIsValid(inputs.transfat.value) &&
        totalfatIsValid(inputs.totalfat.value) &&
        ironIsValid(inputs.iron.value) &&
        potassiumIsValid(inputs.potassium.value) &&
        proteinIsValid(inputs.protein.value) &&
        sugarIsValid(inputs.sugar.value) &&
        sodiumIsValid(inputs.sodium.value) &&
        vitaminaIsValid(inputs.vitamina.value) &&
        vitamincIsValid(inputs.vitaminc.value) &&
        !doesFoodExist(inputs.name.value)
      ) {
        return true;
      } else {
        if (!nameIsValid(inputs.name.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              username: { value: inputs.name.value, isValid: false },
            };
          });
          mealAlert("Invalid name", "Please enter a name.");
        }
        if (!totalcarbsIsValid(inputs.totalcarbs.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              totalcarbs: { value: inputs.totalcarbs.value, isValid: false },
            };
          });
          mealAlert("Invalid totalcarbs", "Please enter a valid totalcarbs.");
        }
        if (!calciumIsValid(inputs.calcium.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              calcium: { value: inputs.calcium.value, isValid: false },
            };
          });
          mealAlert("Invalid calcium", "Please enter a valid calcium.");
        }
        if (!cholesterolIsValid(inputs.cholesterol.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              cholesterol: { value: inputs.cholesterol.value, isValid: false },
            };
          });
          mealAlert("Invalid cholesterol", "Please enter a valid cholesterol.");
        }
        if (!dietaryfiberIsValid(inputs.dietaryfiber.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              dietaryfiber: {
                value: inputs.dietaryfiber.value,
                isValid: false,
              },
            };
          });
          mealAlert(
            "Invalid dietaryfiber",
            "Please enter a valid dietaryfiber."
          );
        }
        if (!saturatedfatIsValid(inputs.saturatedfat.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              saturatedfat: {
                value: inputs.saturatedfat.value,
                isValid: false,
              },
            };
          });
          mealAlert(
            "Invalid saturatedfat",
            "Please enter a valid saturatedfat."
          );
        }
        if (!polyunsaturatedfatValid(inputs.polyunsaturatedfat.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              polyunsaturatedfat: {
                value: inputs.polyunsaturatedfat.value,
                isValid: false,
              },
            };
          });
          mealAlert(
            "Invalid polyunsaturatedfat",
            "Please enter a valid polyunsaturatedfat."
          );
        }
        if (!monounsaturatedfatIsValid(inputs.monounsaturatedfat.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              monounsaturatedfat: {
                value: inputs.monounsaturatedfat.value,
                isValid: false,
              },
            };
          });
          mealAlert(
            "Invalid monounsaturatedfat",
            "Please enter a valid monounsaturatedfat."
          );
        }
        if (!transfatIsValid(inputs.transfat.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              transfat: { value: inputs.transfat.value, isValid: false },
            };
          });
          mealAlert("Invalid transfat", "Please enter a valid transfat.");
        }
        if (!totalfatIsValid(inputs.totalfat.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              totalfat: { value: inputs.totalfat.value, isValid: false },
            };
          });
          mealAlert("Invalid totalfat", "Please enter a valid totalfat.");
        }
        if (!ironIsValid(inputs.iron.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              iron: { value: inputs.iron.value, isValid: false },
            };
          });
          mealAlert("Invalid iron", "Please enter a valid iron.");
        }
        if (!potassiumIsValid(inputs.potassium.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              potassium: { value: inputs.potassium.value, isValid: false },
            };
          });
          mealAlert("Invalid potassium", "Please enter a valid potassium.");
        }
        if (!proteinIsValid(inputs.protein.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              protein: { value: inputs.protein.value, isValid: false },
            };
          });
          mealAlert("Invalid protein", "Please enter a valid protein.");
        }
        if (!sugarIsValid(inputs.sugar.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              sugar: { value: inputs.sugar.value, isValid: false },
            };
          });
          mealAlert("Invalid sugar", "Please enter a valid sugar.");
        }
        if (!sodiumIsValid(inputs.sodium.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              sodium: { value: inputs.sodium.value, isValid: false },
            };
          });
          mealAlert("Invalid sodium", "Please enter a valid sodium.");
        }
        if (!vitaminaIsValid(inputs.vitamina.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              vitamina: { value: inputs.vitamina.value, isValid: false },
            };
          });
          mealAlert("Invalid vitamina", "Please enter a valid vitamina.");
        }
        if (!vitamincIsValid(inputs.vitaminc.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              vitaminc: { value: inputs.vitaminc.value, isValid: false },
            };
          });
          mealAlert("Invalid vitaminc", "Please enter a valid vitaminc.");
        }
        if (doesFoodExist(inputs.name.value)) {
          setInputs((currentValues) => {
            return {
              ...currentValues,
              name: { value: inputs.name.value, isValid: false },
            };
          });
          mealAlert("Invalid Name", "Food with this name already exists.");
        }

        return false;
      }
    };

    if (validate()) {
      await uploadNewFood();
    }
    return false;
  }

  async function uploadNewFood() {
    setIsLoading(true);
    const { data: foodData, error: foodError } = await supabase
      .from("food")
      .insert([
        {
          name: inputs.name.value,
          foodcategory_id: foodcategory_id,
        },
      ])
      .select();
    if (foodError) {
      mealAlert("Error Food", foodError.message);
      return;
    }
    addFood(foodData[0]);

    const { data: nutritionalFactData, error: nutritionalFactError } =
      await supabase
        .from("nutritionalfact")
        .insert([
          {
            food_id: foodData[0].food_id,
            totalcarbs: inputs.totalcarbs.value,
            calcium: inputs.calcium.value,
            cholesterol: inputs.cholesterol.value,
            dietaryfiber: inputs.dietaryfiber.value,
            saturatedfat: inputs.saturatedfat.value,
            polyunsaturatedfat: inputs.polyunsaturatedfat.value,
            monounsaturatedfat: inputs.monounsaturatedfat.value,
            transfat: inputs.transfat.value,
            totalfat: inputs.totalfat.value,
            iron: inputs.iron.value,
            potassium: inputs.potassium.value,
            protein: inputs.protein.value,
            sugar: inputs.sugar.value,
            sodium: inputs.sodium.value,
            vitamina: inputs.vitamina.value,
            vitaminc: inputs.vitaminc.value,
          },
        ])
        .select();
    if (nutritionalFactError) {
      mealAlert("Error Nutritional Fact", nutritionalFactError.message);
      return;
    }
    addNutritionalFact(nutritionalFactData[0]);
    setInputs({
      name: {
        value: "",
        isValid: true,
      },
      totalcarbs: {
        value: 0,
        isValid: true,
      },
      calcium: {
        value: 0,
        isValid: true,
      },
      cholesterol: {
        value: 0,
        isValid: true,
      },
      dietaryfiber: {
        value: 0,
        isValid: true,
      },
      saturatedfat: {
        value: 0,
        isValid: true,
      },
      polyunsaturatedfat: {
        value: 0,
        isValid: true,
      },
      monounsaturatedfat: {
        value: 0,
        isValid: true,
      },
      transfat: {
        value: 0,
        isValid: true,
      },
      totalfat: {
        value: 0,
        isValid: true,
      },
      iron: {
        value: 0,
        isValid: true,
      },
      potassium: {
        value: 0,
        isValid: true,
      },
      protein: {
        value: 0,
        isValid: true,
      },
      sugar: {
        value: 0,
        isValid: true,
      },
      sodium: {
        value: 0,
        isValid: true,
      },
      vitamina: {
        value: 0,
        isValid: true,
      },
      vitaminc: {
        value: 0,
        isValid: true,
      },
    });
    mealAlert("Success", "Food added successfully.");
    navigation.goBack();
    setIsLoading(false);
  }

  function mealAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  }

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      paddingBottom: 20,
      width: "100%",
    },

    inputView: {
      marginVertical: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      width: Platform.OS !== "web" ? "90%" : "25%",
    },
    contentColumn: {
      width: "25%",
    },
    input: {
      width: "45%",
    },
  });

  return isLoading ? (
    <LoadingOverlay message={"Loading..."} />
  ) : (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      contentContainerStyle={styles.container}
    >
      <View style={styles.inputView}>
        <Input
          isValid={inputs.name.isValid}
          keyboardType="default"
          placeholder={"Name"}
          value={inputs.name.value}
          onUpdateValue={(value: any) => updateInputValueHandler("name", value)}
        />
      </View>

      <View style={styles.inputView}>
        <Input
          containerStyle={styles.input}
          isValid={inputs.totalcarbs.isValid}
          keyboardType="number-pad"
          placeholder={"Total Carbs"}
          value={
            isWeb ? inputs.totalcarbs.value.toString : inputs.totalcarbs.value
          }
          onUpdateValue={(value: any) =>
            updateInputValueHandler("totalcarbs", value)
          }
        />
        <Input
          containerStyle={styles.input}
          isValid={inputs.calcium.isValid}
          keyboardType="number-pad"
          placeholder={"Calcium"}
          value={isWeb ? inputs.calcium.value.toString() : inputs.calcium.value}
          onUpdateValue={(value: any) =>
            updateInputValueHandler("calcium", value)
          }
        />
      </View>
      <View style={styles.inputView}>
        <Input
          containerStyle={styles.input}
          isValid={inputs.cholesterol.isValid}
          keyboardType="number-pad"
          placeholder={"Cholesterol"}
          value={
            isWeb
              ? inputs.cholesterol.value.toString()
              : inputs.cholesterol.value
          }
          onUpdateValue={(value: any) =>
            updateInputValueHandler("cholesterol", value)
          }
        />
        <Input
          containerStyle={styles.input}
          isValid={inputs.dietaryfiber.isValid}
          keyboardType="number-pad"
          placeholder={"Dietary Fiber"}
          value={
            isWeb
              ? inputs.dietaryfiber.value.toString()
              : inputs.dietaryfiber.value
          }
          onUpdateValue={(value: any) =>
            updateInputValueHandler("dietaryfiber", value)
          }
        />
      </View>
      <View style={styles.inputView}>
        <Input
          containerStyle={styles.input}
          isValid={inputs.saturatedfat.isValid}
          keyboardType="number-pad"
          placeholder={"Saturated Fat"}
          value={
            isWeb
              ? inputs.saturatedfat.value.toString()
              : inputs.saturatedfat.value
          }
          onUpdateValue={(value: any) =>
            updateInputValueHandler("saturatedfat", value)
          }
        />
        <Input
          containerStyle={styles.input}
          isValid={inputs.polyunsaturatedfat.isValid}
          keyboardType="number-pad"
          placeholder={"Polyunsaturated Fat"}
          value={
            isWeb
              ? inputs.polyunsaturatedfat.value.toString()
              : inputs.polyunsaturatedfat.value
          }
          onUpdateValue={(value: any) =>
            updateInputValueHandler("polyunsaturatedfat", value)
          }
        />
      </View>
      <View style={styles.inputView}>
        <Input
          containerStyle={styles.input}
          isValid={inputs.monounsaturatedfat.isValid}
          keyboardType="number-pad"
          placeholder={"Mononsaturated Fat"}
          value={
            isWeb
              ? inputs.monounsaturatedfat.value.toString()
              : inputs.monounsaturatedfat.value
          }
          onUpdateValue={(value: any) =>
            updateInputValueHandler("monounsaturatedfat", value)
          }
        />
        <Input
          containerStyle={styles.input}
          isValid={inputs.transfat.isValid}
          keyboardType="number-pad"
          placeholder={"Trans Fat"}
          value={
            isWeb ? inputs.transfat.value.toString() : inputs.transfat.value
          }
          onUpdateValue={(value: any) =>
            updateInputValueHandler("transfat", value)
          }
        />
      </View>
      <View style={styles.inputView}>
        <Input
          containerStyle={styles.input}
          isValid={inputs.totalfat.isValid}
          keyboardType="number-pad"
          placeholder={"Total Fat"}
          value={
            isWeb ? inputs.totalfat.value.toString() : inputs.totalfat.value
          }
          onUpdateValue={(value: any) =>
            updateInputValueHandler("totalfat", value)
          }
        />
        <Input
          containerStyle={styles.input}
          isValid={inputs.iron.isValid}
          keyboardType="number-pad"
          placeholder={"Iron"}
          value={isWeb ? inputs.iron.value.toString() : inputs.iron.value}
          onUpdateValue={(value: any) => updateInputValueHandler("iron", value)}
        />
      </View>
      <View style={styles.inputView}>
        <Input
          containerStyle={styles.input}
          isValid={inputs.potassium.isValid}
          keyboardType="number-pad"
          placeholder={"Potassium"}
          value={
            isWeb ? inputs.potassium.value.toString() : inputs.potassium.value
          }
          onUpdateValue={(value: any) =>
            updateInputValueHandler("potassium", value)
          }
        />
        <Input
          containerStyle={styles.input}
          isValid={inputs.protein.isValid}
          keyboardType="number-pad"
          placeholder={"Protein"}
          value={isWeb ? inputs.protein.value.toString() : inputs.protein.value}
          onUpdateValue={(value: any) =>
            updateInputValueHandler("protein", value)
          }
        />
      </View>
      <View style={styles.inputView}>
        <Input
          containerStyle={styles.input}
          isValid={inputs.sugar.isValid}
          keyboardType="number-pad"
          placeholder={"Sugar"}
          value={isWeb ? inputs.sugar.value.toString() : inputs.sugar.value}
          onUpdateValue={(value: any) =>
            updateInputValueHandler("sugar", value)
          }
        />
        <Input
          containerStyle={styles.input}
          isValid={inputs.sodium.isValid}
          keyboardType="number-pad"
          placeholder={"Sodium"}
          value={isWeb ? inputs.sodium.value.toString() : inputs.sodium.value}
          onUpdateValue={(value: any) =>
            updateInputValueHandler("sodium", value)
          }
        />
      </View>
      <View style={styles.inputView}>
        <Input
          containerStyle={styles.input}
          isValid={inputs.vitamina.isValid}
          keyboardType="number-pad"
          placeholder={"Vitamin-A"}
          value={
            isWeb ? inputs.vitamina.value.toString() : inputs.vitamina.value
          }
          onUpdateValue={(value: any) =>
            updateInputValueHandler("vitamina", value)
          }
        />
        <Input
          containerStyle={styles.input}
          isValid={inputs.vitaminc.isValid}
          keyboardType="number-pad"
          placeholder={"Vitamin-C"}
          value={
            isWeb ? inputs.vitaminc.value.toString() : inputs.vitaminc.value
          }
          onUpdateValue={(value: any) =>
            updateInputValueHandler("vitaminc", value)
          }
        />
      </View>

      <View>
        <Button onPress={confirmAddFood}>Save</Button>
      </View>
    </ScrollView>
  );
}
