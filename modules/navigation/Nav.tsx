/* ----------------------------------------------------
--- Actual Navigation Imports from React Navigation --- 
---------------------------------------------------- */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import {
  NavigationContainer,
  NavigationState,
  useNavigationState,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@rneui/themed";
import { Platform, View } from "react-native";

/* ----------------------------------------------------
----------------------- Menus ---------------------
---------------------------------------------------- */
//Home
import HomeStack from "./menus/HomeMenu";
//Admin
import AdminStack from "./menus/AdminMenu";
//Assessment
import AssessmentStack from "./menus/AssessmentMenu";
//Dietitian
import DietitianBottomTabs from "./menus/DietitianMenu";
//Physio
import PhysioBottomTabs from "./menus/PhysioMenu";
//Psychologist
import PsychologistStack from "./menus/PsychologistMenu";
//Booking
//import BookingBottomTabs from "./menus/BookingMenu";
//Meal Plan and Workouts
import ProgramBottomTabs from "./menus/ProgramMenu";
//Wellness Hub
import WellnesshubBottomTabs from "./menus/WellnessHubMenu";
//Help
import HelpTopTabs from "./menus/HelpMenu";
//Community
import MessageStack from "./menus/MessageMenu";
import CommunityBottomTabs from "./menus/CommunityMenu";
//CoachKit
import CoackKitStack from "./menus/CoachKitMenu";

/* ----------------------------------------------------
--------------- Authentication Screens -------------
---------------------------------------------------- */
import RegisterScreen from "../auth/screens/RegisterScreen";
import LoginScreen from "../auth/screens/LoginScreen";
import ForgotPasswordScreen from "../auth/screens/ForgotPasswordScreen";
import OTPScreen from "../auth/screens/OTPScreen";
import ChangePasswordScreen from "../auth/screens/ChangePasswordScreen";
import TermAndConditionScreen from "../auth/screens/TermAndConditionScreen";

/* ----------------------------------------------------
----------------------- Screens ---------------------
---------------------------------------------------- */
//Schedule
import ScheduleScreen from "../schedule/screens/ScheduleScreen";
//Settings
import ProfileSettingScreen from "../settings/screens/ProfileSettingScreen";
import AccountSettingScreen from "../settings/screens/AccountSettingScreen";
//Feedback
import FeedbackScreen from "../feedback/screens/FeedbackScreen";

/* ----------------------------------------------------
---------------------- Store -----------------------  
---------------------------------------------------- */
import { useUserStore } from "../../store/UserStore";

//Custom components
import NavLogoutButton from "./components/NavLogoutButton";
import NavToggleButton from "./components/NavToggleButton";
import NavDrawerProfile from "./components/NavDrawerProfile";
import NavDropdown from "./components/NavDropDown";
import NavMessageButton from "./components/NavMessageButton";
import WorkoutStack from "./menus/WorkoutMenu";
import MealPlanStack from "./menus/MealMenu";

/* 
----------------------------------------------------
Initiating/creating the navications we are going to use
The name we give this const is the name we will use to create the respective navigation
i.e. <"Bottom".Screen> or <"Stack".Screen> or <"Drawer".Screen>
The .Screen just tells react that we are adding a Screen to this navigation. 
---------------------------------------------------- 
*/
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const getCurrentRouteName = (navigationState: NavigationState): string => {
  if (
    !navigationState ||
    !navigationState.routes ||
    navigationState.index == null
  ) {
    return "";
  }
  const route = navigationState.routes[navigationState.index];
  return route.state
    ? getCurrentRouteName(route.state as NavigationState)
    : route.name;
};

/* 
----------------------------------------------------
Main navigation of the app, that side menu with all the menus!
---------------------------------------------------- 
*/

function DrawerCustomContent(props: any) {
  const state = useNavigationState((state) => state);
  const currentRouteName = getCurrentRouteName(state);
  return (
    <DrawerContentScrollView {...props}>
      <NavDrawerProfile />
      <DrawerItemList {...props} />
      <NavDropdown currentRoute={currentRouteName} />
      <NavLogoutButton />
    </DrawerContentScrollView>
  );
}

function DrawerNavigation() {
  const { theme } = useTheme();
  const { user } = useUserStore();
  const isWeb = Platform.OS === "web";
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerCustomContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.senary },
        headerTintColor: theme.colors.black,
        headerTitleAlign: "center",
        drawerStyle: {
          backgroundColor: theme.colors.senary,
        },
        drawerInactiveTintColor: theme.colors.black,
        drawerActiveTintColor: theme.colors.black,
        drawerActiveBackgroundColor: theme.colors.primary,
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        drawerType: isWeb ? "front" : "back",
        sceneContainerStyle: { backgroundColor: theme.colors.background },
        overlayColor:
          Platform.OS !== "web" ? theme.colors.primary : "transparent",
        headerRight: () => (
          <View style={{ flexDirection: "row" }}>
            <NavMessageButton />
            <NavToggleButton />
          </View>
        ),
      }}
    >
      {user?.role === "Admin" && (
        <Drawer.Screen
          name="AdminStack"
          component={AdminStack}
          options={{ title: "Admin" }}
        />
      )}
      {user?.role === "Dietitian" && user.approvedstatus_id === 2 && (
        <Drawer.Screen
          name="DietitianBottomTabs"
          component={DietitianBottomTabs}
          options={{ title: "Dietitian" }}
        />
      )}
      {user?.role === "Physio" && user.approvedstatus_id === 2 && (
        <Drawer.Screen
          name="PhysioBottomTabs"
          component={PhysioBottomTabs}
          options={{ title: "Physio" }}
        />
      )}
      {user?.role === "Psychologist" && user.approvedstatus_id === 2 && (
        <Drawer.Screen
          name="PsychologistStack"
          component={PsychologistStack}
          options={{ title: "Psychologist" }}
        />
      )}
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ title: "Home" }}
      />
      <Drawer.Screen
        name="WorkoutStack"
        component={WorkoutStack}
        options={{ title: "Workouts" }}
      />
      <Drawer.Screen
        name="MealPlanStack"
        component={MealPlanStack}
        options={{ title: "Meals" }}
      />
      {/*<Drawer.Screen
        name="BookingBottomTabs"
        component={BookingBottomTabs}
        options={{ title: "Bookings" }}
      />*/}
      <Drawer.Screen
        name="CoackKitStack"
        component={CoackKitStack}
        options={{ title: "CoachKit" }}
      />
      <Drawer.Screen name="Community" component={CommunityBottomTabs} />
      <Drawer.Screen name="Schedule" component={ScheduleScreen} />
      <Drawer.Screen
        name="WellnessHub"
        component={WellnesshubBottomTabs}
        options={{ title: "Wellness Hub" }}
      />
      {/* <Drawer.Screen
        name="ProgramBottomTabs"
        component={ProgramBottomTabs}
        options={{ title: "Program" }}
      /> */}
      <Drawer.Screen
        name="ProfileSetting"
        component={ProfileSettingScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Profile Settings",
        }}
      />
      <Drawer.Screen
        name="AccountSetting"
        component={AccountSettingScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Account Settings",
        }}
      />
      <Drawer.Screen name="Help" component={HelpTopTabs} />
    </Drawer.Navigator>
  );
}

function MainNavigation() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
      initialRouteName="Main"
    >
      <Stack.Screen name="Main" component={DrawerNavigation} />
      <Stack.Screen name="MessageStack" component={MessageStack} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
    </Stack.Navigator>
  );
}

/* 
----------------------------------------------------
The navigation our authentication screens will reside in!
---------------------------------------------------- 
*/
function AuthNavigation() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.black,
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: theme.colors.background },
        headerRight: () => <NavToggleButton />,
      }}
      initialRouteName="Login"
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Register" }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: "Forgot Password" }}
      />
      <Stack.Screen
        name="OTP"
        component={OTPScreen}
        options={{ title: "OTP" }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: "Change Password" }}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermAndConditionScreen}
        options={{ title: "Terms and Conditions" }}
      />
      <Stack.Screen
        name="AuthAssessmentStack"
        component={AssessmentStack}
        options={{ title: "Assessment", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

/* 
----------------------------------------------------
The navigation of the app bringing everything together.
Which we will use in the App.tsx file hence why we export it.
All our navigations need to reside in the NavigationContainer.

We then conditionally check if there is a user in the user store. 
If there is a user we show the DrawerNavigation, 
else we show the AuthNavigationRoutes with login/register screens.
---------------------------------------------------- 
*/
export default function Nav() {
  const { user } = useUserStore();
  const { theme } = useTheme();
  return (
    <>
      <StatusBar style={theme.mode === "light" ? "dark" : "light"} />
      <NavigationContainer>
        {user ? <MainNavigation /> : <AuthNavigation />}
      </NavigationContainer>
    </>
  );
}
