import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pbbpqtqbypbgqzlxpekt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMzM2ODYyMCwiZXhwIjoxOTQ4OTQ0NjIwfQ.13hbr13-EI94OrKxxDFNQr3rxlrSOVxiS0eg_tLdaDQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);