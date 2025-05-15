import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import InvalidTokenError from './errors/InvalidTokenError.js';
import ExpiredTokenError from './errors/ExpiredTokenError.js';
class JWTService {
    #accessSecretToken;
    #refreshSecretToken;
    #accessTokenExpiration;
    #refreshTokenExpiration;

    constructor() {
        this.#accessSecretToken = process.env.ACCESS_TOKEN_SECRET;
        this.#refreshSecretToken = process.env.REFRESH_TOKEN_SECRET;
        this.#accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION;
        this.#refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION;
    }

    generateTokens(userId) {
        const refreshTokenId = crypto.randomUUID();

        const accessToken = jwt.sign(userId, this.#accessSecretToken, {
            expiresIn: this.#accessTokenExpiration,
        });

        const refreshTokenPayload = {
            userId,
            refreshTokenId,
        };

        const refreshToken = jwt.sign(refreshTokenPayload, this.#refreshSecretToken, {
            expiresIn: this.#refreshTokenExpiration,
        });

        return {
            accessToken,
            refreshToken,
            refreshTokenId,
        };
    }

    verify(token, isRefreshToken = false) {
        try {
            const secretKey = isRefreshToken ? this.#refreshSecretToken : this.#accessSecretToken;
            const decoded = jwt.verify(token, secretKey);
            return decoded;
        } catch (error) {
            if (error instanceof JsonWebTokenError)
                throw new InvalidTokenError();

            if (error instanceof TokenExpiredError)
                throw new ExpiredTokenError();

            throw error;
        }


    }
}

export default JWTService;
