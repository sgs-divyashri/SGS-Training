export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): boolean => {
    return emailRegex.test(email.trim());
};

// Normalize email
export const normalizedEmail = (email: string): string => {
    return email.trim().toLowerCase()
}