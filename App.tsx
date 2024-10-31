import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@rneui/themed";
import Nav from "./modules/navigation/Nav";
import LoadingOverlay from "./modules/shared/components/LoadingOverlay";
import { supabase } from "./lib/SupaBase";
import {
  usePhysioStore,
  useProfileStore,
  usePsychologistStore,
  useUserStore,
} from "./store/UserStore";
import {
  Challenge,
  Follow,
  Message,
  Post,
  Profile,
  Thread,
} from "./utils/Types";
import "@rneui/themed";
import {
  useMealStore,
  useMealTypeStore,
  useMealPlanStore,
  useMealFoodStore,
  useMealInstructionStore,
  useFoodStore,
  useNutritionalFactStore,
  useFoodCategoryStore,
} from "./store/MealStore";
import {
  useFollowStore,
  useTagStore,
  useMessageStore,
  usePostStore,
  useThreadStore,
  useDietitianGuideStore,
  usePhysioGuideStore,
  usePsychologistGuideStore,
} from "./store/CommunityStore";
import {
  useArticleCategoryStore,
  useArticleStore,
  useFAQStore,
} from "./store/SystemStore";
import {
  useRoleStore,
  useProfessionalStatusStore,
  useDietitianStore,
} from "./store/UserStore";

import { Alert, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTermCategoryStore, useTermStore } from "./store/SystemStore";
import {
  useBodyPartStore,
  useChallengeStore,
  useChallengeWorkoutStore,
  useEquipmentStore,
  useExerciseEquipmentStore,
  useExerciseInstructionStore,
  useExerciseStore,
  useWorkoutExerciseStore,
  useWorkoutProgramStore,
  useWorkoutStore,
} from "./store/WorkoutStore";
import { useUserSettingsStore } from "./store/UserStore";
import {
  useAssessmentStore,
  useGoalStore,
  useMedicationStore,
  useMentalHealthSymptomStore,
  useMoodStore,
  useSleepQualityStore,
  useTakingMedicationStore,
} from "./store/AssessmentStore";
import { useFonts } from "expo-font";
import { useTrackingStore } from "./store/TrackingStore";
import { useResponseStore } from "./store/CoackKitStore";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

declare module "@rneui/themed" {
  export interface Colors {
    tertiary: string;
    quaternary: string;
    quinary: string;
    senary: string;
  }
}

const theme = createTheme({
  lightColors: {
    primary: "#2D8BBF",
    secondary: "#59F8E8",
    // secondary: "#D7263D", Red
    tertiary: "#0B2D48",
    quaternary: "#C6C9CE",
    quinary: "#EDECEA",
    senary: "#EDECEA",
    black: "#000000",
  },
  darkColors: {
    primary: "#2D8BBF",
    secondary: "#59F8E8",
    tertiary: "#0B2D48",
    quaternary: "#C6C9CE",
    quinary: "#EDECEA",
    background: "#2B3040",
    senary: "#1C1F2D",
    black: "#FFFFFF",
  },
});

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  //User
  const { user, setUser } = useUserStore();
  //Community
  const { fetchTags } = useTagStore();
  const { addThread, deleteThread, updateThread, fetchThreads } =
    useThreadStore();
  const { addPost, deletePost, fetchPosts, updatePost } = usePostStore();
  const { fetchProfiles, addProfile, updateProfile } = useProfileStore();
  const { fetchFollows, addFollows, deleteFollow } = useFollowStore();
  const { fetchMessages, addMessage, deleteMessage } = useMessageStore();
  //MealPlan
  const { fetchMeals } = useMealStore();
  const { fetchMealTypes } = useMealTypeStore();
  const { fetchMealPlans } = useMealPlanStore();
  const { fetchMealInstructions } = useMealInstructionStore();
  const { fetchMealFoods } = useMealFoodStore();
  const { fetchFoods } = useFoodStore();
  const { fetchFoodCategories } = useFoodCategoryStore();
  const { fetchNutritionalFacts } = useNutritionalFactStore();
  //Physio

  //Workouts
  const { fetchBodyparts } = useBodyPartStore();
  const { fetchWorkouts } = useWorkoutStore();
  const { fetchExercises } = useExerciseStore();
  const { fetchWorkoutPrograms } = useWorkoutProgramStore();
  const { fetchWorkoutExercises } = useWorkoutExerciseStore();
  const { fetchEquipments } = useEquipmentStore();
  const { fetchExerciseEquipments } = useExerciseEquipmentStore();
  const { fetchExerciseInstructions } = useExerciseInstructionStore();
  const { addChallenge, fetchChallenges } = useChallengeStore();
  const { fetchChallengeWorkouts } = useChallengeWorkoutStore();
  //Terms and Conditions
  const { fetchTerms } = useTermStore();
  const { fetchTermCategories } = useTermCategoryStore();
  //FAQ
  const { fetchArticleCategories } = useArticleCategoryStore();
  const { fetchArticles } = useArticleStore();
  const { fetchFaqs } = useFAQStore();
  //Dietitian, Physio, Psychologist
  const { fetchDietitians } = useDietitianStore();
  const { fetchProfessionalStatuses } = useProfessionalStatusStore();
  const { fetchPhysicians } = usePhysioStore();
  const { fetchPsychologists } = usePsychologistStore();
  //Resources
  const { fetchDietitianGuides } = useDietitianGuideStore();
  const { fetchPhysioGuides } = usePhysioGuideStore();
  const { fetchPsychologistGuides } = usePsychologistGuideStore();
  //Admin
  const { fetchRoles } = useRoleStore();
  //Settings
  const { fetchUserSettings } = useUserSettingsStore();
  //Assessment
  const { fetchGoals } = useGoalStore();
  const { fetchMoods } = useMoodStore();
  const { fetchSleepQualities } = useSleepQualityStore();
  const { fetchTakingMedications } = useTakingMedicationStore();
  const { fetchMedications } = useMedicationStore();
  const { fetchMentalHealthSymptoms } = useMentalHealthSymptomStore();
  const { fetchAssessments } = useAssessmentStore();
  //Tracking
  const { fetchTrackings } = useTrackingStore();
  //CoachKit
  const { fetchResponses } = useResponseStore();
  // const { fetchCycleStatuses } = useCycleStatusStore();

  /*------------------------------------------------------------------
------------------- Load fonts ----------------
------------------------------------------------------------------
*/

  const [loaded, error] = useFonts({
    Playball: require("./assets/fonts/Playball/Playball-Regular.ttf"),
    Tourney: require("./assets/fonts/Tourney/Tourney-VariableFont_wdth,wght.ttf"),
    Roboto: require("./assets/fonts/Roboto/Roboto-Regular.ttf"),
    Bebas: require("./assets/fonts/Bebas_Neue/BebasNeue-Regular.ttf"),
    Archivo: require("./assets/fonts/Archivo/Archivo-VariableFont_wdth,wght.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      console.log("Fonts loaded");
    }
    if (error) {
      console.log("Fonts not loaded");
    }
  }, [loaded, error]);

  /*------------------------------------------------------------------
------------------- Remember me login ----------------
------------------------------------------------------------------
*/
  async function rememberMeLogin() {
    const storedUser = await AsyncStorage.getItem("user");
    const storedSession = await AsyncStorage.getItem("session");
    if (storedUser && storedSession) {
      const user = JSON.parse(storedUser);
      const session = JSON.parse(storedSession);
      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession(session);
      if (sessionError) {
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("session");
        return;
      }
      setUser({
        ...user,
        accessToken: sessionData.session?.access_token,
      });
    }
  }

  useEffect(() => {
    setIsLoading(true);
    rememberMeLogin();
    setIsLoading(false);
  }, []);
  /*------------------------------------------------------------------
------------------- Messages Real-Time Subscription ----------------
------------------------------------------------------------------
*/
  useEffect(() => {
    if (!user) return;
    const messageSenderSubscription = supabase
      .channel("message_sender_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message",
          filter: `sender_id=eq.${user?.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            addMessage(payload.new as Message);
          }
          if (payload.eventType === "DELETE") {
            deleteMessage(payload.old as Message);
          }
        }
      )
      .subscribe();

    const messageReceiverSubscription = supabase
      .channel("message_receiver_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message",
          filter: `receiver_id=eq.${user?.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            addMessage(payload.new as Message);
          }
          if (payload.eventType === "DELETE") {
            deleteMessage(payload.old as Message);
          }
        }
      )
      .subscribe();

    return () => {
      messageSenderSubscription.unsubscribe();
      messageReceiverSubscription.unsubscribe();
    };
  }, [user]);

  /*
------------------------------------------------------------------
------------------- Follow Real-Time Subscription ----------------
------------------------------------------------------------------
*/
  useEffect(() => {
    if (!user) return;
    const followSubscription = supabase
      .channel("follow_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "follow" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            addFollows(payload.new as Follow);
          }
          if (payload.eventType === "DELETE") {
            deleteFollow(payload.old as Follow);
          }
        }
      )
      .subscribe();

    return () => {
      followSubscription.unsubscribe();
    };
  }, [user]);

  /*
------------------------------------------------------------------
------------------- Profile Real-Time Subscription ----------------
------------------------------------------------------------------
*/
  useEffect(() => {
    if (!user) return;
    const profileSubscription = supabase
      .channel("profile_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profile" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            addProfile(payload.new as Profile);
          }
          if (payload.eventType === "UPDATE") {
            updateProfile(payload.new as Profile);
          }
        }
      )
      .subscribe();

    return () => {
      profileSubscription.unsubscribe();
    };
  }, [user]);

  /*
------------------------------------------------------------------
------------------- Posts Real-Time Subscription ----------------
------------------------------------------------------------------
*/
  useEffect(() => {
    if (!user) return;
    const postSubscription = supabase
      .channel("post_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "post" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            addPost(payload.new as Post);
          }
          if (payload.eventType === "DELETE") {
            deletePost(payload.old as Post);
          }
          if (payload.eventType === "UPDATE") {
            updatePost(payload.new as Post);
          }
        }
      )
      .subscribe();

    return () => {
      postSubscription.unsubscribe();
    };
  }, [user]);

  /*
------------------------------------------------------------------
------------------- Threads Real-Time Subscription ----------------
------------------------------------------------------------------
*/
  useEffect(() => {
    if (!user) return;
    const threadSubscription = supabase
      .channel("thread_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "thread" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            addThread(payload.new as Thread);
          }
          if (payload.eventType === "DELETE") {
            deleteThread(payload.old as Thread);
          }
          if (payload.eventType === "UPDATE") {
            updateThread(payload.new as Thread);
          }
        }
      )
      .subscribe();

    return () => {
      threadSubscription.unsubscribe();
    };
  }, [user]);

  /*
------------------------------------------------------------------
------------------- Challenges Real-Time Subscription ----------------
------------------------------------------------------------------
*/
  useEffect(() => {
    if (!user) return;
    const challengeSubscription = supabase
      .channel("challenge_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "challenge" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            addChallenge(payload.new as Challenge);
          }
        }
      )
      .subscribe();

    return () => {
      challengeSubscription.unsubscribe();
    };
  }, [user]);

  /*
------------------------------------------------------------------
------------------- Fetch Our Data ----------------
------------------------------------------------------------------
*/
  useEffect(() => {
    populateStaticStores();
    if (user) {
      populateStores();
      if (user.approvedstatus_id === 3) {
        Alert.alert(
          "Request Declined",
          "You have not been accepted as a professional. Please contact the admin for more information."
        );
      }
      if (user.approvedstatus_id === 1) {
        Alert.alert(
          "Request Pending",
          "Your request is still pending. Please wait for the admin to approve your request."
        );
      }
    }
  }, [user]);

  async function populateStaticStores() {
    //Terms and Conditions
    await fetchTermCategories();
    await fetchTerms();
    //Assessments
    await fetchGoals();
    await fetchMoods();
    await fetchSleepQualities();
    await fetchTakingMedications();
    await fetchMedications();
    await fetchMentalHealthSymptoms();
  }

  //Store that fetches only when a user is logged in.
  async function populateStores() {
    if (!user) return;
    setIsLoading(true);
    //Community
    await fetchTags();
    await fetchThreads();
    await fetchPosts();
    await fetchFollows();
    await fetchProfiles();
    await fetchMessages();
    //Meal Plan
    await fetchMealTypes();
    await fetchMeals();
    await fetchMealPlans();
    await fetchMealInstructions();
    await fetchMealFoods();
    await fetchFoods();
    await fetchFoodCategories();
    await fetchNutritionalFacts();
    //Workouts
    await fetchWorkoutExercises();
    await fetchWorkoutPrograms();
    await fetchWorkouts();
    await fetchExercises();
    await fetchBodyparts();
    await fetchEquipments();
    await fetchExerciseEquipments();
    await fetchExerciseInstructions();
    await fetchChallenges();
    await fetchChallengeWorkouts();
    //Help
    await fetchArticleCategories();
    await fetchArticles();
    await fetchFaqs();
    //Resources
    await fetchDietitianGuides();
    await fetchPhysioGuides();
    await fetchPsychologistGuides();
    //Dietitian, Physio, Psychologist
    await fetchProfessionalStatuses();
    await fetchDietitians();
    await fetchPhysicians();
    await fetchPsychologists();
    //Admin
    await fetchRoles();
    //Settings
    await fetchUserSettings();
    //Assessments
    await fetchAssessments();
    //Tracking
    await fetchTrackings();
    //CoachKit
    await fetchResponses();
    // await fetchCycleStatuses();
    setIsLoading(false);
  }

  //There are static stores and then there are stores we want to only fetch when a user is logged in.

  return (
    <ThemeProvider theme={theme}>
      {isLoading ? <LoadingOverlay message={"Loading..."} /> : <Nav />}
    </ThemeProvider>
  );
}
