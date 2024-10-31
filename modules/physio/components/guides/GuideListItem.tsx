import { Text, useTheme } from "@rneui/themed";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Guide } from "../../../../utils/Types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  DietitianGuideStack,
  PhysioGuideStack,
} from "../../../navigation/Routes";
import { formatDate } from "../../../../utils/FormatDate";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const aspect = 12 / 9;
interface GuideItemProps {
  guide: Guide;
}

export default function GuideListItem({ guide }: GuideItemProps) {
  const isWeb = Platform.OS === "web";
  const navigation =
    useNavigation<NativeStackNavigationProp<PhysioGuideStack>>();

  const { theme } = useTheme();

  function handlePress() {
    navigation.navigate("ViewPhysioGuides", {
      id: guide.id,
    });
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 10,
      backgroundColor: theme.colors.senary,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 10,
      width: Platform.OS !== "web" ? "100%" : 700,
    },
    textContainer: {
      width: "50%",
      padding: 10,
    },
    imageContainer: {
      alignItems: "flex-end",
      justifyContent: "center",
      width: "50%",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      alignSelf: "center",
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
    },
    date: {
      fontSize: 10,
    },
    icon: {
      marginRight: 5,
    },
    description: {
      fontSize: 15,
      marginBottom: 10,
    },
    image: {
      width: !isWeb ? width / 2.5 : width / 6,
      height: !isWeb ? width / 2.5 / aspect : width / 6 / aspect,
      borderRadius: 10,
    },
    pressed: {
      opacity: 0.5,
      backgroundColor: theme.colors.primary,
    },
  });
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{guide.title}</Text>
        <Text style={styles.description}>{guide.description}</Text>
        <View style={styles.dateContainer}>
          <Ionicons
            style={styles.icon}
            name="ellipse-sharp"
            size={16}
            color={theme.colors.primary}
          />
          <Text style={styles.date}>
            Published: {formatDate(new Date(guide.datecreated))}
          </Text>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: guide.pictureurl }} />
      </View>
    </Pressable>
  );
}
