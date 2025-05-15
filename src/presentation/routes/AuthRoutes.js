import express from 'express';

import AuthController from '../controllers/AuthController.js';
import PrismaUserRepository from '../../infrastructure/db/repositories/PrismaUserRepository.js';
import { registerUserValidation, loginUserValidation } from '../validations/AuthValidations.js';

import CreateUser from '../../applicaiton/use_cases/CreateUser.js';
import AuthenticateUser from '../../applicaiton/use_cases/AuthenticateUser.js';

import PasswordService from '../../applicaiton/services/PasswordService.js';
import JWTService from '../../applicaiton/services/JWTService.js';
const authRouter = express.Router();

// Repositories
const prismaUserRepository = new PrismaUserRepository();

// Services
const passwordService = new PasswordService();
const jwtService = new JWTService();

// Use cases
const createUser = new CreateUser(prismaUserRepository, passwordService);
const authenticateUser = new AuthenticateUser(prismaUserRepository, passwordService, jwtService);

// Controllers
const authController = new AuthController(createUser, authenticateUser);

authRouter.post('/register', registerUserValidation, authController.register.bind(authController));
authRouter.post('/login', loginUserValidation, authController.login.bind(authController));

export default authRouter;