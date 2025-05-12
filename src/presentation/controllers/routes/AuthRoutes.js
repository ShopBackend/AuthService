import express from 'express';
import AuthController from '../controllers/AuthController.js';
import PrismaUserRepository from '../../infrastructure/db/repositories/PrismaUserRepository.js';
import { registerUserValidation, loginUserValidation } from '../validations/AuthValidations.js';

import CreateUser from '../../application/use_cases/CreateUser.js';
import AuthenticateAndGenerateToken from '../../application/use_cases/AuthenticateAndGenerateToken.js';

import PasswordService from '../../application/services/PasswordService.js';
import JWTService from '../../application/services/JWTService.js';

const router = express.Router();

// Repositories
const prismaUserRepository = new PrismaUserRepository();

// Services
const passwordService = new PasswordService();
const jwtService = new JWTService();

// Use cases
const createUser = new CreateUser(prismaUserRepository, passwordService);
const authenticateAndGenerateToken = new AuthenticateAndGenerateToken(prismaUserRepository, passwordService, jwtService);

// Controllers
const authController = new AuthController(createUser, authenticateAndGenerateToken);

router.post('/register', registerUserValidation, authController.register.bind(authController));
router.post('/login', loginUserValidation, authController.login.bind(authController));

export default router;