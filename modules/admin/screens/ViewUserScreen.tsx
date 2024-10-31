import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Text, useTheme } from "@rneui/themed";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";
import { AdminStackRoutes } from "../../navigation/Routes";
import { useEffect, useLayoutEffect, useState } from "react";
import { Profile } from "../../../utils/Types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRoleStore } from "../../../store/UserStore";
import { supabase } from "../../../lib/SupaBase";

export default function ViewUserScreen() {
  const { theme } = useTheme();
  const route = useRoute<RouteProp<AdminStackRoutes, "ViewUser">>();
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackRoutes>>();
  const profile = route.params.profile;
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<string | null>();
  const { roles } = useRoleStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: profile?.firstname + " " + profile?.lastname,
      headerRight: () => {
        return (
          <View style={styles.iconRow}>
            <Pressable
              style={({ pressed }) => [
                styles.iconPressable,
                pressed && styles.pressed,
              ]}
              // onPress={handleConfirmDeleteThread}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
        );
      },
    });
  }, [navigation]);

  useEffect(() => {
    setUserProfile(profile);
    setUserRole(profile.role);
  }, [route]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 100,
    },
    iconRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      width: 100,
    },
    iconPressable: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    pressed: {
      opacity: 0.5,
    },
  });

  function confirmRoleChange(newRole: string | null) {
    if (!newRole) return;
    Alert.alert(
      "Confirm role change",
      "Are you sure you want to change the user's role?",
      [
        {
          text: "Cancel",
          style: "destructive",
        },
        {
          text: "Confirm",
          style: "default",
          onPress: () => changeRole(newRole),
        },
      ]
    );
  }
  async function changeRole(newRole: string) {
    if (!userProfile?.user_id || !roles) return;
    const role = roles.find((role) => role.name === newRole);
    if (!role) return;
    const { error: updateRoleError } = await supabase
      .from("userrole")
      .update({
        role_id: role.role_id,
      })
      .eq("user_id", userProfile.user_id);

    if (updateRoleError) {
      console.error(updateRoleError);
      Alert.alert(
        "Role change failed.",
        "Please try again! Or contact system administrator!",
        [
          {
            text: "Confirm",
            style: "default",
          },
        ]
      );
      return;
    }
    Alert.alert(
      "Role change successfull.",
      "The user's role has been changed successfully!",
      [
        {
          text: "Confirm",
          style: "default",
        },
      ]
    );
    setUserRole(role.name);
  }

  return (
    <View style={styles.container}>
      <Image
        source={
          userProfile?.avatarurl
            ? { uri: userProfile?.avatarurl }
            : require("../../../assets/Profile.png")
        }
        style={styles.image}
      />
      <Text>Profile ID: {userProfile?.profile_id}</Text>
      <Text>User ID: {userProfile?.user_id}</Text>
      <Text>
        Fullname: {userProfile?.firstname + " " + userProfile?.lastname}
      </Text>
      <Text>Username: {userProfile?.username}</Text>
      <Picker
        style={{ width: "50%", height: 50, color: theme.colors.black }}
        itemStyle={{ color: theme.colors.black }}
        dropdownIconColor={theme.colors.primary}
        selectedValue={userRole}
        onValueChange={(itemValue) => confirmRoleChange(itemValue)}
        prompt="Select Role"
      >
        {roles &&
          roles.map((role) => (
            <Picker.Item
              key={role.role_id}
              label={role.name}
              value={role.name}
            />
          ))}
      </Picker>
    </View>
  );
}
