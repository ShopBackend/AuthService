class ClearSession {
    constructor(refreshTokenCacheRepository) {
        this.refreshTokenCacheRepository = refreshTokenCacheRepository;
    }

    async execute(refreshTokenId) {
        await this.refreshTokenCacheRepository.remove(refreshTokenId);
    }
}