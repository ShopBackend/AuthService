import jwt from 'jsonwebtoken';
import crypto from 'crypto';

class JWTService {
    readonly #accessSecretToken: string;
    readonly #refreshSecretToken: string;
    readonly #accessTokenExpiration: string;
    readonly #refreshTokenExpiration: string;

    constructor() {
        this.#accessSecretToken = process.env.ACCESS_TOKEN_SECRET as string;
        this.#refreshSecretToken = process.env.REFRESH_TOKEN_SECRET as string;
        this.#accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION as string;
        this.#refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION as string;
    }


    generateTokens(userId: string): { accessToken: string; refreshToken: string } {
        const refreshTokenId = crypto.randomUUID();

        const accessToken: string = jwt.sign({ userId }, this.#accessSecretToken, {
            expiresIn: this.#accessTokenExpiration as jwt.SignOptions['expiresIn'],
        });

        const refreshTokenPayload: { userId: string; refreshTokenId: string } = {
            userId,
            refreshTokenId,
        };

        const refreshToken: string = jwt.sign(refreshTokenPayload, this.#refreshSecretToken, {
            expiresIn: this.#refreshTokenExpiration as jwt.SignOptions['expiresIn'],
        });

        return {
            accessToken,
            refreshToken,
        };
    }


    verifyToken(token: string, isRefreshToken: boolean = false): string | object | null {
        try {
            const secretKey = isRefreshToken ? this.#refreshSecretToken : this.#accessSecretToken;
            const decoded = jwt.verify(token, secretKey);
            return decoded;
        } catch (error) {
            throw null;
        }
    }
}

export default JWTService;
