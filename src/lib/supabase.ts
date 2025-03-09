import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These environment variables will be set after connecting to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please connect to Supabase using the "Connect to Supabase" button.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);