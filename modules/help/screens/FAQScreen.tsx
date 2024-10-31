import {
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "@rneui/themed";
import {
  useArticleCategoryStore,
  useArticleStore,
  useFAQStore,
} from "../../../store/SystemStore";
import { useTheme } from "@rneui/themed";
import { useState } from "react";

export default function FAQScreen() {
  const { theme } = useTheme();
  const { articles } = useArticleStore();
  const { articleCategories } = useArticleCategoryStore();
  const { faqs } = useFAQStore();
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);

  const styles = StyleSheet.create({
    container: {
      // flex: 1,
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
    },
    itemText: {
      fontSize: 16,
      color: theme.colors.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.greyOutline,
      width: "80%",
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
  });

  const toggleExpandCategory = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCategory(expandedCategory === id ? null : id);
    setExpandedArticle(null); // Reset expanded article when changing category
  };

  const toggleExpandArticle = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedArticle(expandedArticle === id ? null : id);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {articleCategories &&
        articles &&
        faqs &&
        articleCategories.map((category, index) => {
          return (
            <View key={category.articlecategory_id}>
              <Pressable
                onPress={() =>
                  toggleExpandCategory(category.articlecategory_id)
                }
              >
                <Text style={styles.header}>
                  {index + 1 + ". " + category.name}
                </Text>
              </Pressable>
              {expandedCategory === category.articlecategory_id &&
                articles
                  .filter(
                    (article) =>
                      article.articlecategory_id === category.articlecategory_id
                  )
                  .map((article, index) => {
                    return (
                      <View style={styles.item} key={article.article_id}>
                        <Pressable
                          onPress={() =>
                            toggleExpandArticle(article.article_id)
                          }
                        >
                          <Text style={styles.itemText}>
                            {category.articlecategory_id +
                              "." +
                              (index + 1) +
                              ". " +
                              article.title}
                          </Text>
                        </Pressable>
                        {expandedArticle === article.article_id &&
                          faqs
                            .filter(
                              (faq) => faq.article_id === article.article_id
                            )
                            .map((faq) => {
                              return (
                                <View style={styles.subItem} key={faq.faq_id}>
                                  <Text
                                    style={[
                                      styles.subItemText,
                                      styles.subItemTextBold,
                                    ]}
                                  >
                                    Question:{" "}
                                  </Text>
                                  <Text style={styles.subItemText}>
                                    {faq.question}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.subItemText,
                                      styles.subItemTextBold,
                                    ]}
                                  >
                                    Answer:{" "}
                                  </Text>
                                  <Text style={styles.subItemText}>
                                    {faq.answer}
                                  </Text>
                                </View>
                              );
                            })}
                      </View>
                    );
                  })}
            </View>
          );
        })}
    </ScrollView>
  );
}
