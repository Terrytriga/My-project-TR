import { create } from "zustand";
import {
  AssessmentBMI,
  AssessmentGoal,
  AssessmentMedication,
  AssessmentMenstruation,
  AssessmentMentalHealthSymptom,
  AssessmentMood,
  AssessmentPhysicalDistress,
  AssessmentProHelp,
  AssessmentSleepQuality,
  AssessmentStressLevel,
  AssessmentTakingMedication,
  Goal,
  Medication,
  MentalHealthSymptom,
  Mood,
  SleepQuality,
  TakingMedication,
  User,
} from "../utils/Types";
import { supabase } from "../lib/SupaBase";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "./UserStore";

/*
-------------------------------------------------------------------------
---------------------------- User Assessment -------------------------
-------------------------------------------------------------------------
*/

interface AssessmentState {
  goal: AssessmentGoal[] | [];
  bmi: AssessmentBMI[] | [];
  menstruation: AssessmentMenstruation[] | [];
  mood: AssessmentMood[] | [];
  professionalHelp: AssessmentProHelp[] | [];
  physicalDistress: AssessmentPhysicalDistress[] | [];
  sleepQuality: AssessmentSleepQuality[] | [];
  takingMedication: AssessmentTakingMedication[] | [];
  medications: AssessmentMedication[] | [];
  mentalHealthSymptoms: AssessmentMentalHealthSymptom[] | [];
  stressLevel: AssessmentStressLevel[] | [];
  fetchAssessments: () => Promise<void>;
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  goal: [],
  bmi: [],
  menstruation: [],
  mood: [],
  professionalHelp: [],
  physicalDistress: [],
  sleepQuality: [],
  takingMedication: [],
  medications: [],
  mentalHealthSymptoms: [],
  stressLevel: [],
  fetchAssessments: async () => {
    const { user } = useUserStore.getState();
    if (!user) {
      return;
    }

    const userId = user.id;

    const { data: goalData, error: goalError } = await supabase
      .from("assessmentgoal")
      .select("*")
      .eq("user_id", userId);

    const { data: bmiData, error: bmiError } = await supabase
      .from("assessmentbmi")
      .select("*")
      .eq("user_id", userId);

    const { data: menstruationData, error: menstruationError } = await supabase
      .from("assessmentmenstruation")
      .select("*")
      .eq("user_id", userId);

    const { data: moodData, error: moodError } = await supabase
      .from("assessmentmood")
      .select("*")
      .eq("user_id", userId);

    const { data: professionalHelpData, error: professionalHelpError } =
      await supabase
        .from("assessmentprohelp")
        .select("*")
        .eq("user_id", userId);

    const { data: physicalDistressData, error: physicalDistressError } =
      await supabase
        .from("assessmentphysicaldistress")
        .select("*")
        .eq("user_id", userId);

    const { data: sleepQualityData, error: sleepQualityError } = await supabase
      .from("assessmentsleepquality")
      .select("*")
      .eq("user_id", userId);

    const { data: takingMedicationData, error: takingMedicationError } =
      await supabase
        .from("assessmenttakingmedication")
        .select("*")
        .eq("user_id", userId);

    const { data: medicationsData, error: medicationsError } = await supabase
      .from("assessmentmedication")
      .select("*")
      .eq("user_id", userId);

    const { data: mentalHealthSymptomsData, error: mentalHealthSymptomsError } =
      await supabase
        .from("assessmentmentalhealthsymptoms")
        .select("*")
        .eq("user_id", userId);

    const { data: stressLevelData, error: stressLevelError } = await supabase
      .from("assessmentstresslevel")
      .select("*")
      .eq("user_id", userId);

    if (
      goalError ||
      bmiError ||
      menstruationError ||
      moodError ||
      professionalHelpError ||
      physicalDistressError ||
      sleepQualityError ||
      takingMedicationError ||
      medicationsError ||
      mentalHealthSymptomsError ||
      stressLevelError
    ) {
      return;
    }

    set({
      goal: goalData || [],
      bmi: bmiData || [],
      menstruation: menstruationData || [],
      mood: moodData || [],
      professionalHelp: professionalHelpData || [],
      physicalDistress: physicalDistressData || [],
      sleepQuality: sleepQualityData || [],
      takingMedication: takingMedicationData || [],
      medications: medicationsData || [],
      mentalHealthSymptoms: mentalHealthSymptomsData || [],
      stressLevel: stressLevelData || [],
    });
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- NewAssessmentStore -------------------------
-------------------------------------------------------------------------
*/

interface NewAssessmentState {
  user: User | null;
  goal: AssessmentGoal | null;
  bmi: AssessmentBMI | null;
  menstruation: AssessmentMenstruation | null;
  mood: AssessmentMood | null;
  professionalHelp: AssessmentProHelp | null;
  physicalDistress: AssessmentPhysicalDistress | null;
  sleepQuality: AssessmentSleepQuality | null;
  takingMedication: AssessmentTakingMedication | null;
  medications: AssessmentMedication[] | [];
  mentalHealthSymptoms: AssessmentMentalHealthSymptom[] | [];
  stressLevel: AssessmentStressLevel | null;
  setUser: (user: Partial<User> | null) => void;
  setGoal: (goal: AssessmentGoal) => void;
  setBMI: (bmi: AssessmentBMI) => void;
  setMenstruation: (menstruation: AssessmentMenstruation) => void;
  setMood: (mood: AssessmentMood) => void;
  setProfessionalHelp: (professionalHelp: AssessmentProHelp) => void;
  setPhysicalDistress: (physicalDistress: AssessmentPhysicalDistress) => void;
  setSleepQuality: (sleepQuality: AssessmentSleepQuality) => void;
  setTakingMedication: (takingMedication: AssessmentTakingMedication) => void;
  addMedication: (medication: AssessmentMedication) => void;
  deleteMedication: (medication_id: number) => void;
  addMentalHealthSymptom: (
    mentalHealthSymptom: AssessmentMentalHealthSymptom
  ) => void;
  deleteMentalHealthSymptom: (mentalHealthSymptom_id: number) => void;
  setStressLevel: (stressLevel: AssessmentStressLevel) => void;
  clearAssessment: () => void;
}

export const useNewAssessmentStore = create<NewAssessmentState>()(
  persist(
    (set) => ({
      user: null,
      goal: null,
      bmi: null,
      menstruation: null,
      mood: null,
      professionalHelp: null,
      physicalDistress: null,
      sleepQuality: null,
      takingMedication: null,
      medications: [],
      mentalHealthSymptoms: [],
      stressLevel: null,
      challengeWorkouts: [],
      setUser: (userDetails: Partial<User> | null) => {
        set((state) => {
          const newUser =
            userDetails === null ? null : { ...state.user, ...userDetails };
          return { ...state, user: newUser };
        });
      },
      setGoal: (goal) => set({ goal }),
      setBMI: (bmi) => set({ bmi }),
      setMenstruation: (menstruation) => set({ menstruation }),
      setMood: (mood) => set({ mood }),
      setProfessionalHelp: (professionalHelp) => set({ professionalHelp }),
      setPhysicalDistress: (physicalDistress) => set({ physicalDistress }),
      setSleepQuality: (sleepQuality) => set({ sleepQuality }),
      setTakingMedication: (takingMedication) => set({ takingMedication }),
      addMedication: (medication) =>
        set((state) => ({
          medications: [...state.medications, medication],
        })),
      deleteMedication: (medication_id) =>
        set((state) => ({
          medications: state.medications.filter(
            (medication) => medication.medication_id !== medication_id
          ),
        })),
      addMentalHealthSymptom: (mentalHealthSymptom) =>
        set((state) => ({
          mentalHealthSymptoms: [
            ...state.mentalHealthSymptoms,
            mentalHealthSymptom,
          ],
        })),
      deleteMentalHealthSymptom: (mentalHealthSymptom_id) =>
        set((state) => ({
          mentalHealthSymptoms: state.mentalHealthSymptoms.filter(
            (mentalHealthSymptom) =>
              mentalHealthSymptom.mentalhealthsymptom_id !==
              mentalHealthSymptom_id
          ),
        })),
      setStressLevel: (stressLevel) => set({ stressLevel }),
      clearAssessment: async () => {
        set({
          user: null,
          goal: null,
          bmi: null,
          menstruation: null,
          mood: null,
          professionalHelp: null,
          physicalDistress: null,
          sleepQuality: null,
          takingMedication: null,
          medications: [],
          mentalHealthSymptoms: [],
          stressLevel: null,
        });
        await AsyncStorage.removeItem("assessment-storage");
      },
    }),
    {
      name: "assessment-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/*
-------------------------------------------------------------------------
---------------------------- Goals -------------------------
-------------------------------------------------------------------------
*/

interface GoalState {
  goals: Goal[] | [];
  fetchGoals: () => Promise<void>;
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  fetchGoals: async () => {
    const { data: goalData, error: goalError } = await supabase
      .from("goals")
      .select("*");

    if (goalError) {
      return;
    }

    if (goalData) {
      set({ goals: goalData });
    }
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- Moods -------------------------
-------------------------------------------------------------------------
*/

interface MoodState {
  moods: Mood[] | [];
  fetchMoods: () => Promise<void>;
}

export const useMoodStore = create<MoodState>((set) => ({
  moods: [],
  fetchMoods: async () => {
    const { data: moodData, error: moodError } = await supabase
      .from("moods")
      .select("*");

    if (moodError) {
      return;
    }

    if (moodData) {
      set({ moods: moodData });
    }
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- SleepQuality -------------------------
-------------------------------------------------------------------------
*/

interface SleepQualityState {
  sleepQualities: SleepQuality[] | [];
  fetchSleepQualities: () => Promise<void>;
}

export const useSleepQualityStore = create<SleepQualityState>((set) => ({
  sleepQualities: [],
  fetchSleepQualities: async () => {
    const { data: sleepQualityData, error: sleepQualityError } = await supabase
      .from("sleepquality")
      .select("*");

    if (sleepQualityError) {
      return;
    }

    if (sleepQualityData) {
      set({ sleepQualities: sleepQualityData });
    }
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- Taking Medication -------------------------
-------------------------------------------------------------------------
*/

interface TakingMedicationState {
  takingMedications: TakingMedication[] | [];
  fetchTakingMedications: () => Promise<void>;
}

export const useTakingMedicationStore = create<TakingMedicationState>(
  (set) => ({
    takingMedications: [],
    fetchTakingMedications: async () => {
      const { data: takingMedicationData, error: takingMedicationError } =
        await supabase.from("takingmedication").select("*");

      if (takingMedicationError) {
        return;
      }

      if (takingMedicationData) {
        set({ takingMedications: takingMedicationData });
      }
    },
  })
);

/*
-------------------------------------------------------------------------
---------------------------- Medication -------------------------
-------------------------------------------------------------------------
*/

interface MedicationState {
  medications: Medication[] | [];
  fetchMedications: () => Promise<void>;
}

export const useMedicationStore = create<MedicationState>((set) => ({
  medications: [],
  fetchMedications: async () => {
    const { data: medicationData, error: medicationError } = await supabase
      .from("medication")
      .select("*");

    if (medicationError) {
      return;
    }

    if (medicationData) {
      set({ medications: medicationData });
    }
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- Mental Health Symptoms -------------------------
-------------------------------------------------------------------------
*/

interface MentalHealthSymptomState {
  mentalHealthSymptoms: MentalHealthSymptom[] | [];
  fetchMentalHealthSymptoms: () => Promise<void>;
}

export const useMentalHealthSymptomStore = create<MentalHealthSymptomState>(
  (set) => ({
    mentalHealthSymptoms: [],
    fetchMentalHealthSymptoms: async () => {
      const { data: mentalHealthSymptomData, error: mentalHealthSymptomError } =
        await supabase.from("mentalhealthsymptom").select("*");

      if (mentalHealthSymptomError) {
        return;
      }

      if (mentalHealthSymptomData) {
        set({ mentalHealthSymptoms: mentalHealthSymptomData });
      }
    },
  })
);
