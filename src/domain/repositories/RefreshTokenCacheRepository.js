class RefreshTokenCasheRepository {
    async set(refreshTokenId, userId, expiresInSeconds) {
        throw new Error('Method "set" must be implemented.');
    }
    async get(refreshTokenId) {
        throw new Error('Method "exists" must be implemented.');
    }

    async remove(refreshTokenId) {
        throw new Error('Method "remove" must be implemented.');
    }
}

export default RefreshTokenCasheRepository;
