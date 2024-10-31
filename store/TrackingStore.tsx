import { create } from "zustand";
import {
  TrackingGoalCalory,
  TrackingGoalSleep,
  TrackingGoalSteps,
  TrackingGoalWater,
  TrackingGoalWorkout,
  TrackingMeal,
  TrackingMenstruation,
  TrackingSleep,
  TrackingSteps,
  TrackingToDo,
  TrackingWater,
  TrackingWorkout,
} from "../utils/Types";
import { useUserStore } from "./UserStore";
import { supabase } from "../lib/SupaBase";

/*
-------------------------------------------------------------------------
---------------------------- User Tracking -------------------------
-------------------------------------------------------------------------
*/

interface TrackingState {
  trackingSleep: TrackingSleep[] | [];
  addTrackingSleep: (tracking: TrackingSleep) => void;
  updateTrackingSleep: (tracking: TrackingSleep) => void;
  trackingWater: TrackingWater[] | [];
  addTrackingWater: (tracking: TrackingWater) => void;
  deleteTrackingWater: (tracking: TrackingWater) => void;
  trackingSteps: TrackingSteps[] | [];
  addTrackingSteps: (tracking: TrackingSteps) => void;
  deleteTrackingSteps: (tracking: TrackingSteps) => void;
  trackingMenstruation: TrackingMenstruation[] | [];
  addTrackingMenstruation: (tracking: TrackingMenstruation) => void;
  updateTrackingMenstruation: (tracking: TrackingMenstruation) => void;
  deleteTrackingMenstruation: (tracking: TrackingMenstruation) => void;
  trackingWorkout: TrackingWorkout[] | [];
  addTrackingWorkout: (tracking: TrackingWorkout) => void;
  deleteTrackingWorkout: (tracking: TrackingWorkout) => void;
  trackingMeal: TrackingMeal[] | [];
  addTrackingMeal: (tracking: TrackingMeal) => void;
  deleteTrackingMeal: (tracking: TrackingMeal) => void;
  trackingGoalWorkout: TrackingGoalWorkout[] | [];
  addTrackingGoalWorkout: (tracking: TrackingGoalWorkout) => void;
  deleteTrackingGoalWorkout: (tracking: TrackingGoalWorkout) => void;
  updateTrackingGoalWorkout: (tracking: TrackingGoalWorkout) => void;
  trackingGoalCalory: TrackingGoalCalory[] | [];
  addTrackingGoalCalory: (tracking: TrackingGoalCalory) => void;
  deleteTrackingGoalCalory: (tracking: TrackingGoalCalory) => void;
  updateTrackingGoalCalory: (tracking: TrackingGoalCalory) => void;
  trackingGoalWater: TrackingGoalWater[] | [];
  addTrackingGoalWater: (tracking: TrackingGoalWater) => void;
  deleteTrackingGoalWater: (tracking: TrackingGoalWater) => void;
  updateTrackingGoalWater: (tracking: TrackingGoalWater) => void;
  trackingGoalSteps: TrackingGoalSteps[] | [];
  addTrackingGoalSteps: (tracking: TrackingGoalSteps) => void;
  deleteTrackingGoalSteps: (tracking: TrackingGoalSteps) => void;
  updateTrackingGoalSteps: (tracking: TrackingGoalSteps) => void;
  trackingGoalSleep: TrackingGoalSleep[] | [];
  addTrackingGoalSleep: (tracking: TrackingGoalSleep) => void;
  deleteTrackingGoalSleep: (tracking: TrackingGoalSleep) => void;
  updateTrackingGoalSleep: (tracking: TrackingGoalSleep) => void;
  trackingToDo: TrackingToDo[] | [];
  addTrackingToDo: (tracking: TrackingToDo) => void;
  deleteTrackingToDo: (tracking: TrackingToDo) => void;
  updateTrackingToDo: (tracking: TrackingToDo) => void;
  fetchTrackings: () => Promise<void>;
}

export const useTrackingStore = create<TrackingState>((set) => ({
  trackingSleep: [],
  addTrackingSleep: (tracking: TrackingSleep) => {
    set((state) => ({ trackingSleep: [...state.trackingSleep, tracking] }));
  },
  updateTrackingSleep: (tracking: TrackingSleep) => {
    set((state) => ({
      trackingSleep: state.trackingSleep.map((item) =>
        item.id === tracking.id ? tracking : item
      ),
    }));
  },
  trackingWater: [],
  addTrackingWater: (tracking: TrackingWater) => {
    set((state) => ({ trackingWater: [...state.trackingWater, tracking] }));
  },
  deleteTrackingWater: (tracking: TrackingWater) => {
    set((state) => ({
      trackingWater: state.trackingWater.filter(
        (item) => item.id !== tracking.id
      ),
    }));
  },
  trackingSteps: [],
  addTrackingSteps: (tracking: TrackingSteps) => {
    set((state) => ({ trackingSteps: [...state.trackingSteps, tracking] }));
  },
  deleteTrackingSteps: (tracking: TrackingSteps) => {
    set((state) => ({
      trackingSteps: state.trackingSteps.filter(
        (item) => item.id !== tracking.id
      ),
    }));
  },
  trackingMenstruation: [],
  addTrackingMenstruation: (tracking: TrackingMenstruation) => {
    set((state) => ({
      trackingMenstruation: [...state.trackingMenstruation, tracking],
    }));
  },
  updateTrackingMenstruation: (tracking: TrackingMenstruation) => {
    set((state) => ({
      trackingMenstruation: state.trackingMenstruation.map((item) =>
        item.id === tracking.id ? tracking : item
      ),
    }));
  },
  deleteTrackingMenstruation: (tracking: TrackingMenstruation) => {
    set((state) => ({
      trackingMenstruation: state.trackingMenstruation.filter(
        (item) => item.id !== tracking.id
      ),
    }));
  },
  trackingWorkout: [],
  addTrackingWorkout: (tracking: TrackingWorkout) => {
    set((state) => ({ trackingWorkout: [...state.trackingWorkout, tracking] }));
  },
  deleteTrackingWorkout: (tracking: TrackingWorkout) => {
    set((state) => ({
      trackingWorkout: state.trackingWorkout.filter(
        (item) => item.id !== tracking.id
      ),
    }));
  },
  trackingMeal: [],
  addTrackingMeal: (tracking: TrackingMeal) => {
    set((state) => ({ trackingMeal: [...state.trackingMeal, tracking] }));
  },
  deleteTrackingMeal: (tracking: TrackingMeal) => {
    set((state) => ({
      trackingMeal: state.trackingMeal.filter(
        (item) => item.id !== tracking.id
      ),
    }));
  },
  trackingGoalWorkout: [],
  addTrackingGoalWorkout: (tracking: TrackingGoalWorkout) => {
    set((state) => ({
      trackingGoalWorkout: [...state.trackingGoalWorkout, tracking],
    }));
  },
  deleteTrackingGoalWorkout: (tracking: TrackingGoalWorkout) => {
    set((state) => ({
      trackingGoalWorkout: state.trackingGoalWorkout.filter(
        (item) => item.id !== tracking.id
      ),
    }));
  },
  updateTrackingGoalWorkout: (tracking: TrackingGoalWorkout) => {
    set((state) => ({
      trackingGoalWorkout: state.trackingGoalWorkout.map((item) =>
        item.id === tracking.id ? tracking : item
      ),
    }));
  },
  trackingGoalCalory: [],
  addTrackingGoalCalory: (tracking: TrackingGoalCalory) => {
    set((state) => ({
      trackingGoalCalory: [...state.trackingGoalCalory, tracking],
    }));
  },
  deleteTrackingGoalCalory: (tracking: TrackingGoalCalory) => {
    set((state) => ({
      trackingGoalCalory: state.trackingGoalCalory.filter(
        (item) => item.id !== tracking.id
      ),
    }));
  },
  updateTrackingGoalCalory: (tracking: TrackingGoalCalory) => {
    set((state) => ({
      trackingGoalCalory: state.trackingGoalCalory.map((item) =>
        item.id === tracking.id ? tracking : item
      ),
    }));
  },
  trackingGoalWater: [],
  addTrackingGoalWater: (tracking: TrackingGoalWater) => {
    set((state) => ({
      trackingGoalWater: [...state.trackingGoalWater, tracking],
    }));
  },
  deleteTrackingGoalWater: (tracking: TrackingGoalWater) => {
    set((state) => ({
      trackingGoalWater: state.trackingGoalWater.filter(
        (item) => item.id !== tracking.id
      ),
    }));
  },
  updateTrackingGoalWater: (tracking: TrackingGoalWater) => {
    set((state) => ({
      trackingGoalWater: state.trackingGoalWater.map((item) =>
        item.id === tracking.id ? tracking : item
      ),
    }));
  },
  trackingGoalSteps: [],
  addTrackingGoalSteps: (tracking: TrackingGoalSteps) => {
    set((state) => ({
      trackingGoalSteps: [...state.trackingGoalSteps, tracking],
    }));
  },
  deleteTrackingGoalSteps: (tracking: TrackingGoalSteps) => {
    set((state) => ({
      trackingGoalSteps: state.trackingGoalSteps.filter(
        (item) => item.id !== tracking.id
      ),
    }));
  },
  updateTrackingGoalSteps: (tracking: TrackingGoalSteps) => {
    set((state) => ({
      trackingGoalSteps: state.trackingGoalSteps.map((item) =>
        item.id === tracking.id ? tracking : item
      ),
    }));
  },
  trackingGoalSleep: [],
  addTrackingGoalSleep: (tracking: TrackingGoalSleep) => {
    set((state) => ({
      trackingGoalSleep: [...state.trackingGoalSleep, tracking],
    }));
  },
  deleteTrackingGoalSleep: (tracking: TrackingGoalSleep) => {
    set((state) => ({
      trackingGoalSleep: state.trackingGoalSleep.filter(
        (item) => item.id !== tracking.id
      ),
    }));
  },
  updateTrackingGoalSleep: (tracking: TrackingGoalSleep) => {
    set((state) => ({
      trackingGoalSleep: state.trackingGoalSleep.map((item) =>
        item.id === tracking.id ? tracking : item
      ),
    }));
  },
  trackingToDo: [],
  addTrackingToDo: (tracking: TrackingToDo) => {
    set((state) => ({ trackingToDo: [...state.trackingToDo, tracking] }));
  },
  deleteTrackingToDo: (tracking: TrackingToDo) => {
    set((state) => ({
      trackingToDo: state.trackingToDo.filter(
        (item) => item.id !== tracking.id
      ),
    }));
  },
  updateTrackingToDo: (tracking: TrackingToDo) => {
    set((state) => ({
      trackingToDo: state.trackingToDo.map((item) =>
        item.id === tracking.id ? tracking : item
      ),
    }));
  },
  fetchTrackings: async () => {
    const user_id = useUserStore.getState().user?.id;

    const { data: trackingSleepData, error: sleepError } = await supabase
      .from("trackingsleep")
      .select("*")
      .eq("user_id", user_id);
    if (sleepError) throw sleepError;

    const { data: trackingWaterData, error: waterError } = await supabase
      .from("trackingwater")
      .select("*")
      .eq("user_id", user_id);
    if (waterError) throw waterError;

    const { data: trackingStepsData, error: stepsError } = await supabase
      .from("trackingsteps")
      .select("*")
      .eq("user_id", user_id);
    if (stepsError) throw stepsError;

    const { data: trackingMenstruationData, error: menstruationError } =
      await supabase
        .from("trackingmenstruation")
        .select("*")
        .eq("user_id", user_id);
    if (menstruationError) throw menstruationError;

    const { data: trackingWorkoutData, error: workoutError } = await supabase
      .from("trackingworkout")
      .select("*")
      .eq("user_id", user_id);
    if (workoutError) throw workoutError;

    const { data: trackingMealData, error: mealError } = await supabase
      .from("trackingmeal")
      .select("*")
      .eq("user_id", user_id);
    if (mealError) throw mealError;

    const { data: trackingGoalWorkoutData, error: goalWorkoutError } =
      await supabase
        .from("trackinggoalworkout")
        .select("*")
        .eq("user_id", user_id);
    if (goalWorkoutError) throw goalWorkoutError;

    const { data: trackingGoalCaloryData, error: goalCaloryError } =
      await supabase
        .from("trackinggoalcalory")
        .select("*")
        .eq("user_id", user_id);
    if (goalCaloryError) throw goalCaloryError;

    const { data: trackingGoalWaterData, error: goalWaterError } =
      await supabase
        .from("trackinggoalwater")
        .select("*")
        .eq("user_id", user_id);
    if (goalWaterError) throw goalWaterError;

    const { data: trackingGoalStepsData, error: goalStepsError } =
      await supabase
        .from("trackinggoalsteps")
        .select("*")
        .eq("user_id", user_id);
    if (goalStepsError) throw goalStepsError;

    const { data: trackingGoalSleepData, error: goalSleepError } =
      await supabase
        .from("trackinggoalsleep")
        .select("*")
        .eq("user_id", user_id);
    if (goalSleepError) throw goalSleepError;

    const { data: trackingToDoData, error: toDoError } = await supabase
      .from("trackingtodo")
      .select("*")
      .eq("user_id", user_id);
    if (toDoError) throw toDoError;

    set({
      trackingSleep: trackingSleepData,
      trackingWater: trackingWaterData,
      trackingSteps: trackingStepsData,
      trackingMenstruation: trackingMenstruationData,
      trackingWorkout: trackingWorkoutData,
      trackingMeal: trackingMealData,
      trackingGoalWorkout: trackingGoalWorkoutData,
      trackingGoalCalory: trackingGoalCaloryData,
      trackingGoalWater: trackingGoalWaterData,
      trackingGoalSteps: trackingGoalStepsData,
      trackingGoalSleep: trackingGoalSleepData,
      trackingToDo: trackingToDoData,
    });
  },
}));

// interface CycleStatusState {
//   cycleStatuses: CycleStatus[] | [];
//   fetchCycleStatuses: () => Promise<void>;
// }

// export const useCycleStatusStore = create<CycleStatusState>((set) => ({
//   cycleStatuses: [],
//   fetchCycleStatuses: async () => {
//     const user_id = useUserStore.getState().user?.id;

//     const { data: cycleStatusData, error: cycleStatusError } = await supabase
//       .from("cyclestatus")
//       .select("*");
//     if (cycleStatusError) return;

//     set({ cycleStatuses: cycleStatusData });
//   },
// }));
