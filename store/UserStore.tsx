import { create } from "zustand";
import { supabase } from "../lib/SupaBase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Professional,
  ProfessionalStatus,
  Profile,
  Role,
  User,
  GeneralSetting,
  NotificationSetting,
  PrivacySetting,
  SecuritySetting,
  UserSettings,
} from "../utils/Types";
import { createJSONStorage, persist } from "zustand/middleware";
/*
So this is our UserStore. 
It's a zustand store that manages the user state.
- It has a user object that contains the user's email, username, fullname, avatarUrl, and accessToken.
- It has methods for signing in, signing up, signing out, and updating the user's profile.
- Also has functionality for when a user uses a provider such as GitHub.
We are going to use stores throughout the entire application, not just for users.

You can imagine a store as a global state/variable that can be accessed 
from anywhere in the application and that can keep track of things for us. 
In this case, the logged in user! And I created as such to also provide
functionality to log the user in, sign them up, sign them out, 
and update their profile.
*/

/* 
----------------------------------------------------
Here we define what the UserState object looks like.
---------------------------------------------------- 
*/
interface UserState {
  user: User | null;
  setUser: (userDetails: Partial<User> | null) => void;
  signOut: () => Promise<void>;
  providerSignIn: (session: Session) => Promise<void>;
}
/* 
----------------------------------------------------
Here we create the UserStore.
---------------------------------------------------- 
*/
export const useUserStore = create<UserState>((set) => ({
  //The initial state of the store.
  user: null,
  setUser: (userDetails: Partial<User> | null) => {
    set((state) => {
      const newUser =
        userDetails === null ? null : { ...state.user, ...userDetails };
      return { ...state, user: newUser };
    });
  },
  //The signOut method that signs the user out.
  signOut: async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("session");
    set({ user: null });
  },
  providerSignIn: async (session) => {
    const { data: profileData, error: profileError } = await supabase
      .from("profile")
      .select("username, firstname, lastname, avatarurl")
      .eq("user_id", session.user.id);

    if (profileError) {
      Alert.alert("Error Authenticating", profileError.message, [
        {
          text: "Ok",
          style: "default",
        },
      ]);
      return;
    }
    set({
      user: {
        email: session.user.email,
        accessToken: session.access_token,
        username: profileData[0].username,
        avatarurl: profileData[0].avatarurl,
        firstname: profileData[0].firstname,
        lastname: profileData[0].lastname,
      },
    });
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- ProfileStore -------------------------
-------------------------------------------------------------------------
*/

interface ProfileState {
  profiles: Profile[] | [];
  fetchProfiles: () => Promise<void>;
  addProfile: (newProfile: Profile) => void;
  updateProfile: (updatedProfile: Profile) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profiles: [],
  fetchProfiles: async () => {
    const { data: profileData, error: profileError } = await supabase
      .from("profile")
      .select("*");

    if (profileError) {
      return;
    }

    const { data: roleData, error: roleError } = await supabase
      .from("userrole")
      .select(
        `
          *,
          role (
            role_id,
            name,
            description
          )
        `
      );

    if (roleError) return;

    if (profileData) {
      const combinedData = profileData.map((profile) => {
        const userRole = roleData.find(
          (role) => role.user_id === profile.user_id
        );
        return {
          profile_id: profile.profile_id,
          user_id: profile.user_id,
          role: userRole?.role.name ?? null,
          username: profile.username ?? null,
          firstname: profile.firstname ?? null,
          lastname: profile.lastname ?? null,
          weight: profile.weight ?? null,
          height: profile.height ?? null,
          gender: profile.gender ?? null,
          avatarurl: profile.avatarurl ?? null,
          dob: profile.dob ?? null,
          biography: profile.biography ?? null,
          totalfollowings: profile.totalfollowings ?? 0,
          totalfollowers: profile.totalfollowers ?? 0,
        };
      });
      set({ profiles: combinedData });
    }
  },
  addProfile: (newProfile) => {
    set((state) => ({
      profiles: state.profiles ? [...state.profiles, newProfile] : [newProfile],
    }));
  },
  updateProfile: (updatedProfile) => {
    set((state) => ({
      profiles: state.profiles?.map((profile) =>
        profile.user_id === updatedProfile.user_id ? updatedProfile : profile
      ),
    }));
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- Dietitian -------------------------
-------------------------------------------------------------------------
*/

interface DietitianState {
  dietitians: Professional[];
  fetchDietitians: () => Promise<void>;
  addDietitian: (addDietitian: Professional) => void;
  updateDietitian: (updatedDietitian: Professional) => void;
}

export const useDietitianStore = create<DietitianState>((set) => ({
  dietitians: [],
  fetchDietitians: async () => {
    const { user } = useUserStore.getState();
    if (!user) return;
    const { data: dietitianData, error: dietitianError } = await supabase
      .from("dietitian")
      .select("*");
    if (dietitianError) {
      return;
    }

    set({ dietitians: dietitianData });
  },
  addDietitian: (addDietitian) => {
    set((state) => ({
      dietitians: state.dietitians
        ? [...state.dietitians, addDietitian]
        : [addDietitian],
    }));
  },
  updateDietitian: (updateDietitian) => {
    set((state) => ({
      dietitians: state.dietitians?.map((pro) =>
        pro.user_id === updateDietitian.user_id ? updateDietitian : pro
      ),
    }));
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- Physio -------------------------
-------------------------------------------------------------------------
*/

interface PhysioState {
  physicians: Professional[];
  fetchPhysicians: () => Promise<void>;
  addPhysician: (addPhysician: Professional) => void;
  updatePhysician: (updatePhysician: Professional) => void;
}

export const usePhysioStore = create<PhysioState>((set) => ({
  physicians: [],
  fetchPhysicians: async () => {
    const { user } = useUserStore.getState();
    if (!user) return;
    const { data: physicianData, error: physicianError } = await supabase
      .from("physio")
      .select("*");
    if (physicianError) {
      return;
    }

    set({ physicians: physicianData });
  },
  addPhysician: (addPhysician) => {
    set((state) => ({
      physicians: state.physicians
        ? [...state.physicians, addPhysician]
        : [addPhysician],
    }));
  },
  updatePhysician: (updatePhysician) => {
    set((state) => ({
      physicians: state.physicians?.map((pro) =>
        pro.user_id === updatePhysician.user_id ? updatePhysician : pro
      ),
    }));
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- Psychologists -------------------------
-------------------------------------------------------------------------
*/

interface PsychologistState {
  psychologists: Professional[];
  fetchPsychologists: () => Promise<void>;
  addPsychologist: (addPsychologist: Professional) => void;
  updatePsychologist: (updatePsychologist: Professional) => void;
}

export const usePsychologistStore = create<PsychologistState>((set) => ({
  psychologists: [],
  fetchPsychologists: async () => {
    const { user } = useUserStore.getState();
    if (!user) return;
    const { data: psychologistData, error: psychologistError } = await supabase
      .from("psychologist")
      .select("*");
    if (psychologistError) {
      return;
    }

    set({ psychologists: psychologistData });
  },
  addPsychologist: (addPsychologist) => {
    set((state) => ({
      psychologists: state.psychologists
        ? [...state.psychologists, addPsychologist]
        : [addPsychologist],
    }));
  },
  updatePsychologist: (updatePsychologist) => {
    set((state) => ({
      psychologists: state.psychologists?.map((pro) =>
        pro.user_id === updatePsychologist.user_id ? updatePsychologist : pro
      ),
    }));
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- Statuses -------------------------
-------------------------------------------------------------------------
*/

interface ProfessionalStatusState {
  professionalStatuses: ProfessionalStatus[];
  fetchProfessionalStatuses: () => Promise<void>;
}

export const useProfessionalStatusStore = create<ProfessionalStatusState>(
  (set) => ({
    professionalStatuses: [],
    fetchProfessionalStatuses: async () => {
      const { user } = useUserStore.getState();
      if (!user) return;
      const { data: proStatusData, error: proStatusError } = await supabase
        .from("professionalstatus")
        .select("*");
      if (proStatusError) return;

      set({ professionalStatuses: proStatusData });
    },
  })
);

/*
-------------------------------------------------------------------------
---------------------------- Roles -------------------------
-------------------------------------------------------------------------
*/

interface RoleState {
  roles: Role[] | null;
  fetchRoles: () => Promise<void>;
}

export const useRoleStore = create<RoleState>((set) => ({
  roles: null,
  fetchRoles: async () => {
    const { data: roleData, error: roleError } = await supabase
      .from("role")
      .select("*");

    if (roleError) {
      return;
    }

    if (roleData) {
      set({ roles: roleData });
    }
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- Settings -------------------------
-------------------------------------------------------------------------
*/

interface UserSettingsState {
  userSettings: UserSettings | null;
  privacySetting: PrivacySetting | null;
  generalSetting: GeneralSetting | null;
  notificationSetting: NotificationSetting | null;
  securitySetting: SecuritySetting | null;
  fetchUserSettings: () => Promise<void>;
  updatePrivacySetting: (privacySetting: PrivacySetting) => void;
  updateGeneralSetting: (generalSetting: GeneralSetting) => void;
  updateNotificationSetting: (notificationSetting: NotificationSetting) => void;
  updateSecuritySetting: (securitySetting: SecuritySetting) => void;
}

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set, get) => ({
      userSettings: null,
      privacySetting: null,
      generalSetting: null,
      notificationSetting: null,
      securitySetting: null,

      fetchUserSettings: async () => {
        const { user } = useUserStore.getState();
        if (!user?.id) return;

        try {
          const storageSettings = await AsyncStorage.getItem("settings");

          if (storageSettings) {
            const parsedSettings = JSON.parse(storageSettings);

            set({
              userSettings: parsedSettings.userSettings,
              privacySetting: parsedSettings.privacySetting,
              generalSetting: parsedSettings.generalSetting,
              notificationSetting: parsedSettings.notificationSetting,
              securitySetting: parsedSettings.securitySetting,
            });
          } else {
            const { data: userSettingsData, error: userSettingsError } =
              await supabase
                .from("usersettings")
                .select("*")
                .eq("user_id", user.id)
                .single();

            if (userSettingsError) throw userSettingsError;

            const userSettings = userSettingsData as UserSettings;

            const [
              { data: privacySetting, error: privacySettingError },
              { data: generalSetting, error: generalSettingError },
              { data: notificationSetting, error: notificationSettingError },
              { data: securitySetting, error: securitySettingError },
            ] = await Promise.all([
              supabase
                .from("privacysettings")
                .select("*")
                .eq("id", userSettings.privacysetting_id)
                .single(),
              supabase
                .from("generalsettings")
                .select("*")
                .eq("id", userSettings.generalsetting_id)
                .single(),
              supabase
                .from("notificationsettings")
                .select("*")
                .eq("id", userSettings.notificationsetting_id)
                .single(),
              supabase
                .from("securitysettings")
                .select("*")
                .eq("id", userSettings.securitysetting_id)
                .single(),
            ]);

            if (
              privacySettingError ||
              generalSettingError ||
              notificationSettingError ||
              securitySettingError
            ) {
              throw new Error("Error fetching one or more settings");
            }

            set({
              userSettings,
              privacySetting: privacySetting as PrivacySetting,
              generalSetting: generalSetting as GeneralSetting,
              notificationSetting: notificationSetting as NotificationSetting,
              securitySetting: securitySetting as SecuritySetting,
            });
            await AsyncStorage.setItem("settings", JSON.stringify(get()));
          }
        } catch (error) {
          console.error("Error fetching user settings:", error);
        }
      },

      updatePrivacySetting: async (updatePrivacySetting) => {
        set({ privacySetting: updatePrivacySetting });
        await AsyncStorage.setItem("settings", JSON.stringify(get()));
      },

      updateGeneralSetting: async (updateGeneralSetting) => {
        set({ generalSetting: updateGeneralSetting });
        await AsyncStorage.setItem("settings", JSON.stringify(get()));
      },

      updateNotificationSetting: async (updateNotificationSetting) => {
        set({ notificationSetting: updateNotificationSetting });
        await AsyncStorage.setItem("settings", JSON.stringify(get()));
      },

      updateSecuritySetting: async (updateSecuritySetting) => {
        set({ securitySetting: updateSecuritySetting });
        await AsyncStorage.setItem("settings", JSON.stringify(get()));
      },
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
