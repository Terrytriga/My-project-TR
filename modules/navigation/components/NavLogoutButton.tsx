import { Alert, Platform } from "react-native";
import { useUserStore } from "../../../store/UserStore";
import NavDrawerMenuItem from "./NavDrawerMenuItem";

export default function NavLogoutButton() {
  const { signOut } = useUserStore();
  function handleLogout() {
    if (Platform.OS === "web") {
      signOut();
      return;
    }
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        style: "default",
        onPress: () => signOut(),
      },
    ]);
  }

  return <NavDrawerMenuItem onPress={handleLogout} label={"Logout"} />;
}
