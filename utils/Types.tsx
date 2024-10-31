import * as ImagePicker from "expo-image-picker";

/*
---------------------------------------
-------------- Custom Types -----------
---------------------------------------
*/

/*
-------------- NewMeal --------------
*/

export interface NewMeal {
  meal_id?: number;
  mealtype_id: number;
  name: string;
  picture: ImagePicker.ImagePickerAsset;
  description: string;
  price: number;
}

export interface NewMealFood {
  mealfood_id?: number;
  meal_id?: number;
  food_id: number;
  quantity: number;
}

export interface NewMealInstruction {
  mealinstruction_id?: number;
  meal_id?: number;
  instruction: string;
}

export interface MealPlanItem {
  meal: Meal;
  mealPlan: MealPlan;
}

/*
-------------- NewChallenge --------------
*/
export interface NewChallenge {
  id?: number;
  title: string;
  description: string;
  picture: ImagePicker.ImagePickerAsset;
  datecreated: Date;
}

export interface NewChallengeWorkout {
  id?: number;
  workout_id: number;
  challenge_id?: number;
  date: Date;
}

export interface ChallengeWorkoutItem {
  workout: Workout;
  workoutChallenge: NewChallengeWorkout;
}

/*
-------------- NewWorkout --------------
*/

export interface NewWorkout {
  id?: number;
  name: string;
  description: string;
  picture: ImagePicker.ImagePickerAsset;
  datecreated: Date;
}

export interface NewWorkoutExercise {
  id?: number;
  workout_id?: number;
  exercise_id: number;
}

export interface WorkoutProgramItem {
  workout: Workout;
  workoutProgram: WorkoutProgram;
}

/*
-------------- NewExercise --------------
*/

export interface NewExercise {
  id?: number;
  bodypart_id: number;
  name: string;
  description: string;
  sets: number;
  repititions: number;
  duration: number;
  weight?: number;
}

export interface NewExerciseInstruction {
  id?: number;
  exercise_id?: number;
  instruction: string;
}

export interface NewExerciseEquipment {
  id?: number;
  exercise_id?: number;
  equipment_id: number;
}

/*
-------------- Authentication --------------
*/

export interface User {
  id?: string | null;
  role?: string | null;
  email?: string | null;
  username?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  avatarurl?: string | null;
  accessToken?: string | null;
  gender?: string;
  dob?: Date | null;
  biography?: string | null;
  totalfollowings?: number;
  totalfollowers?: number;
  qualification?: string | null;
  yearsofexperience?: number | null;
  status?: string | null;
  approvedstatus_id?: number | null;
}

/*
-------------- Professional Profile --------------
*/

export interface ProfessionalProfile {
  user_id: string;
  firstname: string;
  lastname: string;
  avatarurl: string;
  professionalstatus_id: number;
  qualification: string;
  yearsofexperience: number;
}

/*
---------------------------------------
-------------- Database Types --------------
---------------------------------------
*/
/*
-------------- DietitianGuide --------------
*/
export interface Guide {
  id: number;
  user_id: string;
  title: string;
  description: string;
  content: string;
  pictureurl: string;
  datecreated: Date;
}

/*
-------------- Users of the system --------------
*/

export interface Role {
  role_id: number;
  name: string;
  description: string;
}

export interface Profile {
  profile_id?: string | null;
  user_id: string | null;
  role?: string | null;
  gender: string;
  height: number;
  weight: number;
  username?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  avatarurl?: string | null;
  dob?: Date | null;
  biography?: string | null;
  totalfollowings: number;
  totalfollowers: number;
}

export interface Professional {
  user_id: string;
  professionalstatus_id: number;
  approvedstatus_id: number;
  qualification: string;
  yearsofexperience: number;
}

export interface ProfessionalStatus {
  professionalstatus_id: number;
  status: string;
}

/*
-------------- Community --------------
*/
export interface Tag {
  id: number;
  name: string;
  datecreated: Date;
  totalthreads: number;
}

export interface Thread {
  id: number;
  tag_id: number;
  author_id: string;
  authorname: string;
  authorsurname: string;
  pictureurl: string;
  title: string;
  subject: string;
  locked: boolean;
  likes: number;
  posts: number;
  datecreated: Date;
}

export interface Post {
  id: number;
  author_id: string;
  authorname: string;
  authorsurname: string;
  post: string;
  likes: number;
  datecreated: Date;
  thread_id: number;
}

export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  isread: boolean;
  datecreated: Date;
}

export interface Follow {
  id: number;
  follower_id: string;
  following_id: string;
  datecreated: Date;
}

export interface Chat {
  user_id: string;
  lastMessage: string;
  lastMessageTime: string;
  firstname: string;
  lastname: string;
  avatarurl?: string;
}

/*
-------------- Meal Plan --------------
*/

export interface Meal {
  meal_id: number;
  mealtype_id: number;
  name: string;
  pictureurl: string;
  description: string;
  price: number;
}

export interface MealType {
  mealtype_id: number;
  mealtype: string;
}

export interface MealPlan {
  mealplan_id: number;
  meal_id: number;
  user_id: string;
  mealtime: Date;
  completed: boolean;
}

export interface MealFood {
  mealfood_id: number;
  meal_id: number;
  food_id: number;
  quantity: number;
}

export interface MealInstruction {
  mealinstruction_id: number;
  meal_id: number;
  instruction: string;
}

export interface FoodCategory {
  foodcategory_id: number;
  name: string;
  description: string;
}

export interface Food {
  food_id: number;
  foodcategory_id: number;
  name: string;
}

export interface NutritionalFact {
  nutritionalfact_id: number;
  food_id: number;
  totalcarbs: number;
  calcium: number;
  cholesterol: number;
  dietaryfiber: number;
  saturatedfat: number;
  polyunsaturatedfat: number;
  monounsaturatedfat: number;
  transfat: number;
  totalfat: number;
  iron: number;
  potassium: number;
  protein: number;
  sugar: number;
  sodium: number;
  vitamina: number;
  vitaminc: number;
}

export interface MealNutrition {
  totalcarbs: number;
  calcium: number;
  cholesterol: number;
  dietaryfiber: number;
  saturatedfat: number;
  polyunsaturatedfat: number;
  monounsaturatedfat: number;
  transfat: number;
  totalfat: number;
  iron: number;
  potassium: number;
  protein: number;
  sugar: number;
  sodium: number;
  vitamina: number;
  vitaminc: number;
}

/*
-------------- Workouts --------------
*/

export interface BodyPart {
  id: number;
  name: string;
  description: string;
}

export interface Exercise {
  id: number;
  bodypart_id: number;
  name: string;
  description: string;
  sets: number;
  repititions: number;
  duration: number;
  weight?: number;
}

export interface ExerciseInstruction {
  id: number;
  exercise_id: number;
  instruction: string;
}

export interface Equipment {
  id: number;
  name: string;
  description: string;
  pictureurl: string;
}

export interface ExerciseEquipment {
  id: number;
  exercise_id: number;
  equipment_id: number;
}

export interface Workout {
  id: number;
  name: string;
  description: string;
  pictureurl: string;
  datecreated: Date;
}

export interface WorkoutExercise {
  id: number;
  workout_id: number;
  exercise_id: number;
}

export interface WorkoutProgram {
  id: number;
  workout_id: number;
  date: Date;
  challengeworkout_id?: number;
  completed: boolean;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  pictureurl: string;
  datecreated: Date;
}

export interface ChallengeWorkout {
  id: number;
  workout_id: number;
  challenge_id: number;
  date: Date;
}

/*
-------------- Booking --------------
*/

export interface PhysioBooking {
  physiobooking_id: number;
  datecreated: Date;
  duration: Date;
}

export interface PhysioUserBooking {
  physiouserbooking_id: number;
  user_id: string;
  physician_id: string;
}

/*
-------------- Help --------------
*/

export interface ArticleCategory {
  articlecategory_id: number;
  name: string;
}

export interface Article {
  article_id: number;
  articlecategory_id: number;
  title: string;
  description: string;
  datecreated: Date;
  dateupdated: Date;
}
export interface FAQ {
  faq_id: number;
  article_id: number;
  question: string;
  answer: string;
  isactive: boolean;
}

/*
-------------- Terms and Conditions --------------
*/
export interface TermCategory {
  id: number;
  name: string;
}

export interface Term {
  id: number;
  category_id: number;
  title: string;
  description: string;
  term: string;
  datecreated: Date;
  dateupdated: Date;
}

/*
-------------- Settings --------------
*/

export interface UserSettings {
  id: number;
  user_id: string;
  privacysetting_id: number;
  generalsetting_id: number;
  notificationsetting_id: number;
  securitysetting_id: number;
}

export interface PrivacySetting {
  id: number;
  lastseen: boolean;
  publicprofile: boolean;
}

export interface GeneralSetting {
  id: number;
  darkmode: boolean;
}

export interface NotificationSetting {
  id: number;
  pushnotification: boolean;
}

export interface SecuritySetting {
  id: number;
  twofactorauth: boolean;
  loginalerts: boolean;
}

/*
-------------- Assessments --------------
*/
export interface Goal {
  id: number;
  name: string;
}

export interface AssessmentGoal {
  id?: number;
  user_id: string; // UUID type
  goal_id: number;
  datecreated: Date | string; // Depending on how you handle date objects
}

export interface AssessmentBMI {
  id?: number;
  user_id: string;
  weight: number;
  height: number;
  datecreated: Date | string;
}

export interface AssessmentMenstruation {
  id?: number;
  user_id: string;
  lastperiodstart: Date | string;
  lastperiodend: Date | string;
  cyclelength: number;
  datecreated: Date | string;
}

export interface Mood {
  id: number;
  name: string;
}

export interface AssessmentMood {
  id?: number;
  user_id: string;
  mood_id: number;
  datecreated: Date | string;
}

export interface AssessmentProHelp {
  id?: number;
  user_id: string;
  answer: boolean;
  datecreated: Date | string;
}

export interface AssessmentPhysicalDistress {
  id?: number;
  user_id: string;
  answer: boolean;
  datecreated: Date | string;
}

export interface SleepQuality {
  id: number;
  name: string;
  hours: string;
}

export interface AssessmentSleepQuality {
  id?: number;
  user_id: string;
  sleepquality_id: number;
  datecreated: Date | string;
}

export interface TakingMedication {
  id: number;
  name: string;
}

export interface AssessmentTakingMedication {
  id?: number;
  user_id: string;
  takingmedication_id: number;
  datecreated: Date | string;
}

export interface Medication {
  id: number;
  name: string;
}

export interface AssessmentMedication {
  id?: number;
  user_id: string;
  medication_id: number;
  datecreated: Date | string;
}

export interface MentalHealthSymptom {
  id: number;
  name: string;
}

export interface AssessmentMentalHealthSymptom {
  id?: number;
  user_id: string;
  mentalhealthsymptom_id: number;
  datecreated: Date | string;
}

export interface AssessmentStressLevel {
  id?: number;
  user_id: string;
  level: number;
  datecreated: Date | string;
}

/*
-------------- Tracking --------------
*/

export interface TrackingHeartRate {
  id: number;
  user_id: string;
  heartrate: number;
  datecreated: Date;
}

export interface TrackingSleep {
  id: number;
  user_id: string;
  hours: number;
  datecreated: Date;
}

export interface TrackingWater {
  id: number;
  user_id: string;
  bottles: number;
  datecreated: Date;
}

export interface TrackingSteps {
  id: number;
  user_id: string;
  steps: number;
  datecreated: Date;
}

// export interface CycleStatus {
//   id: number;
//   status: string;
//   description: string;
// }

export interface TrackingMenstruation {
  id: number;
  user_id: string;
  // cyclestatus_id: number;
  periodstart: Date;
  periodend?: Date;
  periodlength?: number;
  cycleend?: Date;
  cyclelength?: number;
  datecreated: Date;
  dateupdated: Date;
}

export interface TrackingWorkout {
  id: number;
  user_id: string;
  workoutprogram_id: number;
  datecreated: Date;
}

export interface TrackingMeal {
  id: number;
  user_id: string;
  mealplan_id: number;
  datecreated: Date;
}

export interface TrackingGoalWorkout {
  id: number;
  user_id: string;
  workoutcount?: number;
  startdate: Date;
  enddate: Date;
  datecreated: Date;
}

export interface TrackingGoalCalory {
  id: number;
  user_id: string;
  calorycount?: number;
  startdate: Date;
  enddate: Date;
  datecreated: Date;
}

export interface TrackingGoalWater {
  id: number;
  user_id: string;
  watercount?: number;
  startdate: Date;
  enddate: Date;
  datecreated: Date;
}

export interface TrackingGoalSteps {
  id: number;
  user_id: string;
  stepcount?: number;
  startdate: Date;
  enddate: Date;
  datecreated: Date;
}

export interface TrackingGoalSleep {
  id: number;
  user_id: string;
  sleepcount?: number;
  startdate: Date;
  enddate: Date;
  datecreated: Date;
}

export interface TrackingToDo {
  id: number;
  user_id: string;
  name: string;
  completed: boolean;
  datecreated: Date;
}

/*
-------------- Ai CoachKit --------------
*/

export interface AiResponse {
  id: number;
  user_id: string;
  message: string;
  response: string;
  datecreated: Date;
}
