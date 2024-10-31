import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://zymwvhvjkoiaozcjphuu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5bXd2aHZqa29pYW96Y2pwaHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzOTQ3MTIsImV4cCI6MjAyOTk3MDcxMn0.oh0fwNGrp6M9fKM-HWgTDEHh9DntEmqHD1buuwpdFEQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
