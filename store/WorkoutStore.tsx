import { create } from "zustand";
import { supabase } from "../lib/SupaBase";
import {
  BodyPart,
  Challenge,
  ChallengeWorkout,
  Equipment,
  Exercise,
  ExerciseEquipment,
  ExerciseInstruction,
  NewChallenge,
  NewChallengeWorkout,
  NewExercise,
  NewExerciseEquipment,
  NewExerciseInstruction,
  NewWorkout,
  NewWorkoutExercise,
  Workout,
  WorkoutExercise,
  WorkoutProgram,
} from "../utils/Types";
import { useUserStore } from "./UserStore";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*
-------------------------------------------------------------------------
---------------------------- WorkoutStore -------------------------
-------------------------------------------------------------------------
*/

interface WorkoutProgramState {
  workoutPrograms: WorkoutProgram[];
  fetchWorkoutPrograms: () => Promise<void>;
  addWorkoutProgram: (workoutProgram: WorkoutProgram) => void;
  deleteWorkoutProgram: (id: number) => void;
  deleteChallengeWorkoutInProgram: (challengeworkout_id: number) => void;
  updateWorkoutProgram: (workoutProgram: WorkoutProgram) => void;
}

export const useWorkoutProgramStore = create<WorkoutProgramState>((set) => ({
  workoutPrograms: [],
  fetchWorkoutPrograms: async () => {
    const { user } = useUserStore.getState();
    if (!user) return;
    const { data: workoutProgramData, error: workoutProgramError } =
      await supabase.from("workoutprogram").select("*").eq("user_id", user.id);
    if (workoutProgramError) {
      return;
    }
    set({ workoutPrograms: workoutProgramData });
  },
  addWorkoutProgram: (workoutProgram) =>
    set((state) => ({
      workoutPrograms: [...state.workoutPrograms, workoutProgram],
    })),
  deleteWorkoutProgram: (id) =>
    set((state) => ({
      workoutPrograms: state.workoutPrograms.filter(
        (workoutProgram) => workoutProgram.id !== id
      ),
    })),
  deleteChallengeWorkoutInProgram: (challengeworkout_id) =>
    set((state) => ({
      workoutPrograms: state.workoutPrograms.filter(
        (workoutProgram) =>
          workoutProgram.challengeworkout_id !== challengeworkout_id
      ),
    })),
  updateWorkoutProgram: (workoutProgram) =>
    set((state) => ({
      workoutPrograms: state.workoutPrograms.map((w) =>
        w.id === workoutProgram.id ? workoutProgram : w
      ),
    })),
}));

/*
-------------------------------------------------------------------------
---------------------------- WorkoutStore -------------------------
-------------------------------------------------------------------------
*/

interface WorkoutState {
  workouts: Workout[];
  fetchWorkouts: () => Promise<void>;
  addWorkout: (workout: Workout) => void;
  deleteWorkout: (id: number) => void;
  updateWorkout: (workout: Workout) => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  fetchWorkouts: async () => {
    const { data: workoutData, error: workoutError } = await supabase
      .from("workout")
      .select("*");
    if (workoutError) {
      return;
    }
    set({ workouts: workoutData });
  },
  addWorkout: (workout) =>
    set((state) => ({ workouts: [...state.workouts, workout] })),
  deleteWorkout: (id) =>
    set((state) => ({
      workouts: state.workouts.filter((workout) => workout.id !== id),
    })),
  updateWorkout: (workout) =>
    set((state) => ({
      workouts: state.workouts.map((w) => (w.id === workout.id ? workout : w)),
    })),
}));

/*
-------------------------------------------------------------------------
---------------------------- ExerciseStore -------------------------
-------------------------------------------------------------------------
*/
interface ExerciseState {
  exercises: Exercise[];
  fetchExercises: () => Promise<void>;
  addExercise: (exercise: Exercise) => void;
  deleteExercise: (id: number) => void;
  updateExercise: (exercise: Exercise) => void;
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  exercises: [],
  fetchExercises: async () => {
    const { data: exerciseData, error: exerciseError } = await supabase
      .from("exercise")
      .select("*");
    if (exerciseError) {
      return;
    }
    set({ exercises: exerciseData });
  },
  addExercise: (exercise) =>
    set((state) => ({ exercises: [...state.exercises, exercise] })),
  deleteExercise: (id) =>
    set((state) => ({
      exercises: state.exercises.filter((exercise) => exercise.id !== id),
    })),
  updateExercise: (exercise) =>
    set((state) => ({
      exercises: state.exercises.map((e) =>
        e.id === exercise.id ? exercise : e
      ),
    })),
}));

/*
-------------------------------------------------------------------------
---------------------------- ExerciseInstructionStore -------------------------
-------------------------------------------------------------------------
*/

interface ExerciseInstructionState {
  exerciseInstructions: ExerciseInstruction[];
  fetchExerciseInstructions: () => Promise<void>;
  addExerciseInstruction: (exerciseInstruction: ExerciseInstruction) => void;
  deleteExerciseInstruction: (id: number) => void;
  updateExerciseInstruction: (exerciseInstruction: ExerciseInstruction) => void;
}

export const useExerciseInstructionStore = create<ExerciseInstructionState>(
  (set) => ({
    exerciseInstructions: [],
    fetchExerciseInstructions: async () => {
      const { data: exerciseInstructionData, error: exerciseInstructionError } =
        await supabase.from("exerciseinstruction").select("*");
      if (exerciseInstructionError) {
        return;
      }
      set({ exerciseInstructions: exerciseInstructionData });
    },
    addExerciseInstruction: (exerciseInstruction) =>
      set((state) => ({
        exerciseInstructions: [
          ...state.exerciseInstructions,
          exerciseInstruction,
        ],
      })),
    deleteExerciseInstruction: (id) =>
      set((state) => ({
        exerciseInstructions: state.exerciseInstructions.filter(
          (exerciseInstruction) => exerciseInstruction.id !== id
        ),
      })),
    updateExerciseInstruction: (updateExerciseInstruction) =>
      set((state) => ({
        exerciseInstructions: state.exerciseInstructions.map(
          (exerciseInstruction) =>
            exerciseInstruction.id === updateExerciseInstruction.id
              ? updateExerciseInstruction
              : exerciseInstruction
        ),
      })),
  })
);

/*
-------------------------------------------------------------------------
---------------------------- EquipmentStore -------------------------
-------------------------------------------------------------------------
*/

interface EquipmentState {
  equipments: Equipment[];
  fetchEquipments: () => Promise<void>;
  addEquipment: (equipment: Equipment) => void;
  deleteEquipment: (id: number) => void;
  updateEquipment: (equipment: Equipment) => void;
}

export const useEquipmentStore = create<EquipmentState>((set) => ({
  equipments: [],
  fetchEquipments: async () => {
    const { data: equipmentData, error: equipmentError } = await supabase
      .from("equipment")
      .select("*");
    if (equipmentError) {
      return;
    }
    set({ equipments: equipmentData });
  },
  addEquipment: (equipment) =>
    set((state) => ({ equipments: [...state.equipments, equipment] })),
  deleteEquipment: (id) =>
    set((state) => ({
      equipments: state.equipments.filter((equipment) => equipment.id !== id),
    })),
  updateEquipment: (updateEquipment) =>
    set((state) => ({
      equipments: state.equipments.map((equipment) =>
        equipment.id === updateEquipment.id ? updateEquipment : equipment
      ),
    })),
}));

/*
-------------------------------------------------------------------------
---------------------------- EquipmentStore -------------------------
-------------------------------------------------------------------------
*/

interface ExerciseEquipmentState {
  exerciseEquipments: ExerciseEquipment[];
  fetchExerciseEquipments: () => Promise<void>;
  addExerciseEquipment: (exerciseEquipment: ExerciseEquipment) => void;
  deleteExerciseEquipment: (id: number) => void;
  updateExerciseEquipment: (exerciseEquipment: ExerciseEquipment) => void;
}

export const useExerciseEquipmentStore = create<ExerciseEquipmentState>(
  (set) => ({
    exerciseEquipments: [],
    fetchExerciseEquipments: async () => {
      const { data: exerciseEquipmentData, error: exerciseEquipmentError } =
        await supabase.from("exerciseequipment").select("*");
      if (exerciseEquipmentError) {
        return;
      }
      set({ exerciseEquipments: exerciseEquipmentData });
    },
    addExerciseEquipment: (exerciseEquipment) =>
      set((state) => ({
        exerciseEquipments: [...state.exerciseEquipments, exerciseEquipment],
      })),
    deleteExerciseEquipment: (id) =>
      set((state) => ({
        exerciseEquipments: state.exerciseEquipments.filter(
          (exerciseEquipment) => exerciseEquipment.id !== id
        ),
      })),
    updateExerciseEquipment: (updateExerciseEquipment) =>
      set((state) => ({
        exerciseEquipments: state.exerciseEquipments.map((exerciseEquipment) =>
          exerciseEquipment.id === updateExerciseEquipment.id
            ? updateExerciseEquipment
            : exerciseEquipment
        ),
      })),
  })
);

/*
-------------------------------------------------------------------------
---------------------------- BodyPartStore -------------------------
-------------------------------------------------------------------------
*/

interface BodypartState {
  bodyparts: BodyPart[];
  fetchBodyparts: () => Promise<void>;
  addBodypart: (bodypart: BodyPart) => void;
  deleteBodypart: (id: number) => void;
  updateBodypart: (bodypart: BodyPart) => void;
}

export const useBodyPartStore = create<BodypartState>((set) => ({
  bodyparts: [],
  fetchBodyparts: async () => {
    const { data: bodyPartData, error: bodyPartError } = await supabase
      .from("bodypart")
      .select("*");
    if (bodyPartError) {
      return;
    }
    set({ bodyparts: bodyPartData });
  },
  addBodypart: (bodypart) =>
    set((state) => ({ bodyparts: [...state.bodyparts, bodypart] })),
  deleteBodypart: (id) =>
    set((state) => ({
      bodyparts: state.bodyparts.filter((bodypart) => bodypart.id !== id),
    })),
  updateBodypart: (bodypart) =>
    set((state) => ({
      bodyparts: state.bodyparts.map((b) =>
        b.id === bodypart.id ? bodypart : b
      ),
    })),
}));

/*
-------------------------------------------------------------------------
---------------------------- WorkoutExerciseStore -------------------------
-------------------------------------------------------------------------
*/

interface WorkoutExerciseState {
  workoutExercises: WorkoutExercise[];
  fetchWorkoutExercises: () => Promise<void>;
  addWorkoutExercise: (workoutExercise: WorkoutExercise) => void;
  deleteWorkoutExercise: (id: number) => void;
  deleteWorkoutExercises: (workout_id: number) => void;
  updateWorkoutExercise: (workoutExercise: WorkoutExercise) => void;
}

export const useWorkoutExerciseStore = create<WorkoutExerciseState>((set) => ({
  workoutExercises: [],
  fetchWorkoutExercises: async () => {
    const { data: workoutExerciseData, error: workoutExerciseError } =
      await supabase.from("workoutexercise").select("*");
    if (workoutExerciseError) {
      return;
    }
    set({ workoutExercises: workoutExerciseData });
  },
  addWorkoutExercise: (workoutExercise) =>
    set((state) => ({
      workoutExercises: [...state.workoutExercises, workoutExercise],
    })),
  deleteWorkoutExercise: (id) =>
    set((state) => ({
      workoutExercises: state.workoutExercises.filter(
        (workoutExercise) => workoutExercise.id !== id
      ),
    })),
  deleteWorkoutExercises: (workout_id) =>
    set((state) => ({
      workoutExercises: state.workoutExercises.filter(
        (workoutExercise) => workoutExercise.workout_id !== workout_id
      ),
    })),
  updateWorkoutExercise: (workoutExercise) =>
    set((state) => ({
      workoutExercises: state.workoutExercises.map((we) =>
        we.id === workoutExercise.id ? workoutExercise : we
      ),
    })),
}));

/*
-------------------------------------------------------------------------
---------------------------- ChallengeStore -------------------------
-------------------------------------------------------------------------
*/
interface ChallengeState {
  challenges: Challenge[] | [];
  fetchChallenges: () => Promise<void>;
  addChallenge: (challenge: Challenge) => void;
  updateChallenge: (updatedChallenge: Challenge) => void;
  deleteChallenge: (id: number) => void;
}

export const useChallengeStore = create<ChallengeState>((set) => ({
  challenges: [],
  fetchChallenges: async () => {
    const { data: challengeData, error: challengeError } = await supabase
      .from("challenge")
      .select("*");

    if (challengeError) {
      return;
    }

    if (challengeData) {
      set({ challenges: challengeData });
    }
  },
  addChallenge: (newChallenge) => {
    set((state) => ({
      challenges: state.challenges
        ? [...state.challenges, newChallenge]
        : [newChallenge],
    }));
  },
  updateChallenge: (updatedChallenge) => {
    set((state) => ({
      challenges: state.challenges?.map((challenge) =>
        challenge.challenge_id === updatedChallenge.challenge_id
          ? updatedChallenge
          : challenge
      ),
    }));
  },
  deleteChallenge: (id) => {
    set((state) => ({
      challenges: state.challenges?.filter((challenge) => challenge.id !== id),
    }));
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- ChallengeWorkoutStore -------------------------
-------------------------------------------------------------------------
*/
interface ChallengeWorkoutState {
  challengeWorkouts: ChallengeWorkout[] | [];
  fetchChallengeWorkouts: () => Promise<void>;
  addChallengeWorkout: (challengeWorkout: ChallengeWorkout) => void;
  updateChallengeWorkout: (challengeWorkout: ChallengeWorkout) => void;
  deleteChallengeWorkout: (id: number) => void;
}

export const useChallengeWorkoutStore = create<ChallengeWorkoutState>(
  (set) => ({
    challengeWorkouts: [],
    fetchChallengeWorkouts: async () => {
      const { data: challengeWorkoutData, error: challengeWorkoutError } =
        await supabase.from("challengeworkout").select("*");

      if (challengeWorkoutError) {
        return;
      }

      if (challengeWorkoutData) {
        set({ challengeWorkouts: challengeWorkoutData });
      }
    },
    addChallengeWorkout: (challengeWorkout) => {
      set((state) => ({
        challengeWorkouts: state.challengeWorkouts
          ? [...state.challengeWorkouts, challengeWorkout]
          : [challengeWorkout],
      }));
    },
    updateChallengeWorkout: (updatedChallengeWorkout) => {
      set((state) => ({
        challengeWorkouts: state.challengeWorkouts?.map((challengeWorkout) =>
          challengeWorkout.id === updatedChallengeWorkout.id
            ? updatedChallengeWorkout
            : challengeWorkout
        ),
      }));
    },
    deleteChallengeWorkout: (id) => {
      set((state) => ({
        challengeWorkouts: state.challengeWorkouts?.filter(
          (challengeWorkout) => challengeWorkout.id !== id
        ),
      }));
    },
  })
);

/*
-------------------------------------------------------------------
---------------------------- NewWorkoutStore -------------------------
-------------------------------------------------------------------
-------------------------- Physio New Workout ---------------------
-------------------------------------------------------------------
*/

interface NewWorkoutState {
  workout: NewWorkout | null;
  workoutExercises: NewWorkoutExercise[];
  setWorkout: (workout: NewWorkout) => void;
  addWorkoutExercise: (workoutExercise: NewWorkoutExercise) => void;
  deleteWorkoutExercise: (workoutExercise: NewWorkoutExercise) => void;
  clearWorkout: () => void;
}

export const useNewWorkoutStore = create<NewWorkoutState>()(
  persist(
    (set) => ({
      workout: null,
      workoutExercises: [],
      setWorkout: (workout) => set({ workout }),
      addWorkoutExercise: (workoutExercise) =>
        set((state) => ({
          workoutExercises: [...state.workoutExercises, workoutExercise],
        })),
      deleteWorkoutExercise: (deleteWorkoutExercise) =>
        set((state) => ({
          workoutExercises: state.workoutExercises.filter(
            (workoutExercise) => workoutExercise !== deleteWorkoutExercise
          ),
        })),
      clearWorkout: () => set({ workout: null, workoutExercises: [] }),
    }),
    {
      name: "new-workout-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

interface EditWorkoutState {
  workout: Workout | null;
  workoutExercises: NewWorkoutExercise[];
  setWorkout: (workout: Workout) => void;
  setWorkoutExercises: (workoutExercises: NewWorkoutExercise[]) => void;
  addWorkoutExercise: (workoutExercise: NewWorkoutExercise) => void;
  deleteWorkoutExercise: (workoutExercise: NewWorkoutExercise) => void;
  clearWorkout: () => void;
}

export const useEditWorkoutStore = create<EditWorkoutState>()(
  persist(
    (set) => ({
      workout: null,
      workoutExercises: [],
      setWorkout: (workout) => set({ workout }),
      setWorkoutExercises: (workoutExercises) => set({ workoutExercises }),
      addWorkoutExercise: (workoutExercise) =>
        set((state) => ({
          workoutExercises: [...state.workoutExercises, workoutExercise],
        })),
      deleteWorkoutExercise: (deleteWorkoutExercise) => {
        set((state) => ({
          workoutExercises: state.workoutExercises.filter(
            (workoutExercise) => workoutExercise !== deleteWorkoutExercise
          ),
        }));
      },
      clearWorkout: () => set({ workout: null, workoutExercises: [] }),
    }),
    {
      name: "edit-workout-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/*
-------------------------------------------------------------------
-------------------------- Physio New Exercise ---------------------
-------------------------------------------------------------------
*/

interface NewExerciseState {
  exercise: NewExercise | null;
  exerciseInstructions: NewExerciseInstruction[];
  exerciseEquipments: NewExerciseEquipment[];
  setExercise: (exercise: NewExercise) => void;
  addExerciseInstruction: (exerciseInstruction: NewExerciseInstruction) => void;
  deleteExerciseInstruction: (
    exerciseInstruction: NewExerciseInstruction
  ) => void;
  addExerciseEquipment: (exerciseEquipment: NewExerciseEquipment) => void;
  deleteExerciseEquipment: (equipment_id: number) => void;
  clearExercise: () => void;
}

export const useNewExerciseStore = create<NewExerciseState>()(
  persist(
    (set) => ({
      exercise: null,
      exerciseInstructions: [],
      exerciseEquipments: [],
      setExercise: (exercise) => set({ exercise }),
      addExerciseInstruction: (exerciseInstruction) =>
        set((state) => ({
          exerciseInstructions: [
            ...state.exerciseInstructions,
            exerciseInstruction,
          ],
        })),
      deleteExerciseInstruction: (deleteExerciseInstruction) =>
        set((state) => ({
          exerciseInstructions: state.exerciseInstructions.filter(
            (exerciseInstruction) =>
              exerciseInstruction !== deleteExerciseInstruction
          ),
        })),
      addExerciseEquipment: (exerciseEquipment) =>
        set((state) => ({
          exerciseEquipments: [...state.exerciseEquipments, exerciseEquipment],
        })),
      deleteExerciseEquipment: (equipment_id) =>
        set((state) => ({
          exerciseEquipments: state.exerciseEquipments.filter(
            (exerciseEquipment) =>
              exerciseEquipment.equipment_id !== equipment_id
          ),
        })),
      clearExercise: async () => {
        set({
          exercise: null,
          exerciseInstructions: [],
          exerciseEquipments: [],
        });
        await AsyncStorage.removeItem("new-exercise-storage");
      },
    }),
    {
      name: "new-exercise-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

interface EditExerciseState {
  exercise: Exercise | null;
  exerciseInstructions: NewExerciseInstruction[];
  exerciseEquipments: NewExerciseEquipment[];
  setExercise: (exercise: Exercise) => void;
  setExerciseInstructions: (
    exerciseInstructions: NewExerciseInstruction[]
  ) => void;
  addExerciseInstruction: (exerciseInstruction: NewExerciseInstruction) => void;
  deleteExerciseInstruction: (
    exerciseInstruction: NewExerciseInstruction
  ) => void;
  setExerciseEquipments: (exerciseEquipments: NewExerciseEquipment[]) => void;
  addExerciseEquipment: (exerciseEquipment: NewExerciseEquipment) => void;
  deleteExerciseEquipment: (id: number) => void;
  clearExercise: () => void;
}

export const useEditExerciseStore = create<EditExerciseState>()(
  persist(
    (set) => ({
      exercise: null,
      exerciseInstructions: [],
      exerciseEquipments: [],
      setExercise: (exercise) => set({ exercise }),
      setExerciseInstructions: (exerciseInstructions) =>
        set({ exerciseInstructions }),
      addExerciseInstruction: (exerciseInstruction) =>
        set((state) => ({
          exerciseInstructions: [
            ...state.exerciseInstructions,
            exerciseInstruction,
          ],
        })),
      deleteExerciseInstruction: (deleteExerciseInstruction) =>
        set((state) => ({
          exerciseInstructions: state.exerciseInstructions.filter(
            (exerciseInstruction) =>
              exerciseInstruction !== deleteExerciseInstruction
          ),
        })),
      setExerciseEquipments: (exerciseEquipments) =>
        set({ exerciseEquipments }),
      addExerciseEquipment: (exerciseEquipment) =>
        set((state) => ({
          exerciseEquipments: [...state.exerciseEquipments, exerciseEquipment],
        })),
      deleteExerciseEquipment: (id) =>
        set((state) => ({
          exerciseEquipments: state.exerciseEquipments.filter(
            (exerciseEquipment) => exerciseEquipment.id !== id
          ),
        })),
      clearExercise: async () => {
        set({ exercise: null, exerciseInstructions: [] });
        await AsyncStorage.removeItem("edit-exercise-storage");
      },
    }),
    {
      name: "edit-exercise-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/*
-------------------------------------------------------------------
-------------------------- Physio New Challenge ---------------------
-------------------------------------------------------------------
*/

interface NewChallengeState {
  challenge: NewChallenge | null;
  challengeWorkouts: NewChallengeWorkout[];
  setChallenge: (challenge: NewChallenge) => void;
  addChallengeWorkout: (challengeWorkout: NewChallengeWorkout) => void;
  deleteChallengeWorkout: (workout_id: NewChallengeWorkout) => void;
  clearChallenge: () => void;
}

export const useNewChallengeStore = create<NewChallengeState>()(
  persist(
    (set) => ({
      challenge: null,
      challengeWorkouts: [],
      setChallenge: (challenge) => set({ challenge }),
      addChallengeWorkout: (challengeWorkout) =>
        set((state) => ({
          challengeWorkouts: [...state.challengeWorkouts, challengeWorkout],
        })),
      deleteChallengeWorkout: (deleteChallengeWorkout) =>
        set((state) => ({
          challengeWorkouts: state.challengeWorkouts.filter(
            (challengeWorkout) => challengeWorkout !== deleteChallengeWorkout
          ),
        })),
      clearChallenge: async () => {
        set({ challenge: null, challengeWorkouts: [] });
        await AsyncStorage.removeItem("new-challenge-storage");
      },
    }),
    {
      name: "new-challenge-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

interface EditChallengeState {
  challenge: Challenge | null;
  challengeWorkouts: NewChallengeWorkout[];
  setChallenge: (challenge: Challenge) => void;
  setChallengeWorkouts: (challengeWorkouts: NewChallengeWorkout[]) => void;
  addChallengeWorkout: (challengeWorkout: NewChallengeWorkout) => void;
  deleteChallengeWorkout: (challengeWorkout: NewChallengeWorkout) => void;
  clearChallenge: () => void;
}

export const useEditChallengeStore = create<EditChallengeState>()(
  persist(
    (set) => ({
      challenge: null,
      challengeWorkouts: [],
      setChallenge: (challenge) => set({ challenge }),
      setChallengeWorkouts: (challengeWorkouts) => set({ challengeWorkouts }),
      addChallengeWorkout: (challengeWorkout) =>
        set((state) => ({
          challengeWorkouts: [...state.challengeWorkouts, challengeWorkout],
        })),
      deleteChallengeWorkout: (deleteChallengeWorkout) => {
        set((state) => ({
          challengeWorkouts: state.challengeWorkouts.filter(
            (challengeWorkout) => challengeWorkout !== deleteChallengeWorkout
          ),
        }));
      },
      clearChallenge: async () => {
        set({ challenge: null, challengeWorkouts: [] });
        await AsyncStorage.removeItem("edit-challenge-storage");
      },
    }),
    {
      name: "edit-challenge-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
