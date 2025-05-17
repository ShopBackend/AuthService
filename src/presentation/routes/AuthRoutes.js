import express from 'express';

import { registerUserValidation, loginUserValidation } from '../validations/AuthValidations.js';

import PasswordService from '../../applicaiton/services/PasswordService.js';
import JWTService from '../../applicaiton/services/JWTService.js';

import CreateUser from '../../applicaiton/use_cases/CreateUser.js';
import AuthenticateUser from '../../applicaiton/use_cases/AuthenticateUser.js';
import ValidateAccessToken from '../../applicaiton/use_cases/ValidateAccessToken.js';
import ValidateRefreshToken from '../../applicaiton/use_cases/ValidateRefreshToken.js';
import CreateSession from '../../applicaiton/use_cases/CreateSession.js';
import ClearSession from '../../applicaiton/use_cases/ClearSession.js';

import LoginController from '../controllers/LoginController.js';
import RegisterController from '../controllers/RegisterController.js';
import LogoutController from '../controllers/LogoutController.js';

class AuthRoutes {
    constructor(prismaUserRepository, redisRefreshTokenRepository, envrionment) {
        this.prismaUserRepository = prismaUserRepository;
        this.redisRefreshTokenRepository = redisRefreshTokenRepository;

        this.envrionment = envrionment;

        this.passwordService = new PasswordService();
        this.jwtService = new JWTService(envrionment.getTokenConfig(false, true, true));

        this.router = express.Router();
        this.#build();
    }

    #build() {
        const createUser = new CreateUser(this.prismaUserRepository, this.passwordService);
        const authenticateUser = new AuthenticateUser(this.prismaUserRepository, this.passwordService, this.jwtService);
        const validateAccessToken = new ValidateAccessToken(this.jwtService);
        const validateRefreshToken = new ValidateRefreshToken(this.jwtService, this.redisRefreshTokenRepository);
        const createSession = new CreateSession(this.jwtService, this.redisRefreshTokenRepository, this.envrionment.sessionIdExpirationInSeconds);
        const clearSession = new ClearSession(this.redisRefreshTokenRepository);

        const loginController = new LoginController(this.envrionment.getTokenConfig(true, true, false), this.envrionment.isProduction, authenticateUser, validateAccessToken, validateRefreshToken, createSession, clearSession);
        const registerController = new RegisterController(createUser);
        const logoutController = new LogoutController(this.envrionment.getTokenConfig(true, false, false), this.envrionment.isProduction, clearSession, validateRefreshToken);

        this.router.post('/login', loginUserValidation, loginController.execute.bind(loginController));
        this.router.post('/register', registerUserValidation, registerController.execute.bind(registerController));
        this.router.post('/logout', logoutController.execute.bind(logoutController));
    }

    getRouter() {
        return this.router;
    }
}

export default AuthRoutes;
