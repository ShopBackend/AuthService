import ExpiredTokenError from "../errors/ExpiredTokenError.js";

class ValidateRefreshToken {
    constructor(jwtService, refreshTokenCacheRepository) {
        this.jwtService = jwtService;
        this.refreshTokenCacheRepository = refreshTokenCacheRepository;
    }

    async execute(refreshToken) {
        const payload = this.jwtService.verify(refreshToken, true);

        const refreshTokenId = payload.jti;
        const userId = await this.refreshTokenCacheRepository.get(refreshTokenId);

        if (!userId)
            throw new ExpiredTokenError();

        return { userId, refreshTokenId };
    }

}

export default ValidateRefreshToken;

