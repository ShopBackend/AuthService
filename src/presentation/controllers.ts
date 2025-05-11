import AuthenticateAndGenerateToken from "../applicaiton/use_cases/AuthenticateAndGenerateToken";
import CreateUser from "../applicaiton/use_cases/CreateUser";
import { validationResult } from 'express-validator';
import EmailAlreadyExists from "../applicaiton/use_cases/errors/EmailAlreadyExists";
import InvalidAuthentication from "../applicaiton/use_cases/errors/InvalidAuthentication";
import getMillisecondsFromExpiration from "./utils";
import { Request, Response } from 'express';

class AuthController {
    createUser: CreateUser;
    authenticateAndGenerateToken: AuthenticateAndGenerateToken;

    readonly #accessTokenExpiration: string;
    readonly #refreshTokenExpiration: string;
    readonly #accessTokenCookieName: string;
    readonly #refreshTokenCookieName: string;

    constructor(createUser: CreateUser, authenticateAndGenerateToken: AuthenticateAndGenerateToken) {
        this.createUser = createUser;
        this.authenticateAndGenerateToken = authenticateAndGenerateToken;

        this.#accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION as string;
        this.#refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION as string;

        this.#accessTokenCookieName = process.env.ACCESS_TOKEN_COOKIE_NAME as string;
        this.#refreshTokenCookieName = process.env.REFRESH_TOKEN_COOKIE_NAME as string;
    }

    async register(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        try {
            const { username, email, password } = req.body;
            await this.createUser.execute({ username, email, password });
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            if (error instanceof EmailAlreadyExists)
                return res.status(error.statusCode).json({ message: error.message });

            throw error;
        }
    }

    async login(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this.authenticateAndGenerateToken.execute({ email, password });

            res.cookie(this.#accessTokenCookieName, accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: getMillisecondsFromExpiration(this.#accessTokenExpiration),
            });

            res.cookie(this.#refreshTokenCookieName, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: getMillisecondsFromExpiration(this.#refreshTokenExpiration),
            });

            res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            if (error instanceof InvalidAuthentication)
                return res.status(error.statusCode).json({ message: error.message });

            throw error;
        }
    }
}

export default AuthController;