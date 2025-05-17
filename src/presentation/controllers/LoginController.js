import { setCookie, clearCookie } from "../utils/Cookies.js";
import getMillisecondsFromExpiration from "../utils/TimeConversions.js";
import InvalidEmailError from "../../applicaiton/validators/errors/InvalidEmailError.js";
import InvalidAuthentication from "../../applicaiton/use_cases/errors/InvalidAuthentication.js";
import InvalidPasswordError from "../../applicaiton/validators/errors/InvalidPasswordError.js";
import InvalidIdError from "../../applicaiton/validators/errors/InvalidIdError.js";
import ExpiredTokenError from "../../applicaiton/errors/ExpiredTokenError.js";
import InvalidTokenError from "../../applicaiton/errors/InvalidTokenError.js";
import { validationResult } from "express-validator";

class LoginController {
    #tokenConfig;
    #isSecure;

    constructor(tokenConfig, isProduction, authenticateUser, validateAccessToken, validateRefreshToken, createSession, clearSession) {
        this.#tokenConfig = tokenConfig;

        this.authenticateUser = authenticateUser;
        this.validateAccessToken = validateAccessToken;
        this.validateRefreshToken = validateRefreshToken;
        this.createSession = createSession;
        this.clearSession = clearSession;

        this.#tokenConfig.access.expiration = getMillisecondsFromExpiration(this.#tokenConfig.access.expiration);
        this.#tokenConfig.refresh.expiration = getMillisecondsFromExpiration(this.#tokenConfig.refresh.expiration);

        this.#isSecure = isProduction;
    }

    async execute(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });


        const isLoggedIn = await this.#checkLoginStatus(req, res);
        if (isLoggedIn)
            return res.status(400).json({ message: "You're already logged in." });


        try {
            const email = req.body.email.toLowerCase();
            const password = req.body.password;

            const userId = await this.authenticateUser.execute({ email, password });
            const { accessToken, refreshToken } = await this.createSession.execute(userId);

            this.#setAuthCookies(res, accessToken, refreshToken);

            res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            if (this.#isExpectedAuthError(error))
                return res.status(error.statusCode).json({ message: error.message });

            throw error;
        }
    }

    async #checkLoginStatus(req, res) {
        const accessToken = req.cookies?.[this.#tokenConfig.access.cookieName];
        const refreshToken = req.cookies?.[this.#tokenConfig.refresh.cookieName];

        if (accessToken) {
            try {
                await this.validateAccessToken.execute(accessToken);
                return true;
            } catch (error) {
                if (!this.#isTokenError(error))
                    throw error;

                clearCookie(res, this.#tokenConfig.access.cookieName, this.#isSecure);
            }
        }

        if (refreshToken) {
            try {
                const { userId, refreshTokenId } = await this.validateRefreshToken.execute(refreshToken);
                await this.clearSession.execute(refreshTokenId);

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
                    await this.createSession.execute(userId);

                this.#setAuthCookies(res, newAccessToken, newRefreshToken);
                return true;
            } catch (error) {
                if (!this.#isTokenError(error))
                    throw error;

                clearCookie(res, this.#tokenConfig.access.cookieName, this.#isSecure);
                clearCookie(res, this.#tokenConfig.refresh.cookieName, this.#isSecure);
            }
        }

        return false;
    }

    #setAuthCookies(res, accessToken, refreshToken) {
        setCookie(
            res,
            this.#tokenConfig.access.cookieName,
            accessToken,
            this.#tokenConfig.access.expiration,
            this.#isSecure
        );
        setCookie(
            res,
            this.#tokenConfig.refresh.cookieName,
            refreshToken,
            this.#tokenConfig.refresh.expiration,
            this.#isSecure
        );
    }

    #isExpectedAuthError(error) {
        return (
            error instanceof InvalidAuthentication ||
            error instanceof InvalidEmailError ||
            error instanceof InvalidPasswordError ||
            error instanceof InvalidIdError ||
            this.#isTokenError(error)
        );
    }

    #isTokenError(error) {
        return error instanceof InvalidTokenError || error instanceof ExpiredTokenError;
    }
}

export default LoginController;
