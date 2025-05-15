import InvalidTokenError from "./errors/InvalidTokenError.js";

class ValidateRefreshToken {
    constructor(jwtService, refreshTokenCacheRepository) {
        this.jwtService = jwtService;
        this.refreshTokenCacheRepository = refreshTokenCacheRepository;
    }

    async execute(refreshToken) {
        const refreshTokenId = this.jwtService.verify(refreshToken, true);

        if (!refreshTokenId )
            throw new InvalidTokenError();
        
        const userId = await this.refreshTokenCacheRepository.get(refreshTokenId);
        return {userId, refreshTokenId};

    }

}

export default ValidateRefreshToken;

