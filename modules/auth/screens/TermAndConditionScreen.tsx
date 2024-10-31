import { Text, useTheme } from "@rneui/themed";
import { useState } from "react";
import {
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useTermCategoryStore, useTermStore } from "../../../store/SystemStore";

export default function TermAndConditionScreen() {
  const { theme } = useTheme();
  const { terms } = useTermStore();
  const { termCategories } = useTermCategoryStore();

  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const toggleExpandCategory = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    header: {
      fontSize: 25,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginVertical: 10,
    },
    item: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.greyOutline,
    },
    subItem: {
      padding: 10,
      paddingLeft: 20,
      backgroundColor: theme.colors.grey5,
      marginVertical: 5,
      borderRadius: 5,
    },
    subItemText: {
      fontSize: 14,
      color: theme.colors.black,
    },
    subItemTextBold: {
      fontWeight: "bold",
    },
    termText: {
      fontSize: 14,
      marginVertical: 5,
    },
  });
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {termCategories &&
        terms &&
        termCategories.map((category, index) => {
          return (
            <View key={category.id}>
              <Pressable onPress={() => toggleExpandCategory(category.id)}>
                <Text style={styles.header}>
                  {index + 1 + ". " + category.name}
                </Text>
              </Pressable>
              {expandedCategory === category.id &&
                terms
                  .filter((term) => term.category_id === category.id)
                  .map((term, index) => {
                    return (
                      <View style={styles.item} key={term.id}>
                        <Text style={styles.subItemTextBold}>
                          {index + 1 + ". " + term.title}
                        </Text>
                        <Text style={styles.subItemText}>
                          {term.description}
                        </Text>
                        <Text style={styles.termText}>{term.term}</Text>
                      </View>
                    );
                  })}
            </View>
          );
        })}
    </ScrollView>
  );
}
