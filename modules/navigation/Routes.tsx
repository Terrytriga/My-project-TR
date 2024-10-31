import { Meal, Profile, Thread } from "../../utils/Types";

/*
---------------------------------
----------- Tracking ------------
---------------------------------
*/

export type HomeStackRoutes = {
  Home: undefined;
  SelectTracking: undefined;
  SelectGoal: undefined;
  TrackingSleep: undefined;
  TrackingWater: undefined;
  TrackingSteps: undefined;
  TrackingWorkouts: undefined;
  TrackingMeals: undefined;
  TrackingCycle: undefined;
  AddTrackingCycle: undefined;
  EditTrackingCycle: { id: number };
  TrackingToDo: undefined;
  SetCaloryGoal: undefined;
  SetSleepGoal: undefined;
  SetStepsGoal: undefined;
  SetWaterGoal: undefined;
  SetWorkoutGoal: undefined;
};

/*
---------------------------------
----------- Wellness Hub ------------
---------------------------------
*/
export type WellnesshubBottomTabsRoutes = {
  Courses: undefined;
  Meditation: undefined;
};

/*
---------------------------------
----------- Community ------------
---------------------------------
*/

export type CommunityBottomTabsRoutes = {
  ForumStack: undefined;
  ResourcesTopTabs: undefined;
  FollowStack: undefined;
};

export type ThreadStackRoutes = {
  Threads: undefined;
  ViewThread: { id: number };
  CreateThread: undefined;
};

export type ResourcesGuideTopTabsRoutes = {
  AllDietitianGuides: undefined;
  AllPhysioGuides: undefined;
  AllPsychologistGuides: undefined;
};

export type ResourcesGuideStackRoutes = {
  ResourcesGuideTopTabsRoutes: undefined;
  ViewGuide: { id: number; type: string };
};

export type ResourcesTopTabsRoutes = {
  Videos: undefined;
  ResourcesGuideStack: undefined;
};

export type FollowStackRoutes = {
  Users: undefined;
  Profile: { user_id: string };
};

/*
---------------------------------
----------- Messages ------------
---------------------------------
*/

export type MessageStackRoutes = {
  Chats: undefined;
  SearchContact: undefined;
  Message: {
    user_id: string;
  };
};

/*
---------------------------------
----------- Program ------------
---------------------------------
*/

export type ProgramStackRoutes = {
  WorkoutProgram: undefined;
  MealProgram: undefined;
};

export type MealPlanStackRoutes = {
  MealSchedule: undefined;
  Meal: { meal: Meal; date: string; mealplan_id?: number };
  Breakfast: { date: string } | undefined;
  Lunch: { date: string } | undefined;
  Dinner: { date: string } | undefined;
  Snack: { date: string } | undefined;
};

export type WorkoutStackRoutes = {
  WorkoutTopTabs: undefined;
  ViewAllWorkouts: { date: string };
  ViewWorkout: {
    id: number;
    date: string;
    workoutProgram_id?: number;
    challenge?: boolean;
  };
  ViewChallenge: { id: number };
  ViewExercise: { id: number };
};
export type WorkoutBottomTabsRoutes = {
  Program: undefined;
  Challenges: undefined;
};

/*
---------------------------------
----------- Admin ------------
---------------------------------
*/

export type AdminBottomTabsRoutes = {
  AdminDashboard: undefined;
  AllUsers: undefined;
};
export type AdminStackRoutes = {
  AdminBottomTabs: undefined;
  ViewUser: { profile: Profile };
};

/*
---------------------------------
----------- Dietitian ------------
---------------------------------
*/

export type DietitianBottomTabs = {
  DietitianMealStack: undefined;
  DietitianFoodStack: undefined;
  addMealGuide: undefined;
};
export type DietitianGuideStack = {
  DietitianGuides: undefined;
  AddDietitianGuide: undefined;
  EditDietitianGuide: { id: number };
  ViewDietitianGuide: { id: number };
};

// export type DietitianMealTopTabs = {
//   MealBreakfast: undefined;
//   MealLunch: undefined;
//   MealDinner: undefined;
//   MealSnack: undefined;
// };
// export type DietitianMealFoodTopTabs = {
//   AddMealFoodDairy: undefined;
//   AddMealFoodFruit: undefined;
//   AddMealFoodVegetable: undefined;
//   AddMealFoodProtein: undefined;
// };

export type DietitianMealStack = {
  Meals: undefined;
  AddFoodToMeal: undefined;
  ViewMeal: { meal_id: number };
  EditMeal: undefined;
  EditMealFood: undefined;
  EditMealInstruction: undefined;
  AddMeal: { mealtype_id: number };
  AddMealFood: undefined;
  AddMealInstruction: undefined;
};

export type DietitianFoodTopTabs = {
  FoodFruit: undefined;
  FoodVegetable: undefined;
  FoodProtein: undefined;
  FoodDairy: undefined;
};

export type DietitianFoodStack = {
  Foods: undefined;
  AddFood: { foodcategory_id: number };
  EditFood: { food_id: number };
};

/*
---------------------------------
----------- Physio ------------
---------------------------------
*/

export type PhysioBottomTabs = {
  PhysioWorkoutTopTabs: undefined;
  PhysioGuideStack: undefined;
  PhysioChallengeStack: undefined;
};

export type PhysioWorkoutTopTabs = {
  PhysioWorkoutStack: undefined;
  PhysioExerciseStack: undefined;
  PhysioBodyPartStack: undefined;
};

export type PhysioEquipmentStack = {
  PhysioEquipment: undefined;
  AddPhysioEquipment: undefined;
  EditPhysioEquipment: { id: number };
  ViewPhysioEquipment: { id: number };
};

export type PhysioBodyPartStack = {
  PhysioBodyParts: undefined;
  AddPhysioBodyParts: undefined;
  EditPhysioBodyParts: { id: number };
  ViewPhysioBodyParts: { id: number };
};

export type PhysioExerciseStack = {
  PhysioExercises: undefined;
  AddPhysioExercises: { bodypart_id: number };
  EditPhysioExercises: undefined;
  ViewPhysioExercises: { id: number };
  AddPhysioEquipmentToExercise: undefined;
  AddPhysioExerciseInstruction: undefined;
  EditPhysioExerciseInstruction: undefined;
  AddPhysioExerciseEquipment: undefined;
  EditPhysioExerciseEquipment: undefined;
};

export type PhysioWorkoutStack = {
  PhysioWorkouts: undefined;
  AddPhysioWorkout: undefined;
  EditPhysioWorkout: undefined;
  ViewPhysioWorkout: { id: number };
  AddPhysioWorkoutExercise: undefined;
  EditPhysioWorkoutExercise: undefined;
  ViewPhysioWorkoutExercise: { id: number };
  AddPhysioExerciseToWorkout: undefined;
};

export type PhysioGuideStack = {
  PhysioGuides: undefined;
  AddPhysioGuides: undefined;
  EditPhysioGuides: { id: number };
  ViewPhysioGuides: { id: number };
};

export type PhysioChallengeStack = {
  PhysioChallenges: undefined;
  AddPhysioChallenge: undefined;
  AddPhysioWorkoutChallenge: undefined;
  AddPhysioWorkoutToChallenge: undefined;
  EditPhysioChallenge: undefined;
  EditPhysioWorkoutChallenge: undefined;
  ViewPhysioChallenge: { id: number };
  ViewPhysioWorkoutInChallenge: { id: number };
  ViewPhysioExercisesInWorkout: { id: number };
};

/*
---------------------------------
----------- Primary ------------
---------------------------------
*/
export type DrawerNavigationRoutes = {
  AdminStack: undefined;
  DietitianBottomTabs: undefined;
  PhysioStack: undefined;
  PsychologistStack: undefined;
  Assessment: undefined;
  Workout: undefined;
  Schedule: undefined;
  MealPlanStack: undefined;
  BookingStack: undefined;
  Community: undefined;
  Resources: undefined;
  WellnessHub: undefined;
  ProfileSetting: undefined;
  GeneralSetting: undefined;
  PrivacySetting: undefined;
  NotificationSetting: undefined;
  SecuritySetting: undefined;
  Help: undefined;
  Feedback: undefined;
};

export type MainNavigationRoutes = {
  Main: undefined;
  MessageStack: undefined;
};

export type AuthNavigationRoutes = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTP: undefined;
  ChangePassword: undefined;
  TermsAndConditions: undefined;
  AuthAssessmentStack: {
    screen: keyof AssessmentStackRoutes;
  };
};

/*
---------------------------------
----------- Assessments ------------
---------------------------------
*/

export type AssessmentStackRoutes = {
  Goals: undefined;
  BMI: { user_id: string };
  Menstruation: { user_id: string };
  Moods: { user_id: string };
  ProfessionalHelp: { user_id: string };
  PhysicalDistress: { user_id: string };
  SleepQuality: { user_id: string };
  TakingMedication: { user_id: string };
  SelectMedication: { user_id: string };
  MentalHealthSymptoms: { user_id: string };
  StressLevel: { user_id: string };
};

/*
---------------------------------
----------- Help ------------
---------------------------------
*/

export type HelpTopTabsRoutes = {
  FAQ: undefined;
  Contact: undefined;
  HelpTermAndConditions: undefined;
};

/*
---------------------------------
----------- CoachKit ------------
---------------------------------
*/

export type CoachKitStack = {
  CoachKit: undefined;
};
