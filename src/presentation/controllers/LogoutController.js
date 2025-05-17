import { clearCookie } from "../utils/Cookies.js";

class LogoutController {
    #accessTokenCookieName;
    #refreshTokenCookieName;

    #isSecure;

    constructor(tokenConfig, isProduction) {
        this.#accessTokenCookieName = tokenConfig.access.cookieName;
        this.#refreshTokenCookieName = tokenConfig.refresh.cookieName;

        this.#isSecure = isProduction;
    }

    async execute(req, res) {
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        clearCookie(res, this.#accessTokenCookieName, this.#isSecure);
        clearCookie(res, this.#refreshTokenCookieName, this.#isSecure);
        // remove form cache
    }
}

export default LogoutController;