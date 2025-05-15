class RedisRefreshTokenCacheRepository {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    #buildTokenKey(refreshTokenId) {
        return `refresh_token:${refreshTokenId}`;
    }

    async set(refreshTokenId, userId, expiresInSeconds) {
        const tokenKey = this.#buildTokenKey(refreshTokenId);
        await this.redisClient.set(tokenKey, userId, { EX: expiresInSeconds });
    }
    
    async get(refreshTokenId) {
        const tokenKey = this.#buildTokenKey(refreshTokenId);
        const userIdOrNull = await this.redisClient.get(tokenKey);
        return userIdOrNull;
    }

    async remove(refreshTokenId) {
        const tokenKey = this.#buildTokenKey(refreshTokenId);
        await this.redisClient.del(tokenKey);
    }

}
