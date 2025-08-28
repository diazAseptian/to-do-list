import { supabase } from '../lib/supabase';

export const clearAuthData = () => {
  try {
    // Clear localStorage
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-ackohnvlsjqrumohmwhl-auth-token');
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear any other auth-related data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

export const performLogout = async () => {
  try {
    // Step 1: Sign out from Supabase
    const { error: signOutError } = await supabase.auth.signOut({ 
      scope: 'global' 
    });
    
    if (signOutError) {
      console.error('Supabase signOut error:', signOutError);
    }
    
    // Step 2: Clear local storage regardless of signOut result
    clearAuthData();
    
    return { success: true, error: signOutError };
  } catch (error: any) {
    console.error('Logout error:', error);
    
    // Even if there's an error, try to clear local data
    clearAuthData();
    
    return { success: false, error };
  }
};