import { create } from "zustand";
import { AiResponse } from "../utils/Types";
import { useUserStore } from "./UserStore";
import { supabase } from "../lib/SupaBase";

interface CoachKitState {
  responses: AiResponse[] | [];
  fetchResponses: () => Promise<void>;
  addResponse: (response: AiResponse) => void;
  deleteResponse: (response: AiResponse) => void;
}

export const useResponseStore = create<CoachKitState>((set) => ({
  responses: [],
  fetchResponses: async () => {
    const { user } = useUserStore.getState();
    const { data: responseData, error: responseError } = await supabase
      .from("airesponse")
      .select("*")
      .eq("user_id", user?.id);
    if (responseError) {
      return;
    }
    set({ responses: responseData });
  },
  addResponse: (prompt) => {
    set((state) => ({ responses: [...state.responses, prompt] }));
  },
  deleteResponse: (deletePrompt) =>
    set((state) => ({
      responses: state.responses.filter(
        (prompt) => prompt.id !== deletePrompt.id
      ),
    })),
}));
