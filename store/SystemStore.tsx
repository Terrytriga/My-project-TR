import { create } from "zustand";
import {
  Article,
  ArticleCategory,
  FAQ,
  Term,
  TermCategory,
} from "../utils/Types";
import { supabase } from "../lib/SupaBase";

/*
-------------------------------------------------------------------------
---------------------------- Articles -------------------------
-------------------------------------------------------------------------
*/

interface TermCategoryState {
  termCategories: TermCategory[] | null;
  fetchTermCategories: () => Promise<void>;
}

export const useTermCategoryStore = create<TermCategoryState>((set) => ({
  termCategories: null,
  fetchTermCategories: async () => {
    const { data: termCategoryData, error: termCategoryError } = await supabase
      .from("termcategory")
      .select("*");

    if (termCategoryError) {
      return;
    }

    if (termCategoryData) {
      set({ termCategories: termCategoryData });
    }
  },
}));

/*
-------------------------------------------------------------------------
---------------------------- Articles -------------------------
-------------------------------------------------------------------------
*/

interface TermState {
  terms: Term[] | null;
  fetchTerms: () => Promise<void>;
}

export const useTermStore = create<TermState>((set) => ({
  terms: null,
  fetchTerms: async () => {
    const { data: termData, error: termError } = await supabase
      .from("terms")
      .select("*");

    if (termError) {
      return;
    }

    if (termData) {
      set({ terms: termData });
    }
  },
}));

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
