import { create } from "zustand";
import { supabase } from "../lib/SupaBase";
import { useUserStore } from "./UserStore";
import { Article, ArticleCategory, FAQ } from "../utils/Types";

/*
-------------------------------------------------------------------------
---------------------------- Article Categories -------------------------
-------------------------------------------------------------------------
*/

interface ArticleCategoryState {
  articleCategories: ArticleCategory[] | null;
  fetchArticleCategories: () => Promise<void>;
}

export const useArticleCategoryStore = create<ArticleCategoryState>((set) => ({
  articleCategories: null,
  fetchArticleCategories: async () => {
    const { data: articleCategoryData, error: articleCategoryError } =
      await supabase.from("articlecategory").select("*");

    if (articleCategoryError) {
      return;
    }

    if (articleCategoryData) {
      set({ articleCategories: articleCategoryData });
    }
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- Articles -------------------------
-------------------------------------------------------------------------
*/

interface ArticleState {
  articles: Article[] | null;
  fetchArticles: () => Promise<void>;
}

export const useArticleStore = create<ArticleState>((set) => ({
  articles: null,
  fetchArticles: async () => {
    const { data: articleData, error: articleError } = await supabase
      .from("article")
      .select("*");

    if (articleError) {
      return;
    }

    if (articleData) {
      set({ articles: articleData });
    }
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- Articles -------------------------
-------------------------------------------------------------------------
*/

interface FAQState {
  faqs: FAQ[] | null;
  fetchFaqs: () => Promise<void>;
}

export const useFAQStore = create<FAQState>((set) => ({
  faqs: null,
  fetchFaqs: async () => {
    const { data: faqData, error: faqError } = await supabase
      .from("faq")
      .select("*");

    if (faqError) {
      return;
    }

    if (faqData) {
      set({ faqs: faqData });
    }
  },
}));
