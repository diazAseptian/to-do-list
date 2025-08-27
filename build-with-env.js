import { execSync } from 'child_process';
import fs from 'fs';

// Set environment variables for build
process.env.VITE_SUPABASE_URL = 'https://ackohnvlsjqrumohmwhl.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFja29obnZsc2pxcnVtb2htd2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDg4MzIsImV4cCI6MjA3MTg4NDgzMn0.hHRwobWZwh3yrWm4QtuKpt3R9UomTGBHTEiTJeMQ3XA';

console.log('Building with environment variables...');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');

try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}