import InvalidTokenError from "./errors/InvalidTokenError.js";
import TokenExpiredError from "./errors/TokenExpiredError.js";

class ValidateToken {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }

    async execute(accessToken, refreshToken) {
        try {
            this.jwtService.verify(accessToken);
        } catch (error) {
            if (error instanceof JsonWebTokenError)
                throw new InvalidTokenError();

            if (error instanceof TokenExpiredError)
                return await this.#handleRefreshToken(refreshToken);

            throw error;
        }
    }

    async #handleRefreshToken(refreshToken) {
        try {
            const refreshTokenId = this.jwtService.verify(refreshToken, true);
            // todo here check of refreshTokenId is in the database
            // if not, throw InvalidTokenError
            // if yes, generate new access token and refresh token

            return {
                accessToken,
                refreshToken: newRefreshToken,
            };
        } catch (err) {
            if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
                throw new TokenExpiredError('Refresh token has expired or is invalid');
            }

            throw err;
        }
    }
}

export default ValidateToken;
