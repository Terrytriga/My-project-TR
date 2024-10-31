import { Alert, Platform, StyleSheet, View } from "react-native";
import { CheckBox, Text, useTheme } from "@rneui/themed";
import { useEffect, useState } from "react";
import { useUserSettingsStore } from "../../../store/UserStore";
import { supabase } from "../../../lib/SupaBase";

export default function AccountSettingScreen() {
  const isWeb = Platform.OS === "web";
  const { theme } = useTheme();
  const {
    privacySetting,
    generalSetting,
    notificationSetting,
    securitySetting,
    updateGeneralSetting,
    updatePrivacySetting,
    updateNotificationSetting,
    updateSecuritySetting,
  } = useUserSettingsStore();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLastSeen, setIsLastSeen] = useState<boolean>(false);
  const [isProfilePublic, setIsProfilePublic] = useState<boolean>(false);
  const [isPushNotification, setIsPushNotification] = useState<boolean>(false);
  const [isTwoFactor, setIsTwoFactor] = useState<boolean>(false);
  const [isLoginAlert, setIsLoginAlert] = useState<boolean>(false);

  useEffect(() => {
    if (
      !generalSetting ||
      !privacySetting ||
      !notificationSetting ||
      !securitySetting
    ) {
      return;
    }
    setIsDarkMode(generalSetting.darkmode);
    setIsLastSeen(privacySetting.lastseen);
    setIsProfilePublic(privacySetting.publicprofile);
    setIsPushNotification(notificationSetting.pushnotification);
    setIsTwoFactor(securitySetting.twofactorauth);
    setIsLoginAlert(securitySetting.loginalerts);
  }, [privacySetting, generalSetting, notificationSetting, securitySetting]);

  async function saveGeneralDarkmodeSettings() {
    if (!generalSetting?.id) return;
    const { data: updatedGeneralSetting, error: privacyGeneralError } =
      await supabase
        .from("generalsettings")
        .update({
          darkmode: !isDarkMode,
        })
        .eq("id", generalSetting.id)
        .select()
        .single();
    if (privacyGeneralError) {
      SettingAlert("Error", privacyGeneralError.message);
      return;
    }
    updateGeneralSetting(updatedGeneralSetting);
    setIsDarkMode(!isDarkMode);
  }

  async function savePrivacyLastSeenSettings() {
    if (!privacySetting?.id) return;
    const { data: updatedPrivacySetting, error: privacySettingError } =
      await supabase
        .from("privacysettings")
        .update({
          lastseen: !isLastSeen,
        })
        .eq("id", privacySetting.id)
        .select()
        .single();
    if (privacySettingError) {
      SettingAlert("Error", privacySettingError.message);
      return;
    }

    updatePrivacySetting(updatedPrivacySetting);
    setIsLastSeen(!isLastSeen);
  }

  async function savePrivacyPublicProfileSettings() {
    if (!privacySetting?.id) return;
    const { data: updatedPrivacySetting, error: privacySettingError } =
      await supabase
        .from("privacysettings")
        .update({
          publicprofile: !isProfilePublic,
        })
        .eq("id", privacySetting.id)
        .select()
        .single();
    if (privacySettingError) {
      SettingAlert("Error", privacySettingError.message);
      return;
    }

    updatePrivacySetting(updatedPrivacySetting);
    setIsLastSeen(!isProfilePublic);
  }
  async function saveSecurityTwoFactorSettings() {
    if (!securitySetting?.id) return;
    const { data: securitySettingData, error: securitySettingError } =
      await supabase
        .from("securitysettings")
        .update({
          twofactorauth: !isTwoFactor,
        })
        .eq("id", securitySetting.id)
        .select()
        .single();
    if (securitySettingError) {
      SettingAlert("Error", securitySettingError.message);
      return;
    }
    updateSecuritySetting(securitySettingData);
    setIsTwoFactor(!isTwoFactor);
  }

  async function saveSecurityLoginAlertSettings() {
    if (!securitySetting?.id) return;
    const { data: securitySettingData, error: securitySettingError } =
      await supabase
        .from("securitysettings")
        .update({
          loginalerts: !isLoginAlert,
        })
        .eq("id", securitySetting.id)
        .select()
        .single();
    if (securitySettingError) {
      SettingAlert("Error", securitySettingError.message);
      return;
    }
    updateSecuritySetting(securitySettingData);
    setIsLoginAlert(!isLoginAlert);
  }

  async function saveNotificationPushSettings() {
    if (!notificationSetting?.id) return;
    const { data: notificationSettingData, error: notificationSettingError } =
      await supabase
        .from("notificationsettings")
        .update({
          pushnotification: !isPushNotification,
        })
        .eq("id", notificationSetting.id)
        .select()
        .single();
    if (notificationSettingError) {
      SettingAlert("Error", notificationSettingError.message);
      return;
    }
    updateNotificationSetting(notificationSettingData);
    setIsPushNotification(!isPushNotification);
  }

  function SettingAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: "OK", style: "default" }]);
  }

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 20,
      flex: 1,
      alignItems: "center",
      flexDirection: "column",
    },
    section: {
      paddingHorizontal: 20,
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      marginVertical: 10,
    },
    sectionItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      borderBottomWidth: 1,
      borderColor: theme.colors.primary,
      width: "100%",
    },
    subTitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>General Settings</Text>
        <View style={styles.sectionItem}>
          <Text style={styles.subTitle}>Dark mode</Text>
          <CheckBox
            checked={isDarkMode}
            onPress={() => saveGeneralDarkmodeSettings()}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Privacy Settings</Text>
        <View style={styles.sectionItem}>
          <Text style={styles.subTitle}>Last Seen</Text>
          <CheckBox
            checked={isLastSeen}
            onPress={() => savePrivacyLastSeenSettings()}
          />
        </View>
        <View style={styles.sectionItem}>
          <Text style={styles.subTitle}>Public Profile</Text>
          <CheckBox
            checked={isProfilePublic}
            onPress={() => savePrivacyPublicProfileSettings()}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Security Settings</Text>
        <View style={styles.sectionItem}>
          <Text style={styles.subTitle}>Two Factor</Text>
          <CheckBox
            checked={isTwoFactor}
            onPress={() => saveSecurityTwoFactorSettings()}
          />
        </View>
        <View style={styles.sectionItem}>
          <Text style={styles.subTitle}>Login Alerts</Text>
          <CheckBox
            checked={isLoginAlert}
            onPress={() => saveSecurityLoginAlertSettings()}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Notification Settings</Text>
        <View style={styles.sectionItem}>
          <Text style={styles.subTitle}>Push Notifications</Text>
          <CheckBox
            checked={isPushNotification}
            onPress={() => saveNotificationPushSettings()}
          />
        </View>
      </View>
    </View>
  );
}
