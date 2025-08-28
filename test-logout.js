// Test script untuk memverifikasi fungsi logout
// Jalankan di browser console untuk testing

console.log('Testing logout functionality...');

// Test 1: Check if auth data exists
const checkAuthData = () => {
  const keys = Object.keys(localStorage);
  const authKeys = keys.filter(key => 
    key.includes('supabase') || key.includes('auth')
  );
  
  console.log('Auth-related localStorage keys:', authKeys);
  return authKeys.length > 0;
};

// Test 2: Simulate logout process
const testLogout = async () => {
  try {
    console.log('Before logout - Auth data exists:', checkAuthData());
    
    // Import the logout function (adjust path as needed)
    const { performLogout } = await import('./src/utils/authUtils.ts');
    
    const result = await performLogout();
    
    console.log('Logout result:', result);
    console.log('After logout - Auth data exists:', checkAuthData());
    
    return result;
  } catch (error) {
    console.error('Test logout error:', error);
    return { success: false, error };
  }
};

// Export for manual testing
window.testLogout = testLogout;
window.checkAuthData = checkAuthData;

console.log('Test functions available: testLogout(), checkAuthData()');