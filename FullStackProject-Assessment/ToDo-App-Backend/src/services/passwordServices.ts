import bcrypt from 'bcrypt';

const SIMPLE_COMPLEXITY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*~]).{8,}$/;

export interface PasswordCheckResult {
    ok: boolean;
    errors: string;
}

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);

export const passwordServices = {
    hashPassword: (password: string) => {
        return bcrypt.hashSync(password, SALT_ROUNDS);
    },

    verifyPassword: (password: string, hash: string) => {
        if (!password || !hash) {
            return false;
        }
        try {
            return bcrypt.compareSync(password, hash);
        } catch {
            return false;
        }
    },

    validatePasswordPolicy: (password: string): PasswordCheckResult => {
        let errors: string = "";

        // Check if password exists
        if (!password) {
            return { ok: false, errors: 'Password is required' };
        }

        // Check complexity
        if (!SIMPLE_COMPLEXITY.test(password)) {
            errors = 'Password must be at least 8 characters long and include atleast 1 uppercase, lowercase, number, and special character'
        }

        // Check for spaces
        if (/\s/.test(password)) {
            errors = 'Password must not contain spaces'
        }

        return { ok: errors.length === 0, errors };
    }
}


