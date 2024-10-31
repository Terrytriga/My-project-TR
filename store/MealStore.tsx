import { create } from "zustand";
import {
  Food,
  FoodCategory,
  Meal,
  MealFood,
  MealInstruction,
  MealPlan,
  MealType,
  NewMeal,
  NewMealFood,
  NewMealInstruction,
  NutritionalFact,
} from "../utils/Types";
import { supabase } from "../lib/SupaBase";
import { useUserStore } from "./UserStore";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*
-------------------------------------------------------------------------
---------------------------- MealStore -------------------------
-------------------------------------------------------------------------
*/
interface MealsState {
  meals: Meal[];
  fetchMeals: () => Promise<void>;
  addMeal: (meal: Meal) => void;
  deleteMeal: (meal_id: number) => void;
  updateMeal: (meal: Meal) => void;
}
export const useMealStore = create<MealsState>((set) => ({
  meals: [],
  fetchMeals: async () => {
    const { data: mealData, error: mealError } = await supabase
      .from("meal")
      .select("*");
    if (mealError) {
      return;
    }
    set({ meals: mealData });
  },
  addMeal: (meal) => set((state) => ({ meals: [...state.meals, meal] })),
  deleteMeal: (meal_id) =>
    set((state) => ({
      meals: state.meals.filter((meal) => meal.meal_id !== meal_id),
    })),
  updateMeal: (meal) =>
    set((state) => ({
      meals: state.meals.map((m) => (m.meal_id === meal.meal_id ? meal : m)),
    })),
}));

/*
-------------------------------------------------------------------------
---------------------------- MealPlanStore -------------------------
-------------------------------------------------------------------------
*/

interface MealPlansState {
  mealPlans: MealPlan[];
  fetchMealPlans: () => Promise<void>;
  addMealPlan: (meal: MealPlan) => void;
  updateMealPlan: (meal: MealPlan) => void;
  deleteMealPlan: (mealplan_id: number) => void;
  deleteMealPlanMeal: (meal_id: number) => void;
}

export const useMealPlanStore = create<MealPlansState>((set) => ({
  mealPlans: [],
  fetchMealPlans: async () => {
    const { user } = useUserStore.getState();
    if (!user) return;
    const { data: mealPlanData, error: mealPlanError } = await supabase
      .from("mealplan")
      .select("*")
      .eq("user_id", user.id);
    if (mealPlanError) {
      return;
    }
    set({ mealPlans: mealPlanData });
  },
  updateMealPlan: (mealPlan) =>
    set((state) => ({
      mealPlans: state.mealPlans.map((plan) =>
        plan.mealplan_id === mealPlan.mealplan_id ? mealPlan : plan
      ),
    })),
  addMealPlan: (mealPlan) =>
    set((state) => ({ mealPlans: [...state.mealPlans, mealPlan] })),
  deleteMealPlan: (mealplan_id) =>
    set((state) => ({
      mealPlans: state.mealPlans.filter(
        (mealPlan) => mealPlan.mealplan_id !== mealplan_id
      ),
    })),
  deleteMealPlanMeal: (meal_id) =>
    set((state) => ({
      mealPlans: state.mealPlans.filter(
        (mealPlan) => mealPlan.meal_id !== meal_id
      ),
    })),
}));

/*
-------------------------------------------------------------------------
---------------------------- MealType Store -------------------------
-------------------------------------------------------------------------
*/

interface MealTypeState {
  mealTypes: MealType[];
  fetchMealTypes: () => Promise<void>;
}

export const useMealTypeStore = create<MealTypeState>((set) => ({
  mealTypes: [],
  fetchMealTypes: async () => {
    const { data: mealTypeData, error: mealTypeError } = await supabase
      .from("mealtype")
      .select("*");

    if (mealTypeError) {
      return;
    }

    if (mealTypeData) {
      set({ mealTypes: mealTypeData });
    }
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- MealInstructionStore -------------------------
-------------------------------------------------------------------------
*/

interface MealInstructionState {
  mealInstructions: MealInstruction[];
  fetchMealInstructions: () => Promise<void>;
  addMealInstruction: (instruction: MealInstruction) => void;
  deleteMealInstruction: (meal_id: number) => void;
}

export const useMealInstructionStore = create<MealInstructionState>((set) => ({
  mealInstructions: [],
  fetchMealInstructions: async () => {
    const { data: mealInstructionData, error: mealInstructionError } =
      await supabase.from("mealinstruction").select("*");

    if (mealInstructionError) {
      return;
    }

    if (mealInstructionData) {
      set({ mealInstructions: mealInstructionData });
    }
  },
  addMealInstruction: (instruction) =>
    set((state) => ({
      mealInstructions: [...state.mealInstructions, instruction],
    })),
  deleteMealInstruction: (mealinstruction_id) =>
    set((state) => ({
      mealInstructions: state.mealInstructions.filter(
        (ins) => ins.mealinstruction_id !== mealinstruction_id
      ),
    })),
}));

/*
-------------------------------------------------------------------------
---------------------------- MealFoodStore -------------------------
-------------------------------------------------------------------------
*/

interface MealFoodState {
  mealFoods: MealFood[];
  fetchMealFoods: () => Promise<void>;
  addMealFood: (mealFood: MealFood) => void;
  deleteMealFood: (mealfood_id: number) => void;
}

export const useMealFoodStore = create<MealFoodState>((set) => ({
  mealFoods: [],
  fetchMealFoods: async () => {
    const { data: mealFoodData, error: mealFoodError } = await supabase
      .from("mealfood")
      .select("*");

    if (mealFoodError) {
      return;
    }

    if (mealFoodData) {
      set({ mealFoods: mealFoodData });
    }
  },
  addMealFood: (mealFood) =>
    set((state) => ({ mealFoods: [...state.mealFoods, mealFood] })),
  deleteMealFood: (mealfood_id) =>
    set((state) => ({
      mealFoods: state.mealFoods.filter(
        (mealFood) => mealFood.mealfood_id !== mealfood_id
      ),
    })),
}));

/*
-------------------------------------------------------------------------
---------------------------- FoodStore -------------------------
-------------------------------------------------------------------------
*/

interface FoodState {
  foods: Food[];
  fetchFoods: () => Promise<void>;
  addFood: (food: Food) => void;
  updateFood: (food: Food) => void;
  deleteFood: (food_id: number) => void;
}

export const useFoodStore = create<FoodState>((set) => ({
  foods: [],
  fetchFoods: async () => {
    const { data: foodData, error: foodError } = await supabase
      .from("food")
      .select("*");

    if (foodError) {
      return;
    }

    if (foodData) {
      set({ foods: foodData });
    }
  },
  addFood: (food) => set((state) => ({ foods: [...state.foods, food] })),
  updateFood: (food) =>
    set((state) => ({
      foods: state.foods.map((f) => (f.food_id === food.food_id ? food : f)),
    })),
  deleteFood: (food_id) =>
    set((state) => ({
      foods: state.foods.filter((food) => food.food_id !== food_id),
    })),
}));

/*
-------------------------------------------------------------------------
---------------------------- FoodCategorytore -------------------------
-------------------------------------------------------------------------
*/

interface FoodCategoryState {
  foodCategories: FoodCategory[];
  fetchFoodCategories: () => Promise<void>;
}

export const useFoodCategoryStore = create<FoodCategoryState>((set) => ({
  foodCategories: [],
  fetchFoodCategories: async () => {
    const { data: foodCategoryData, error: foodCategoryError } = await supabase
      .from("foodcategory")
      .select("*");

    if (foodCategoryError) {
      return;
    }

    if (foodCategoryData) {
      set({ foodCategories: foodCategoryData });
    }
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- NutriotionalFactStore -------------------------
-------------------------------------------------------------------------
*/

interface NutritionalFactState {
  nutritionalFacts: NutritionalFact[];
  fetchNutritionalFacts: () => Promise<void>;
  addNutritionalFact: (nutritionalFact: NutritionalFact) => void;
  updateNutritionalFact: (nutritionalFact: NutritionalFact) => void;
  deleteNutritionalFact: (food_id: number) => void;
}

export const useNutritionalFactStore = create<NutritionalFactState>((set) => ({
  nutritionalFacts: [],
  fetchNutritionalFacts: async () => {
    const { data: nutritionalFactData, error: nutritionalFactError } =
      await supabase.from("nutritionalfact").select("*");

    if (nutritionalFactError) {
      return;
    }

    if (nutritionalFactData) {
      set({ nutritionalFacts: nutritionalFactData });
    }
  },
  addNutritionalFact: (nutritionalFact) =>
    set((state) => ({
      nutritionalFacts: [...state.nutritionalFacts, nutritionalFact],
    })),
  updateNutritionalFact: (nutritionalFact) =>
    set((state) => ({
      nutritionalFacts: state.nutritionalFacts.map((fact) =>
        fact.food_id === nutritionalFact.food_id ? nutritionalFact : fact
      ),
    })),
  deleteNutritionalFact: (food_id) =>
    set((state) => ({
      nutritionalFacts: state.nutritionalFacts.filter(
        (fact) => fact.food_id !== food_id
      ),
    })),
}));

/*
-------------------------------------------------------------------
---------------------------- NewMealStore -------------------------
-------------------------------------------------------------------
-------------------------- Dietitian New Meal ---------------------
-------------------------------------------------------------------
*/

interface MealState {
  meal: NewMeal | null;
  mealFoods: NewMealFood[];
  mealInstructions: NewMealInstruction[];
  setMeal: (meal: NewMeal) => void;
  addMealFood: (mealFood: NewMealFood) => void;
  deleteMealFood: (mealFood: NewMealFood) => void;
  addMealInstruction: (instruction: NewMealInstruction) => void;
  deleteMealInstruction: (instruction: NewMealInstruction) => void;
  clearMeal: () => void;
}

export const useNewMealStore = create<MealState>()(
  persist(
    (set) => ({
      meal: null,
      mealFoods: [],
      mealInstructions: [],
      setMeal: (meal) => set({ meal }),
      addMealFood: (mealFood) =>
        set((state) => ({ mealFoods: [...state.mealFoods, mealFood] })),
      deleteMealFood: (mealFood) =>
        set((state) => ({
          mealFoods: state.mealFoods.filter((food) => food !== mealFood),
        })),
      addMealInstruction: (instruction) =>
        set((state) => ({
          mealInstructions: [...state.mealInstructions, instruction],
        })),
      deleteMealInstruction: (instruction) =>
        set((state) => ({
          mealInstructions: state.mealInstructions.filter(
            (ins) => ins !== instruction
          ),
        })),
      clearMeal: async () => {
        set({ meal: null, mealFoods: [], mealInstructions: [] });
        await AsyncStorage.removeItem("new-meal-storage");
      },
    }),
    {
      name: "new-meal-storage", // Key for storage
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
    }
  )
);

interface EditMealState {
  meal: Meal | null;
  mealFoods: NewMealFood[];
  mealInstructions: NewMealInstruction[];
  setMeal: (meal: Meal) => void;
  setMealFoods: (mealFoods: NewMealFood[]) => void;
  addMealFood: (mealFood: NewMealFood) => void;
  deleteMealFood: (food_id: NewMealFood) => void;
  setMealInstructions: (mealInstructions: NewMealInstruction[]) => void;
  addMealInstruction: (instruction: NewMealInstruction) => void;
  deleteMealInstruction: (instruction: NewMealInstruction) => void;
  clearMeal: () => void;
}

export const useEditMealStore = create<EditMealState>()(
  persist(
    (set) => ({
      meal: null,
      mealFoods: [],
      mealInstructions: [],
      setMeal: (meal) => set({ meal }),
      setMealFoods: (mealFoods) => set({ mealFoods }),
      addMealFood: (mealFood) =>
        set((state) => ({ mealFoods: [...state.mealFoods, mealFood] })),
      deleteMealFood: (deleteMealFood) =>
        set((state) => ({
          mealFoods: state.mealFoods.filter(
            (mealFood) => mealFood !== deleteMealFood
          ),
        })),
      setMealInstructions: (mealInstructions) => set({ mealInstructions }),
      addMealInstruction: (instruction) =>
        set((state) => ({
          mealInstructions: [...state.mealInstructions, instruction],
        })),
      deleteMealInstruction: (instruction) =>
        set((state) => ({
          mealInstructions: state.mealInstructions.filter(
            (ins) => ins !== instruction
          ),
        })),
      clearMeal: async () => {
        set({ meal: null, mealFoods: [], mealInstructions: [] });
        await AsyncStorage.removeItem("edit-meal-storage");
      },
    }),
    {
      name: "edit-meal-storage", // Key for storage
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
    }
  )
);
