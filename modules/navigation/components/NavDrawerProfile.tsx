import { Avatar, Text } from "@rneui/base";
import { Pressable, StyleSheet, View } from "react-native";
import { useUserStore } from "../../../store/UserStore";
import { useTheme } from "@rneui/themed";
import { DrawerNavigationState, useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerNavigationRoutes } from "../Routes";

export default function NavDrawerProfile(props: any) {
  const { user } = useUserStore();
  const { theme } = useTheme();
  const navigation =
    useNavigation<DrawerNavigationProp<DrawerNavigationRoutes>>();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginHorizontal: 10,
      marginVertical: 10,
      alignItems: "center",
      elevation: 3,
      borderRadius: 50,
      borderWidth: 0.5,
      borderColor: theme.colors.primary,
      overflow: "hidden",
      marginTop: 30,
      flexDirection: "row",
    },
    textFullname: {
      color: theme.colors.black,
      paddingHorizontal: 15,
      fontWeight: "bold",
      fontSize: 18,
    },
    textEmail: {
      color: theme.colors.black,
      paddingHorizontal: 15,
      fontSize: 12,
      paddingTop: 5,
    },
    col: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      paddingRight: 20,
      marginRight: 20,
    },
    avatar: {
      borderRadius: 30,
      width: 60,
      height: 60,
    },
    pressed: {
      opacity: 0.75,
      backgroundColor: theme.colors.primary,
    },
  });

  function handleOnPress() {
    navigation.navigate("ProfileSetting");
  }
  return (
    <>
      <Pressable onPress={handleOnPress}>
        {({ pressed }) => (
          <View style={[styles.container, pressed ? styles.pressed : null]}>
            <Avatar
              size={60}
              avatarStyle={styles.avatar}
              source={
                user?.avatarurl
                  ? {
                      uri: user?.avatarurl,
                    }
                  : require("../../../assets/Profile.png")
              }
              key={user?.id}
            />
            <View style={styles.col}>
              <Text style={styles.textFullname}>
                {user?.firstname && user?.lastname
                  ? user?.firstname + " " + user?.lastname
                  : "Please Update Profile"}
              </Text>
              <Text style={styles.textEmail}>{user?.email}</Text>
            </View>
          </View>
        )}
      </Pressable>
    </>
  );
}
