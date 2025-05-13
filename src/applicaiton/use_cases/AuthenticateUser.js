import InvalidAuthentication from './errors/InvalidAuthentication.js';
import validate from "../validators/AuthenticateUserValidator.js";

class AuthenticateUser {
    constructor(userRepository, passwordService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    async execute(userData) {
        userData = validate(userData); 

        const existingUser = await this.userRepository.findByEmail(userData.email);

        if (!existingUser)
            throw new InvalidAuthentication();

        const isPasswordValid = await this.passwordService.verifyPassword(userData.password, existingUser.password);

        if (!isPasswordValid)
            throw new InvalidAuthentication();


        // todo generate tokens and push them to redis (the refresh token)
        return existingUser.id;
    }
}

export default AuthenticateUser;
