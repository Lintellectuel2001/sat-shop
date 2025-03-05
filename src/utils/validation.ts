
// Email validation utility
export const validateEmail = (email: string) => {
  // Stricter email validation that matches Supabase's requirements
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

// Password validation utility
export const validatePassword = (password: string) => {
  return password.length >= 6;
};
