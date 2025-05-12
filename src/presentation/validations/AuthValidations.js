import { body } from 'express-validator';

const registerUserValidation = [
    body('email')
        .isEmail().withMessage('Invalid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8, max: 20 }).withMessage('Password must be at least 8 characters and maximum 20 characters')
        .trim(),
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 12 }).withMessage('Username must be at least 3 characters and maximum 12 characters')
        .trim(),
];

const loginUserValidation = [
    body('email')
        .isEmail().withMessage('Invalid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8, max:20 }).withMessage('Password must be at least 8 characters and maximum 20 characters')
        .trim(),
];

export { registerUserValidation, loginUserValidation };
