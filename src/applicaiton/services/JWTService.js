import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import InvalidTokenError from '../errors/InvalidTokenError.js';
import ExpiredTokenError from '../errors/ExpiredTokenError.js';

const { JsonWebTokenError, TokenExpiredError } = jwt;

class JWTService {
    #accessSecretToken;
    #refreshSecretToken;
    #accessTokenExpiration;
    #refreshTokenExpiration;

    constructor(tokenConfig) {
        this.#accessSecretToken = tokenConfig.access.secret;
        this.#refreshSecretToken = tokenConfig.refresh.secret;
        this.#accessTokenExpiration = tokenConfig.access.expiration;
        this.#refreshTokenExpiration = tokenConfig.refresh.expiration;
    }

    generateTokens(userId) {
        const refreshTokenId = crypto.randomUUID();

        const accessToken = jwt.sign({ userId }, this.#accessSecretToken, {
            expiresIn: this.#accessTokenExpiration,
        });

        const refreshTokenPayload = {
            userId,
            jti: refreshTokenId,
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

            if (isRefreshToken && !decoded?.jti)
                throw new InvalidTokenError();

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
