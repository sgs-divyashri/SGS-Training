import bcrypt from 'bcrypt';

export const hashPassword = (password: string): string => {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
}

