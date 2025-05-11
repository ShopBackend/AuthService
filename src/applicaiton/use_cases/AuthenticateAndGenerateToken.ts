import { IUser } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/UserRepository';
import InvalidAuthentication from './errors/InvalidAuthentication';
import JWTService from '../services/JWTService';
import PasswordVerificationService from '../services/PasswordService';
import validate from "../validators/AuthenticateAndGenerateTokenValidator";

class AuthenticateAndGenerateToken {
    jwtService: JWTService;
    userRepository: UserRepository;
    passwordVerificationService: PasswordVerificationService;

    constructor(userRepository: UserRepository, passwordVerificationService: PasswordVerificationService, jwtService: JWTService) {
        this.userRepository = userRepository;
        this.passwordVerificationService = passwordVerificationService;
        this.jwtService = jwtService
    }

    async execute(userData: Omit<IUser, 'id' | 'username'>) {
        validate(userData);

        const existingUser = await this.userRepository.findByEmail(userData.email);

        if (!existingUser)
            throw new InvalidAuthentication();

        const isPasswordValid = await this.passwordVerificationService.verifyPassword(userData.password, existingUser.password);

        if (!isPasswordValid)
            throw new InvalidAuthentication();

        const { accessToken, refreshToken } = this.jwtService.generateTokens(existingUser.id);
        // todo handle refreshTokenId in the database refresh_token:12345:web      → <hashed-token> (7d TTL)

        return { accessToken, refreshToken };
    }
}

export default AuthenticateAndGenerateToken;