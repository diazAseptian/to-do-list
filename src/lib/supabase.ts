import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ackohnvlsjqrumohmwhl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFja29obnZsc2pxcnVtb2htd2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDg4MzIsImV4cCI6MjA3MTg4NDgzMn0.hHRwobWZwh3yrWm4QtuKpt3R9UomTGBHTEiTJeMQ3XA';

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
    detectSessionInUrl: false,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token'
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