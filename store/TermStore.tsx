import { create } from "zustand";
import { Term, TermCategory } from "../utils/Types";
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
