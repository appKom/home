import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);
