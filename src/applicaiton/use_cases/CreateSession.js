import validate from "../validators/CreateSessionValidator.js";
import getSecondsFromExpiration from "../utils/TimeConversions.js";

class CreateSession {
    #sessionIdExprationInSeconds;

    constructor(jwtService, refreshTokenCacheRepository,sessionIdExpirationInSeconds) {
        this.jwtService = jwtService;
        this.refreshTokenCacheRepository = refreshTokenCacheRepository;
        this.#sessionIdExprationInSeconds = sessionIdExpirationInSeconds;
    }

    async execute(userId) {
        validate(userId);

        const { accessToken, refreshToken, refreshTokenId } = this.jwtService.generateTokens(userId);

        await this.refreshTokenCacheRepository.set(refreshTokenId, userId, this.#sessionIdExprationInSeconds)
        return { accessToken, refreshToken };
    }
}

export default CreateSession;
