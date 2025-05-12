import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

class EnvironmentLoader {
    constructor(options = {}) {
        this.envPath = path.resolve(options.rootDir || process.cwd(), '.env');
        this.defaults = {
            DATABASE_URL: 'postgresql://username:password@ip:port/database-name?schema=schema-name=public',
            ACCESS_TOKEN_SECRET: this.generateSecret(),
            REFRESH_TOKEN_SECRET: this.generateSecret(),
            ACCESS_TOKEN_EXPIRATION: '1h',
            REFRESH_TOKEN_EXPIRATION: '7d',
            PORT: '3001',
            ACCESS_TOKEN_COOKIE_NAME: 'access_token',
            REFRESH_TOKEN_COOKIE_NAME: 'refresh_token',
            NODE_ENV: 'development',
            ...(options.defaults || {}),
        };
    }

    initialize() {
        let existingEnv = {};
        let needsWrite = false;

        if (fs.existsSync(this.envPath)) {
            try {
                existingEnv = dotenv.parse(fs.readFileSync(this.envPath, 'utf-8'));
            } catch (error) {
                console.error('[env] Error parsing existing .env file:', error);
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
                this.writeEnv(finalEnvFields);
            } catch (writeError) {
                console.error('[env] Error writing .env file:', writeError);
            }
        }

        for (const key in finalEnvFields)
            if (!(key in process.env))
                process.env[key] = finalEnvFields[key];

    }

    writeEnv(envObj) {
        const content = Object.entries(envObj)
            .map(([key, value]) => `${key}=${String(value ?? '')}`)
            .join('\n');

        fs.writeFileSync(this.envPath, content, 'utf-8');
    }

    generateSecret() {
        return crypto.randomBytes(64).toString('hex');
    }

}

export default EnvironmentLoader;