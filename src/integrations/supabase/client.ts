
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zqexgraljvprliaufxeg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZXhncmFsanZwcmxpYXVmeGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMTk2OTIsImV4cCI6MjA1NjY5NTY5Mn0.m9i3fhu8yZDbXJNiD4DHXn2hVmkdswyyckt1NOaKzGY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
