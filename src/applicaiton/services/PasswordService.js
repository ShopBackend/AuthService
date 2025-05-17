import bcrypt from 'bcrypt';
import PasswordHashingError from './errors/PasswordHashingError.js';
import PasswordVerificationError from './errors/PasswordVerificationError.js';

class PasswordVerificationService {
    #saltRounds;

    constructor(saltRounds = 10) {
        if (saltRounds < 10)
            throw new Error('Salt rounds must be at least 10');

        this.#saltRounds = saltRounds;
    }

    async verifyPassword(password, existingHashedPassword) {
        try {
            return await bcrypt.compare(password, existingHashedPassword);
        }
        catch (error) {
            throw new PasswordVerificationError();
        }
    }

    async hashPassword(password) {
        try {
            return await bcrypt.hash(password, this.#saltRounds);
        }
        catch (error) {
            throw new PasswordHashingError();
        }
    }
}

export default PasswordVerificationService;
