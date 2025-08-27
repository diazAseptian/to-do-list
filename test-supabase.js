import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ackohnvlsjqrumohmwhl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFja29obnZsc2pxcnVtb2htd2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDg4MzIsImV4cCI6MjA3MTg4NDgzMn0.hHRwobWZwh3yrWm4QtuKpt3R9UomTGBHTEiTJeMQ3XA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test 1: Check if we can connect
    const { data, error } = await supabase.from('tasks').select('count', { count: 'exact' });
    
    if (error) {
      console.error('❌ Connection error:', error.message);
      console.error('Error details:', error);
      
      if (error.message.includes('relation "tasks" does not exist')) {
        console.log('💡 Solution: Tabel "tasks" belum ada. Jalankan migration SQL di Supabase Dashboard.');
      }
    } else {
      console.log('✅ Connection successful');
      console.log('Tasks count:', data);
    }
    
    // Test 2: Check auth
    const { data: session } = await supabase.auth.getSession();
    console.log('Current session:', session.session ? 'Logged in' : 'Not logged in');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testConnection();