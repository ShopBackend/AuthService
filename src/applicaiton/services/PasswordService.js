import bcrypt from 'bcrypt';

class PasswordVerificationService {
    #saltRounds = 10;

    constructor(saltRounds = 10) {
        if (saltRounds < 10)
            throw new Error('Salt rounds must be at least 10');

        this.saltRounds = saltRounds;
    }

    async verifyPassword(password, existingHashedPassword) {
        return await bcrypt.compare(password, existingHashedPassword);
    }

    async hashPassword(password) {
        return await bcrypt.hash(password, this.saltRounds);
    }
}

export default PasswordVerificationService;
