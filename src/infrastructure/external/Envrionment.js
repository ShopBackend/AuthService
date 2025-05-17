import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

class Envrionment {
    static #initialized = false;

    constructor(options = {}) {
        this.envPath = path.resolve(options.rootDir || process.cwd(), '.env');
        this.envrionmentTypes = {
            development: 'development',
            production: 'production',
        };
        this.defaults = {
            DATABASE_URL: 'postgresql://username:password@ip:port/database-name?schema=public',
            ACCESS_TOKEN_SECRET: this.#generateSecret(),
            REFRESH_TOKEN_SECRET: this.#generateSecret(),
            ACCESS_TOKEN_EXPIRATION: '1h',
            REFRESH_TOKEN_EXPIRATION: '7d',
            SESSION_ID_EXPIRATION_IN_SECONDS: '604800',
            ACCESS_TOKEN_COOKIE_NAME: 'access_token',
            REFRESH_TOKEN_COOKIE_NAME: 'refresh_token',
            NODE_ENV: 'development',
            REDIS_HOST: 'localhost',
            REDIS_PORT: '6379',
            REDIS_PASSWORD: 'redis_password',
            REDIS_DB: '0',
            PORT: '3001',
            ALLOWED_ORIGINS: 'http://localhost:3000',

            ...(options.defaults || {}),
        };
    }

    initialize() {
        if (Envrionment.#initialized) {
            console.warn('[env] Environment already initialized.');
            return;
        }

        dotenv.config();
        Envrionment.#initialized = true;
        let existingEnv = {};
        let needsWrite = false;

        if (fs.existsSync(this.envPath)) {
            try {
                existingEnv = dotenv.parse(fs.readFileSync(this.envPath, 'utf-8'));
            } catch (error) {
                console.error(`Failed to read .env file: ${error.message}`);
                existingEnv = {};
                needsWrite = true;
            }
        } else
            needsWrite = true;


        const finalEnvFields = { ...this.defaults };
        for (const key in existingEnv)
            if (existingEnv[key] && existingEnv[key].trim() !== '')
                finalEnvFields[key] = existingEnv[key];



        if (needsWrite || Object.keys(this.defaults).some(key => !(key in existingEnv) || !existingEnv[key]?.trim())) {
            try {
                this.#writeEnv(finalEnvFields);
            } catch (writeError) {
                console.error(`Failed to write .env file: ${writeError.message}`);
            }
        }

        for (const key in finalEnvFields)
            if (!(key in process.env))
                process.env[key] = finalEnvFields[key];

        if (!Object.values(this.envrionmentTypes).includes(process.env.NODE_ENV))
            throw new Error(`Invalid NODE_ENV value in .env: "${process.env.NODE_ENV}". Expected one of: ${Object.values(this.envrionmentTypes).join(', ')}`);


    }

    #writeEnv(envObj) {
        const content = Object.entries(envObj)
            .map(([key, value]) => `${key}=${String(value ?? '')}`)
            .join('\n');

        fs.writeFileSync(this.envPath, content, 'utf-8');
    }

    #generateSecret() {
        return crypto.randomBytes(64).toString('hex');
    }

    getTokenConfig(includeCookieNames = true, includeExpiration = true, includeSecrets = false) {
        const access = {
            expiration: process.env.ACCESS_TOKEN_EXPIRATION
        };

        const refresh = {
            expiration: process.env.REFRESH_TOKEN_EXPIRATION
        };

        if (includeSecrets) {
            access.secret = process.env.ACCESS_TOKEN_SECRET;
            refresh.secret = process.env.REFRESH_TOKEN_SECRET;
        }

        if (includeCookieNames) {
            access.cookieName = process.env.ACCESS_TOKEN_COOKIE_NAME;
            refresh.cookieName = process.env.REFRESH_TOKEN_COOKIE_NAME;
        }

        return { access, refresh };
    }

    get allowedOrigins() {
        const allowedOrigins = process.env.ALLOWED_ORIGINS;
        if (!allowedOrigins)
            return [];

        return allowedOrigins.split(',').map(origin => origin.trim());
    }

    get databaseUrl() {
        return process.env.DATABASE_URL;
    }

    get sessionIdExpirationInSeconds() {
        return process.env.SESSION_ID_EXPIRATION_IN_SECONDS;
    }
    get isDevelopment() {
        return process.env.NODE_ENV.toLowerCase() === this.envrionmentTypes.development;
    }

    get isProduction() {
        return process.env.NODE_ENV.toLowerCase() === this.envrionmentTypes.production;
    }

    get redisHost() {
        return process.env.REDIS_HOST;
    }

    get redisPort() {
        return process.env.REDIS_PORT;
    }

    get redisPassword() {
        return process.env.REDIS_PASSWORD;
    }

    get redisDb() {
        return process.env.REDIS_DB;
    }

    get port() {
        return process.env.PORT;
    }
}

export default Envrionment;