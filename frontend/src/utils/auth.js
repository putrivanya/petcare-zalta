// src/utils/auth.js
export const registerOrLoginUser = (userData) => {
  // Simpan data login ke localStorage sebagai contoh authentikasi
  localStorage.setItem('userToken', 'dummy-jwt-token');
  localStorage.setItem('currentUser', JSON.stringify(userData));
  return { success: true };
};