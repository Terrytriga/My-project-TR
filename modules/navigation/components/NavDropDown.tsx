import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Text } from "@rneui/base";
import { useTheme } from "@rneui/themed";
import { LayoutAnimation, Pressable, StyleSheet, View } from "react-native";
import { DrawerNavigationRoutes } from "../Routes";
import { useState } from "react";

export default function NavDropdown({ currentRoute }: any) {
  const { theme } = useTheme();
  const [menuIndex, setMenuIndex] = useState(-1);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const navigation =
    useNavigation<DrawerNavigationProp<DrawerNavigationRoutes>>();

  type IconName = "aperture" | "settings-sharp";
  interface MenuItem {
    title: string;
    icon?: IconName;
    subMenu: { title: string; route: string }[];
  }
  const DropDownMenu: MenuItem[] = [
    {
      title: "Settings",
      subMenu: [
        { title: "Profile", route: "ProfileSetting" },
        { title: "Account", route: "AccountSetting" },
      ],
    },
  ];

  const styles = StyleSheet.create({
    container: {
      overflow: "hidden",
      marginHorizontal: 10,
      marginVertical: 4,
      borderRadius: 6,
    },
    menu: {
      backgroundColor:
        menuIndex >= 0 ? theme.colors.background : theme.colors.senary,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    menuTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.colors.black,
      paddingBottom: menuIndex >= 0 ? 5 : 0,
    },
    menuRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    menuIcon: {},
    subMenu: {
      paddingHorizontal: 16,
      paddingVertical: 16 / 1.5,
    },
    subMenuTitle: {
      color: theme.colors.black,
    },
    pressed: {
      opacity: 0.75,
    },
    isMenuActive: {
      backgroundColor: theme.colors.primary,
    },
    isSubActive: {
      backgroundColor: theme.colors.primary,
      borderRadius: 6,
    },
  });

  const isMenuActiveWhenCollapsed = (menu: MenuItem) =>
    menu.subMenu.some((submenu) => submenu.route === currentRoute);

  return (
    <>
      {DropDownMenu.map((menu, index) => {
        const isMenuExpanded = menuIndex === index;
        const isActiveWhenCollapsed = isMenuActiveWhenCollapsed(menu);
        return (
          <View style={styles.container} key={index}>
            <Pressable
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.create(200, "easeInEaseOut", "opacity")
                );
                setMenuIndex(menuIndex === index ? -1 : index);
              }}
              style={[
                styles.menu,
                !isMenuExpanded && isActiveWhenCollapsed && styles.isMenuActive,
              ]}
              android_ripple={{ color: "#ADADAD" }}
            >
              <View style={styles.menuRow}>
                <Ionicons
                  name={menu.icon}
                  color={theme.colors.black}
                  size={25}
                />
                <Text style={styles.menuTitle}>{menu.title}</Text>
              </View>
              {menuIndex === index && (
                <View>
                  {menu.subMenu.map((submenu, index) => {
                    const isActive = submenu.route === currentRoute;

                    return (
                      <Pressable
                        key={index}
                        android_ripple={{ color: theme.colors.grey3 }}
                        onPress={() => {
                          setActiveRoute(submenu.route);
                          navigation.navigate(
                            submenu.route as keyof DrawerNavigationRoutes
                          );
                        }}
                        style={({ pressed }) => [
                          isActive && styles.isSubActive,
                          pressed && styles.pressed,
                        ]}
                      >
                        <View style={styles.subMenu}>
                          <Text style={styles.subMenuTitle}>
                            {submenu.title}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </Pressable>
          </View>
        );
      })}
    </>
  );
}
