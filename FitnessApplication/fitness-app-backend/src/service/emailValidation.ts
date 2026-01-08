export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): boolean {
  return emailRegex.test(email);
}


// export const validateEmail = (email: string): string | null => {
//     const trimmedEmail = email.trim().toLowerCase();
//     return emailRegex.test(trimmedEmail) ? trimmedEmail : null;
// };
