import InvalidAuthentication from './errors/InvalidAuthentication.js';
import validate from "../validators/AuthenticateAndGenerateTokenValidator.js";

class AuthenticateAndGenerateToken {
    constructor(userRepository, passwordService, jwtService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.jwtService = jwtService;
    }

    async execute(userData) {
        userData = validate(userData);

        const existingUser = await this.userRepository.findByEmail(userData.email);

        if (!existingUser)
            throw new InvalidAuthentication();

        const isPasswordValid = await this.passwordService.verifyPassword(userData.password, existingUser.password);

        if (!isPasswordValid)
            throw new InvalidAuthentication();

        const { accessToken, refreshToken } = this.jwtService.generateTokens(existingUser.id);

        return { accessToken, refreshToken };
    }
}

export default AuthenticateAndGenerateToken;
