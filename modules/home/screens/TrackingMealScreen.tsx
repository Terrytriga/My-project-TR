import DateTimePicker from "@react-native-community/datetimepicker";
import { Text, useTheme } from "@rneui/themed";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  useWorkoutProgramStore,
  useWorkoutStore,
} from "../../../store/WorkoutStore";
import Input from "../../shared/components/Input";
import { useEffect, useState } from "react";
import { formatDate } from "../../../utils/FormatDate";
import {
  MealPlanItem,
  WorkoutProgram,
  WorkoutProgramItem,
} from "../../../utils/Types";
import Button from "../../shared/components/Button";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../lib/SupaBase";
import { useTrackingStore } from "../../../store/TrackingStore";
import { useMealPlanStore, useMealStore } from "../../../store/MealStore";
import WebDatePicker from "../../shared/components/web/WebDatePicker";

export default function TrackingMealScreen() {
  const { theme } = useTheme();
  const { mealPlans, updateMealPlan } = useMealPlanStore();
  const { meals } = useMealStore();

  const { trackingMeal, addTrackingMeal, deleteTrackingMeal } =
    useTrackingStore();
  const [completedCount, setCompletedCount] = useState(0);
  const [currentMeals, setCurrentMeals] = useState<MealPlanItem[]>([]);
  const [mealSelectedList, setMealSelectedList] = useState<MealPlanItem[]>([]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(new Date());

  useEffect(() => {
    if (!mealPlans) return;
    const filteredPlans = mealPlans.filter((plan) => {
      const planDate = new Date(plan.mealtime);
      const selectedDate = new Date(dateSelected);
      return (
        planDate.getDate() === selectedDate.getDate() &&
        planDate.getMonth() === selectedDate.getMonth() &&
        planDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    const mealPlanItems = filteredPlans
      .map((plan) => {
        const meal = meals.find((meal) => meal.meal_id === plan.meal_id);
        if (!meal) return null;

        return {
          meal: meal,
          mealPlan: plan,
        };
      })
      .filter((item) => item !== null);

    setCompletedCount(filteredPlans.filter((plan) => plan.completed).length);
    setCurrentMeals(mealPlanItems as MealPlanItem[]);
  }, [dateSelected, mealPlans, meals]);

  function addMealToFinishList(mealItem: MealPlanItem) {
    if (mealItem.mealPlan.completed) return;
    const planExists = mealSelectedList.some((item) => item === mealItem);
    if (!planExists) {
      setMealSelectedList((items) => [...items, mealItem]);
    } else {
      setMealSelectedList(
        mealSelectedList.filter((removeItem) => removeItem !== mealItem)
      );
    }
  }

  async function trackMealPlan() {
    if (mealSelectedList.length === 0) return;
    const planIdList = mealSelectedList.map(
      (planItem) => planItem.mealPlan.mealplan_id
    );
    const { data: planData, error: planError } = await supabase
      .from("mealplan")
      .update({ completed: true })
      .in("mealplan_id", planIdList)
      .select("*");

    if (planError) {
      TrackingAlert("Error", planError.message);
      return;
    }
    planData.forEach((item) => {
      updateMealPlan(item);
    });
    const trackingDetails = planData.map((item) => {
      return {
        user_id: item.user_id,
        mealplan_id: item.mealplan_id,
        datecreated: dateSelected,
      };
    });

    const { data: mealTrackingData, error: mealTrackingError } = await supabase
      .from("trackingmeal")
      .insert(trackingDetails)
      .select("*");

    if (mealTrackingError) {
      TrackingAlert("Error", mealTrackingError.message);
      return;
    }

    mealTrackingData.forEach((item) => {
      addTrackingMeal(item);
    });

    setMealSelectedList([]);
  }

  function toggleDatePicker() {
    setShowDatePicker(!showDatePicker);
  }

  function updateDate(date: Date) {
    setDateSelected(date);
    setShowDatePicker(!showDatePicker);
  }

  async function removeTracking(mealItem: MealPlanItem) {
    if (!mealItem.mealPlan.mealplan_id) return;
    const { data: planData, error: planError } = await supabase
      .from("mealplan")
      .update({ completed: false })
      .eq("mealplan_id", mealItem.mealPlan.mealplan_id)
      .select("*")
      .single();

    if (planError) {
      TrackingAlert("Error", planError.message);
      return;
    }
    updateMealPlan(planData);

    const { data: trackingData, error: trackingError } = await supabase
      .from("trackingmeal")
      .delete()
      .eq("mealplan_id", mealItem.mealPlan.mealplan_id)
      .select("*")
      .single();
    if (trackingError) {
      TrackingAlert("Error", trackingError.message);
      return;
    }

    deleteTrackingMeal(trackingData);
  }

  function confirmRemoveTracking(mealItem: MealPlanItem) {
    Alert.alert("Delete", "Are you sure you want to delete this tracking?", [
      {
        text: "Cancel",
      },
      {
        text: "Confirm",
        onPress: async () => await removeTracking(mealItem),
      },
    ]);
  }

  function TrackingAlert(title: string, message: string) {
    Alert.alert(title, message, [
      {
        text: "OK",
      },
    ]);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
    },
    title: {
      fontSize: 24,
      fontFamily: "Bebas",
      marginBottom: 30,
    },
    subTitle: {
      fontSize: 18,
      borderBottomColor: theme.colors.primary,
      borderBottomWidth: 1,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.colors.primary,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    buttonContainer: {
      paddingVertical: 20,
      width: "100%",
    },
    workoutContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollView: {
      height: 250,
      marginVertical: 15,
    },
    scrollViewContent: {
      alignItems: "center",
      justifyContent: "center",
    },
    workoutTitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
    workoutDescription: {
      fontSize: 14,
      marginHorizontal: 2,
    },
    workoutItemContainer: {
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      width: "95%",
      padding: 10,
      marginVertical: 5,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 10,
    },
    contentContainer: {
      flexDirection: "row",
      width: "70%",
      alignItems: "center",
      justifyContent: "center",
    },
    textContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "80%",
    },
    iconContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    deleteIcon: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "red",
    },
    workoutSelected: {
      borderColor: "green",
      borderWidth: 2,
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your workouts for today!</Text>
      {Platform.OS !== "web" ? (
        <Pressable
          onPress={toggleDatePicker}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Input
            containerStyle={styles.inputContainer}
            disabled={true}
            value={formatDate(dateSelected).toString()}
            isValid={true}
            placeholder={"Select Date"}
            icon={"calendar-outline"}
          />
        </Pressable>
      ) : (
        <WebDatePicker
          date={dateSelected}
          onChange={(value: any) => updateDate(value)}
        />
      )}
      {showDatePicker && (
        <DateTimePicker
          value={dateSelected}
          onChange={(event, selecteDate) => {
            const date = selecteDate;
            updateDate(new Date(date!));
          }}
          mode="date"
          display="calendar"
        />
      )}
      <View style={styles.workoutContainer}>
        <Text style={styles.subTitle}>
          {completedCount} / {currentMeals.length} Meals Tracked
        </Text>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {currentMeals.length > 0 ? (
            currentMeals.map((mealItem) => {
              const isSelected = mealSelectedList.some(
                (item) => item === mealItem
              );
              return (
                <Pressable
                  key={mealItem.mealPlan.mealplan_id}
                  style={({ pressed }) => [
                    pressed && styles.pressed,
                    styles.workoutItemContainer,
                    isSelected && styles.workoutSelected,
                  ]}
                  onPress={() => addMealToFinishList(mealItem)}
                >
                  <Image
                    source={{ uri: mealItem.meal.pictureurl }}
                    style={styles.image}
                  />
                  <View style={styles.contentContainer}>
                    <View style={styles.textContainer}>
                      <Text style={styles.workoutTitle}>
                        {mealItem.meal.name}
                      </Text>
                      <Text style={styles.workoutDescription}>
                        {mealItem.meal.description}
                      </Text>
                    </View>
                    <View style={styles.iconContainer}>
                      {mealItem.mealPlan.completed ? (
                        <Pressable
                          style={({ pressed }) => [
                            pressed && styles.pressed,
                            styles.deleteIcon,
                          ]}
                          onPress={() => confirmRemoveTracking(mealItem)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={24}
                            color={"red"}
                          />
                        </Pressable>
                      ) : !isSelected ? (
                        <Feather
                          name="circle"
                          size={24}
                          color={theme.colors.black}
                        />
                      ) : (
                        <Feather
                          name="check-circle"
                          size={24}
                          color={"green"}
                        />
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })
          ) : (
            <Text>Add some meals to your meal plan!</Text>
          )}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        {mealSelectedList.length > 0 && (
          <Button onPress={async () => trackMealPlan()}>Add Tracking</Button>
        )}
      </View>
    </View>
  );
}
