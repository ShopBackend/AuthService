import { IUser } from '../../domain/entities/user.js';
import { UserRepository } from '../../domain/repositories/UserRepository.js';
import InvalidAuthentication from './errors/InvalidAuthentication.js';
import JWTService from '../services/JWTService.js';
import PasswordVerificationService from '../services/PasswordService.js';

class AuthenticateAndGenerateToken {
    jwtService: JWTService;
    userRepository: UserRepository;
    passwordVerificationService: PasswordVerificationService;

    constructor(userRepository: UserRepository, passwordVerificationService: PasswordVerificationService, jwtService: JWTService) {
        this.userRepository = userRepository;
        this.passwordVerificationService = passwordVerificationService;
        this.jwtService = jwtService
    }

    async execute(user: IUser) {
        const existingUser = await this.userRepository.findByEmail(user.email);

        if (!existingUser)
            throw new InvalidAuthentication();

        const isPasswordValid = await this.passwordVerificationService.verifyPassword(user.password, existingUser.password);

        if (!isPasswordValid)
            throw new InvalidAuthentication();

        const { accessToken, refreshToken, refreshTokenId } = this.jwtService.generateTokens(user.id);
        // todo handle refreshTokenId in the database

        return { accessToken, refreshToken };
    }
}

export default AuthenticateAndGenerateToken;