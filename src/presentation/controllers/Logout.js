import { clearCookie } from "../utils/Cookies.js";

class Logout {
    #accessTokenCookieName;
    #refreshTokenCookieName;

    #isSecure;

    constructor() {
        this.#accessTokenCookieName = process.env.ACCESS_TOKEN_COOKIE_NAME;
        this.#refreshTokenCookieName = process.env.REFRESH_TOKEN_COOKIE_NAME;

        this.#isSecure = process.env.NODE_ENV === 'production';
    }

    async execute(req, res) {
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        clearCookie(res, this.#accessTokenCookieName, this.#isSecure);
        clearCookie(res, this.#refreshTokenCookieName, this.#isSecure);
        // remove form cache
    }
}

export default Logout;