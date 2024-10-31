import { Text, useTheme } from "@rneui/themed";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { Profile } from "../../../utils/Types";
import TouchableScale from "react-native-touchable-scale";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MessageStackRoutes } from "../../navigation/Routes";

const { height, width } = Dimensions.get("window");

export default function ContactItem({
  user_id,
  avatarurl,
  firstname,
  lastname,
  username,
}: Profile) {
  const navigation =
    useNavigation<NativeStackNavigationProp<MessageStackRoutes>>();
  const { theme } = useTheme();

  function pressHandler() {
    if (!user_id) return;
    navigation.navigate("Message", {
      user_id: user_id,
    });
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      maxHeight: height / 8,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      marginVertical: 10,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 10,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: theme.colors.black,
      marginHorizontal: 10,
    },
    textContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      marginLeft: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    subTitle: {
      fontSize: 16,
      fontWeight: "normal",
    },
  });

  return (
    <TouchableScale
      onPress={pressHandler}
      friction={90}
      tension={100}
      activeScale={0.85}
      style={styles.container}
    >
      <Image
        style={styles.image}
        source={
          avatarurl
            ? { uri: avatarurl }
            : require("../../../assets/Profile.png")
        }
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {firstname} {lastname}
        </Text>
        <Text style={styles.subTitle}>{username}</Text>
      </View>
    </TouchableScale>
  );
}
