
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';

const supabaseUrl = 'https://qzyokvmregilrhlkrggy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6eW9rdm1yZWdpbHJobGtyZ2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjY2ODYsImV4cCI6MjA3MTkwMjY4Nn0.ss2tnIvGa0IxFlrn_kT0rBWTI0nDx4RMqq_3BzclhAs';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
