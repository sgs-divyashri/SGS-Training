import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../../config/constants';

export const hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
}

export const verifyPassword = (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
}


