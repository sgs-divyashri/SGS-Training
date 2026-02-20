export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): string | null => {
    const trimmedEmail = email.trim();
    return emailRegex.test(trimmedEmail) ? trimmedEmail : null;
};
