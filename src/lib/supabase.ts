import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables:', {
    VITE_SUPABASE_URL: supabaseUrl ? 'Set' : 'Missing',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Set' : 'Missing'
  });
  throw new Error('Missing Supabase environment variables. Please check your deployment settings.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

export type Task = {
  id: string;
  user_id: string;
  judul: string;
  kategori: 'Kuliah' | 'Himpunan' | 'Skripsi' | 'Kerja';
  prioritas: 'High' | 'Medium' | 'Low';
  deadline?: string;
  status: 'Belum dikerjakan' | 'Sedang dikerjakan' | 'Selesai';
  deskripsi?: string;
  created_at: string;
};