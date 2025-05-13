import { validationResult } from 'express-validator';
import EmailAlreadyExists from "../../../applicaiton/use_cases/errors/EmailAlreadyExists.js";
import InvalidEmailError from "../../../applicaiton/validators/errors/InvalidEmailError.js";
import InvalidPasswordError from "../../../applicaiton/validators/errors/InvalidPasswordError.js";
import InvalidIdError from "../../../applicaiton/validators/errors/InvalidIdError.js";
import UsernameAlreadyInUse from "../../../applicaiton/use_cases/errors/UsernameAlreadyInUse.js";
import InvalidAuthentication from "../../../applicaiton/use_cases/errors/InvalidAuthentication.js";
import getMillisecondsFromExpiration from "../../Utils.js";

class AuthController {
    #accessTokenExpiration;
    #refreshTokenExpiration;
    #accessTokenCookieName;
    #refreshTokenCookieName;

    #isSecure;

    constructor(createUser, authenticateUser, generateTokens) {
        this.createUser = createUser;
        this.authenticateUser = authenticateUser;
        this.generateTokens = generateTokens;

        this.#accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION;
        this.#refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION;

        this.#accessTokenCookieName = process.env.ACCESS_TOKEN_COOKIE_NAME;
        this.#refreshTokenCookieName = process.env.REFRESH_TOKEN_COOKIE_NAME;

        this.#isSecure = process.env.NODE_ENV === 'production';
    }

    async register(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        try {
            const { username, email, password } = req.body;
            email = email.toLowerCase();

            await this.createUser.execute({ username, email, password });
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            if (error instanceof EmailAlreadyExists || error instanceof UsernameAlreadyInUse)
                return res.status(error.statusCode).json({ message: error.message });
            throw error;
        }
    }

    async login(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        try {
            // todo validate tokens, if it's validated then return an error that he is already logged in
            // todo else, login
            const { email , password } = req.body;
            email = email.toLowerCase();
            const id = await this.authenticateUser.execute({ email, password });
            
            const { accessToken, refreshToken } = await this.generateTokens.execute(id);

            res.cookie(this.#accessTokenCookieName, accessToken, {
                httpOnly: true,
                secure: this.#isSecure,
                maxAge: getMillisecondsFromExpiration(this.#accessTokenExpiration),
                sameSite: 'Lax'

            });

            res.cookie(this.#refreshTokenCookieName, refreshToken, {
                httpOnly: true,
                secure: this.#isSecure,
                maxAge: getMillisecondsFromExpiration(this.#refreshTokenExpiration),
                sameSite: 'Lax'
            });

            res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            if (error instanceof InvalidAuthentication || error instanceof InvalidEmailError
                || error instanceof InvalidPasswordError || error instanceof InvalidIdError)
                return res.status(error.statusCode).json({ message: error.message });

            throw error;
        }
    }

    async logout(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this.authenticateAndGenerateToken.execute({ email, password });

            res.cookie(this.#accessTokenCookieName, accessToken, {
                httpOnly: true,
                secure: this.#isSecure,
                maxAge: getMillisecondsFromExpiration(this.#accessTokenExpiration),
                sameSite: 'Lax'

            });

            res.cookie(this.#refreshTokenCookieName, refreshToken, {
                httpOnly: true,
                secure: this.#isSecure,
                maxAge: getMillisecondsFromExpiration(this.#refreshTokenExpiration),
                sameSite: 'Lax'
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
