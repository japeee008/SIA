import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bnygvxesmbiumvwrjjmy.supabase.co";
const supabaseAnonKey = "sb_publishable_6Yzn30ASGK1HVhmAjzw0sw_kjXljVDS";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);