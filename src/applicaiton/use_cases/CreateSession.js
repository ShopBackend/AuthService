import validate from "../validators/CreateSessionValidator.js";
import getSecondsFromExpiration from "../utils/getSecondsFromExpiration.js";

class CreateSession {
    #sessionIdExprationInSeconds;

    constructor(jwtService, refreshTokenCacheRepository) {
        this.jwtService = jwtService;
        this.refreshTokenCacheRepository = refreshTokenCacheRepository;
        this.#sessionIdExprationInSeconds = getSecondsFromExpiration(process.env.SESSION_ID_EXPIRATION);
    }

    async execute(userId) {
        validate(userId);

        const { accessToken, refreshToken, refreshTokenId } = this.jwtService.generateTokens(userID);

        await this.refreshTokenCacheRepository.set(refreshTokenId, userId, this.#sessionIdExprationInSeconds)
        return { accessToken, refreshToken };
    }
}

export default CreateSession;
