
import 'react-native-url-polyfill/auto'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pbbpqtqbypbgqzlxpekt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMzM2ODYyMCwiZXhwIjoxOTQ4OTQ0NjIwfQ.13hbr13-EI94OrKxxDFNQr3rxlrSOVxiS0eg_tLdaDQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
})