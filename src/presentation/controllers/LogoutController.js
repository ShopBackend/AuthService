import { clearCookie } from "../utils/Cookies.js";
import InvalidTokenError from "../../applicaiton/errors/InvalidTokenError.js";
import ExpiredTokenError from "../../applicaiton/errors/ExpiredTokenError.js";

class LogoutController {
    #accessTokenCookieName;
    #refreshTokenCookieName;

    #isSecure;

    constructor(tokenConfig, isProduction, clearSession, validateRefreshToken) {
        this.#accessTokenCookieName = tokenConfig.access.cookieName;
        this.#refreshTokenCookieName = tokenConfig.refresh.cookieName;

        this.#isSecure = isProduction;

        this.clearSession = clearSession;
        this.validateRefreshToken = validateRefreshToken;
    }

    async execute(req, res) {
        try {
            const refreshToken = req.cookies?.[this.#refreshTokenCookieName];

            clearCookie(res, this.#accessTokenCookieName, this.#isSecure);
            clearCookie(res, this.#refreshTokenCookieName, this.#isSecure);

            if (refreshToken) {
                const { refreshTokenId } = await this.validateRefreshToken.execute(refreshToken);
                await this.clearSession.execute(refreshTokenId);
            }

        }
        catch (error) {
            if (!this.#isExpectedAuthError(error))
                throw error;
        }

        res.status(200).json({ message: 'Logout successful' });

    }

    #isExpectedAuthError(error) {
        return error instanceof InvalidTokenError || error instanceof ExpiredTokenError;
    }
}

export default LogoutController;