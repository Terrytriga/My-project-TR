import { Text, useTheme } from "@rneui/themed";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { Chat, Profile } from "../../../utils/Types";
import TouchableScale from "react-native-touchable-scale";
import { formatDate } from "../../../utils/FormatDate";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackRoutes, MessageStackRoutes } from "../../navigation/Routes";

const { height, width } = Dimensions.get("window");

export default function AllUserListItem(profile: Profile) {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackRoutes>>();

  function pressHandler() {
    if (!profile) return;
    navigation.navigate("ViewUser", { profile });
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      maxHeight: height / 5,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 10,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginHorizontal: 10,
    },
    textContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      marginLeft: 15,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    date: {
      fontSize: 12,
    },
    followsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
  });

  return (
    <TouchableScale
      friction={90}
      tension={100}
      activeScale={0.85}
      style={styles.container}
      onPress={pressHandler}
    >
      <Image
        style={styles.image}
        source={
          profile.avatarurl
            ? { uri: profile.avatarurl }
            : require("../../../assets/Profile.png")
        }
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {profile.firstname} {profile.lastname}
        </Text>
        <Text>{profile.username}</Text>
        <Text>Role: {profile.role}</Text>
        <View style={styles.followsContainer}>
          <Text>Followers: {profile.totalfollowers}</Text>
          <Text>Following: {profile.totalfollowings}</Text>
        </View>
      </View>
    </TouchableScale>
  );
}
