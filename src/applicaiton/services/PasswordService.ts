import bcrypt from 'bcrypt';

class PasswordVerificationService {
    private readonly saltRounds: number = 10;

    async verifyPassword(password: string, existingHashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, existingHashedPassword);
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }
}

export default PasswordVerificationService;
