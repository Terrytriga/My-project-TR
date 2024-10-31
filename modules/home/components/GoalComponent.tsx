import { Text, useTheme } from "@rneui/themed";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useTrackingStore } from "../../../store/TrackingStore";
import {
  Food,
  MealFood,
  NutritionalFact,
  TrackingGoalCalory,
  TrackingGoalSleep,
  TrackingGoalSteps,
  TrackingGoalWater,
  TrackingGoalWorkout,
  TrackingMeal,
  TrackingSleep,
  TrackingSteps,
  TrackingWater,
  TrackingWorkout,
} from "../../../utils/Types";
import { useEffect, useState } from "react";
import {
  useFoodStore,
  useMealFoodStore,
  useMealPlanStore,
  useNutritionalFactStore,
} from "../../../store/MealStore";
import { formatDate } from "../../../utils/FormatDate";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackRoutes } from "../../navigation/Routes";

export default function GoalComponent() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackRoutes>>();
  const { theme } = useTheme();

  const { mealPlans } = useMealPlanStore();
  const { foods } = useFoodStore();
  const { mealFoods } = useMealFoodStore();
  const { nutritionalFacts } = useNutritionalFactStore();

  const {
    trackingGoalCalory,
    trackingGoalSleep,
    trackingGoalSteps,
    trackingGoalWater,
    trackingGoalWorkout,
    trackingWorkout,
    trackingMeal,
    trackingSleep,
    trackingSteps,
    trackingWater,
  } = useTrackingStore();

  //Goals
  const [currentTrackingGoalCalory, setCurrentTrackingGoalCalory] =
    useState<TrackingGoalCalory>();
  const [currentTrackingGoalSleep, setCurrentTrackingGoalSleep] =
    useState<TrackingGoalSleep>();
  const [currentTrackingGoalSteps, setCurrentTrackingGoalSteps] =
    useState<TrackingGoalSteps>();
  const [currentTrackingGoalWater, setCurrentTrackingGoalWater] =
    useState<TrackingGoalWater>();
  const [currentTrackingGoalWorkout, setCurrentTrackingGoalWorkout] =
    useState<TrackingGoalWorkout>();

  //Trackings
  const [currentTrackingMeal, setCurrentTrackingMeal] = useState<
    TrackingMeal[]
  >([]);
  const [currentTrackingSleep, setCurrentTrackingSleep] = useState<
    TrackingSleep[]
  >([]);
  const [currentTrackingSteps, setCurrentTrackingSteps] = useState<
    TrackingSteps[]
  >([]);
  const [currentTrackingWater, setCurrentTrackingWater] = useState<
    TrackingWater[]
  >([]);
  const [currentTrackingWorkout, setCurrentTrackingWorkout] = useState<
    TrackingWorkout[]
  >([]);

  //Get Current Goals according to today's date.
  useEffect(() => {
    const currentDate = new Date();

    setCurrentTrackingGoalCalory(
      trackingGoalCalory.find(
        (goal) =>
          new Date(goal.startdate) <= currentDate &&
          new Date(goal.enddate) >= currentDate
      )
    );

    setCurrentTrackingGoalSleep(
      trackingGoalSleep.find(
        (goal) =>
          new Date(goal.startdate) <= currentDate &&
          new Date(goal.enddate) >= currentDate
      )
    );

    setCurrentTrackingGoalSteps(
      trackingGoalSteps.find(
        (goal) =>
          new Date(goal.startdate) <= currentDate &&
          new Date(goal.enddate) >= currentDate
      )
    );

    setCurrentTrackingGoalWater(
      trackingGoalWater.find(
        (goal) =>
          new Date(goal.startdate) <= currentDate &&
          new Date(goal.enddate) >= currentDate
      )
    );

    setCurrentTrackingGoalWorkout(
      trackingGoalWorkout.find(
        (goal) =>
          new Date(goal.startdate) <= currentDate &&
          new Date(goal.enddate) >= currentDate
      )
    );
  }, [
    trackingGoalCalory,
    trackingGoalSleep,
    trackingGoalSteps,
    trackingGoalWater,
    trackingGoalWorkout,
  ]);

  //Get Current Trackings for for today and goals.
  useEffect(() => {
    const currentDate = new Date();

    setCurrentTrackingMeal(
      trackingMeal.filter((meal) => {
        return (
          new Date(meal.datecreated).getDate() === currentDate.getDate() &&
          new Date(meal.datecreated).getMonth() === currentDate.getMonth() &&
          new Date(meal.datecreated).getFullYear() === currentDate.getFullYear()
        );
      })
    );

    if (currentTrackingGoalSleep) {
      setCurrentTrackingSleep(
        trackingSleep.filter((sleep) => {
          const sleepDate = new Date(sleep.datecreated);
          const goalStartDate = new Date(currentTrackingGoalSleep.startdate);
          const goalEndDate = new Date(currentTrackingGoalSleep.enddate);

          return sleepDate >= goalStartDate && sleepDate <= goalEndDate;
        })
      );
    }

    setCurrentTrackingSteps(
      trackingSteps.filter((steps) => {
        return (
          new Date(steps.datecreated).getDate() === currentDate.getDate() &&
          new Date(steps.datecreated).getMonth() === currentDate.getMonth() &&
          new Date(steps.datecreated).getFullYear() ===
            currentDate.getFullYear()
        );
      })
    );

    if (currentTrackingGoalWater) {
      setCurrentTrackingWater(
        trackingWater.filter((water) => {
          const waterDate = new Date(water.datecreated);
          const goalStartDate = new Date(currentTrackingGoalWater.startdate);
          const goalEndDate = new Date(currentTrackingGoalWater.enddate);

          return waterDate >= goalStartDate && waterDate <= goalEndDate;
        })
      );
    }

    if (currentTrackingGoalWorkout) {
      setCurrentTrackingWorkout(
        trackingWorkout.filter((workout) => {
          const workoutDate = new Date(workout.datecreated);
          const goalStartDate = new Date(currentTrackingGoalWorkout.startdate);
          const goalEndDate = new Date(currentTrackingGoalWorkout.enddate);

          return workoutDate >= goalStartDate && workoutDate <= goalEndDate;
        })
      );
    }
  }, [
    currentTrackingGoalCalory,
    currentTrackingGoalSleep,
    currentTrackingGoalSteps,
    currentTrackingGoalWater,
    currentTrackingGoalWorkout,
    trackingWorkout,
    trackingMeal,
    trackingSleep,
    trackingSteps,
    trackingWater,
  ]);

  /*
  ----------------------------------------------
  ------- Current totals of trackings between goal start date and end date
  ----------------------------------------------
  */

  const [totalCalories, setTotalCalories] = useState<number>(0);
  useEffect(() => {
    if (currentTrackingMeal.length === 0) return;

    let totalCaloriesForTheDay = 0;

    currentTrackingMeal.forEach((meal) => {
      // Get all MealFood entries for the current meal
      const mealFoodsForCurrentMeal = mealFoods.filter(
        (mealFood) =>
          mealPlans.find((plan) => meal.mealplan_id === plan.mealplan_id)
            ?.meal_id === mealFood.meal_id
      );

      // Calculate the total calories for the current meal
      const mealCalories = calculateTotalCaloriesForMeal(
        mealFoodsForCurrentMeal,
        foods,
        nutritionalFacts
      );

      // Add the meal's calories to the total
      totalCaloriesForTheDay += mealCalories;
    });

    setTotalCalories(totalCaloriesForTheDay);
  }, [currentTrackingMeal]);

  const [totalSleep, setTotalSleep] = useState<number>(0);
  useEffect(() => {
    if (!currentTrackingSleep) return;
    setTotalSleep(
      currentTrackingSleep.reduce((acc, sleep) => acc + sleep.hours, 0)
    );
  }, [currentTrackingSleep]);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  useEffect(() => {
    if (currentTrackingSteps.length === 0) return;
    setTotalSteps(
      currentTrackingSteps.reduce((acc, steps) => acc + steps.steps, 0)
    );
  }, [currentTrackingSteps]);

  const [totalWater, setTotalWater] = useState<number>(0);
  useEffect(() => {
    if (currentTrackingWater.length === 0) return;
    setTotalWater(
      currentTrackingWater.reduce((acc, water) => acc + water.bottles, 0)
    );
  }, [currentTrackingWater]);

  const [totalWorkout, setTotalWorkout] = useState<number>(0);
  useEffect(() => {
    if (currentTrackingWorkout.length === 0) return;
    setTotalWorkout(currentTrackingWorkout.length);
  }, [currentTrackingWorkout]);

  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      width: "100%",
    },
    dates: {
      fontSize: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.primary,
    },
    section: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: Platform.OS !== "web" ? "95%" : "50%",
      marginVertical: 15,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 25,
      backgroundColor: theme.colors.primary,
      padding: 10,
      // backgroundColor: "red",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    sectionTitleContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "50%",
      flexDirection: "row",
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.secondary,
      borderWidth: 1,
      borderRadius: 14,
      padding: 5,
      marginBottom: 5,
    },
    sectionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 20,
    },
    textContainer: {
      paddingVertical: 40,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    pressed: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      {!currentTrackingGoalCalory &&
      !currentTrackingGoalSleep &&
      !currentTrackingGoalSteps &&
      !currentTrackingGoalWorkout &&
      !currentTrackingGoalWater ? (
        <View style={styles.textContainer}>
          <Text>Set Some Goals!</Text>
        </View>
      ) : (
        <>
          {currentTrackingGoalCalory && (
            <Pressable
              style={({ pressed }) => [
                pressed && styles.pressed,
                styles.section,
              ]}
              onPress={() => navigation.navigate("TrackingMeals")}
            >
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Calories</Text>
              </View>
              <Text>
                Progress:{" "}
                {currentTrackingGoalCalory.calorycount
                  ? (
                      (totalCalories / currentTrackingGoalCalory.calorycount) *
                      100
                    ).toFixed(2)
                  : 0}
                %
              </Text>
              <View style={styles.sectionRow}>
                <Text style={styles.dates}>
                  {formatDate(new Date(currentTrackingGoalCalory.startdate))}
                </Text>
                <Text style={styles.dates}>
                  {formatDate(new Date(currentTrackingGoalCalory.enddate))}
                </Text>
              </View>
              <View style={styles.sectionRow}>
                <Text>Calory Goal</Text>
                <Text>
                  {currentTrackingGoalCalory.calorycount
                    ? currentTrackingGoalCalory.calorycount
                    : 0}
                </Text>
              </View>
              <View style={styles.sectionRow}>
                <Text>Total Calories</Text>
                <Text>{totalCalories}</Text>
              </View>
            </Pressable>
          )}
          {currentTrackingGoalSleep && (
            <Pressable
              style={({ pressed }) => [
                pressed && styles.pressed,
                styles.section,
              ]}
              onPress={() => navigation.navigate("TrackingSleep")}
            >
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Sleep</Text>
              </View>
              <Text>
                Progress:{" "}
                {currentTrackingGoalSleep.sleepcount
                  ? (
                      (totalSleep / currentTrackingGoalSleep.sleepcount) *
                      100
                    ).toFixed(2)
                  : 0}
                %
              </Text>
              <View style={styles.sectionRow}>
                <Text style={styles.dates}>
                  {formatDate(new Date(currentTrackingGoalSleep.startdate))}
                </Text>
                <Text style={styles.dates}>
                  {formatDate(new Date(currentTrackingGoalSleep.enddate))}
                </Text>
              </View>
              <View style={styles.sectionRow}>
                <Text>Sleep Goal</Text>
                <Text>
                  {currentTrackingGoalSleep.sleepcount
                    ? currentTrackingGoalSleep.sleepcount
                    : 0}
                </Text>
              </View>
              <View style={styles.sectionRow}>
                <Text>Total Sleep</Text>
                <Text>{totalSleep}</Text>
              </View>
            </Pressable>
          )}
          {currentTrackingGoalSteps && (
            <Pressable
              style={({ pressed }) => [
                pressed && styles.pressed,
                styles.section,
              ]}
              onPress={() => navigation.navigate("TrackingSteps")}
            >
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Steps</Text>
              </View>
              <Text>
                Progress:{" "}
                {currentTrackingGoalSteps.stepcount
                  ? (
                      (totalSteps / currentTrackingGoalSteps.stepcount) *
                      100
                    ).toFixed(2)
                  : 0}
                %
              </Text>
              <View style={styles.sectionRow}>
                <Text style={styles.dates}>
                  {formatDate(new Date(currentTrackingGoalSteps.startdate))}
                </Text>
                <Text style={styles.dates}>
                  {formatDate(new Date(currentTrackingGoalSteps.enddate))}
                </Text>
              </View>
              <View style={styles.sectionRow}>
                <Text>Steps Goal</Text>
                <Text>
                  {currentTrackingGoalSteps.stepcount
                    ? currentTrackingGoalSteps.stepcount
                    : 0}
                </Text>
              </View>
              <View style={styles.sectionRow}>
                <Text>Total Steps</Text>
                <Text>{totalSteps}</Text>
              </View>
            </Pressable>
          )}
          {currentTrackingGoalWater && (
            <Pressable
              style={({ pressed }) => [
                pressed && styles.pressed,
                styles.section,
              ]}
              onPress={() => navigation.navigate("TrackingWater")}
            >
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Water</Text>
              </View>
              <Text>
                Progress:{" "}
                {currentTrackingGoalWater.watercount
                  ? (
                      (totalWater / currentTrackingGoalWater.watercount) *
                      100
                    ).toFixed(2)
                  : 0}
                %
              </Text>
              <View style={styles.sectionRow}>
                <Text style={styles.dates}>
                  {formatDate(new Date(currentTrackingGoalWater.startdate))}
                </Text>
                <Text style={styles.dates}>
                  {formatDate(new Date(currentTrackingGoalWater.enddate))}
                </Text>
              </View>
              <View style={styles.sectionRow}>
                <Text>Water Goal</Text>
                <Text>
                  {currentTrackingGoalWater.watercount
                    ? currentTrackingGoalWater.watercount
                    : 0}
                </Text>
              </View>
              <View style={styles.sectionRow}>
                <Text>Total Water</Text>
                <Text>{totalWater}</Text>
              </View>
            </Pressable>
          )}
          {currentTrackingGoalWorkout && (
            <Pressable
              style={({ pressed }) => [
                pressed && styles.pressed,
                styles.section,
              ]}
              onPress={() => navigation.navigate("TrackingWorkouts")}
            >
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Workouts</Text>
              </View>
              <Text>
                Progress:{" "}
                {currentTrackingGoalWorkout.workoutcount
                  ? (
                      (totalWorkout / currentTrackingGoalWorkout.workoutcount) *
                      100
                    ).toFixed(2)
                  : 0}
                %
              </Text>
              <View style={styles.sectionRow}>
                <Text style={styles.dates}>
                  {formatDate(new Date(currentTrackingGoalWorkout.startdate))}
                </Text>
                <Text style={styles.dates}>
                  {formatDate(new Date(currentTrackingGoalWorkout.enddate))}
                </Text>
              </View>
              <View style={styles.sectionRow}>
                <Text>Workout Goal</Text>
                <Text>
                  {currentTrackingGoalWorkout.workoutcount
                    ? currentTrackingGoalWorkout.workoutcount
                    : 0}
                </Text>
              </View>
              <View style={styles.sectionRow}>
                <Text>Total Workouts</Text>
                <Text>{totalWorkout}</Text>
              </View>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}

/*
----------------------------------------------
------- Calculate Calories  -------
----------------------------------------------
*/

function calculateCaloriesFromNutritionalFact(
  nutritionalFact: NutritionalFact
): number {
  const { totalcarbs, protein, totalfat } = nutritionalFact;

  // Each gram of carbs and protein provides 4 calories, each gram of fat provides 9 calories
  const calories = totalcarbs * 4 + protein * 4 + totalfat * 9;

  return calories;
}

function calculateTotalCaloriesForMeal(
  mealFoods: MealFood[],
  foods: Food[],
  nutritionalFacts: NutritionalFact[]
): number {
  let totalCalories = 0;

  mealFoods.forEach((mealFood) => {
    // Find the corresponding food and its nutritional facts
    const food = foods.find((f) => f.food_id === mealFood.food_id);
    const nutritionalFact = nutritionalFacts.find(
      (nf) => nf.food_id === mealFood.food_id
    );

    if (food && nutritionalFact) {
      const foodCalories =
        calculateCaloriesFromNutritionalFact(nutritionalFact);
      totalCalories += foodCalories * mealFood.quantity; // Adjust for quantity
    }
  });

  return totalCalories;
}
