import express from 'express';

import LoginController from '../controllers/LoginController.js';
import RegisterController from '../controllers/RegisterController.js';
import LogoutController from '../controllers/LogoutController.js';

import PrismaUserRepository from '../../infrastructure/db/repositories/PrismaUserRepository.js';
import RedisRefreshTokenRepository from '../../infrastructure/cache/repositories/RedisRefreshTokenRepository.js';

import { registerUserValidation, loginUserValidation } from '../validations/AuthValidations.js';

import CreateUser from '../../applicaiton/use_cases/CreateUser.js';
import AuthenticateUser from '../../applicaiton/use_cases/AuthenticateUser.js';
import ValidateAccessToken from '../../applicaiton/use_cases/ValidateAccessToken.js';
import ValidateRefreshToken from '../../applicaiton/use_cases/ValidateRefreshToken.js';
import CreateSession from '../../applicaiton/use_cases/CreateSession.js';
import ClearSession from '../../applicaiton/use_cases/ClearSession.js';


import PasswordService from '../../applicaiton/services/PasswordService.js';
import JWTService from '../../applicaiton/services/JWTService.js';


const authRouter = express.Router();

// Repositories
const prismaUserRepository = new PrismaUserRepository();
const redisRefreshTokenRepository = new RedisRefreshTokenRepository();

// Services
const passwordService = new PasswordService();
const jwtService = new JWTService();

// Use cases
const createUser = new CreateUser(prismaUserRepository, passwordService);
const authenticateUser = new AuthenticateUser(prismaUserRepository, passwordService, jwtService);
const validateAccessToken = new ValidateAccessToken( jwtService);
const validateRefreshToken = new ValidateRefreshToken(jwtService, redisRefreshTokenRepository);
const createSession = new CreateSession(jwtService, redisRefreshTokenRepository);
const clearSession = new ClearSession(redisRefreshTokenRepository);

// Controllers
const loginController = new LoginController(authenticateUser, validateAccessToken, validateRefreshToken, createSession, clearSession);
const registerController = new RegisterController(createUser);
const logoutController = new LogoutController();

authRouter.post('/login', loginUserValidation, loginController.execute.bind(loginController));
authRouter.post('/register', registerUserValidation, registerController.execute.bind(registerController));
authRouter.post('/logout', logoutController.execute.bind(logoutController));

export default authRouter;