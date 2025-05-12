import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

class EnvironmentLoader {
    constructor(options = {}) {
        this.envPath = path.resolve(options.rootDir || process.cwd(), '.env');
        this.defaults = {
            DATABASE_URL: 'postgresql://username:password@ip:port/database-name?schema=schema-name',
            NODE_ENV: 'development',
            ACCESS_TOKEN_SECRET: this.generateSecret(),
            REFRESH_TOKEN_SECRET: this.generateSecret(),
            PORT: '3001',
            ...(options.defaults || {}),
        };
    }
    initialize() {
        if (!fs.existsSync(this.envPath)) {
            this.writeEnv(this.defaults);
            console.log('[env] .env created with default values.');
        } else {
            const existingEnv = this.parseEnvFile(fs.readFileSync(this.envPath, 'utf-8'));
            const updatedEnv = this.mergeMissing(existingEnv);

            if (JSON.stringify(existingEnv) !== JSON.stringify(updatedEnv)) {
                this.writeEnv(updatedEnv);
                console.log('[env] .env updated with missing values.');
            }
        }

        dotenv.config({ path: this.envPath });
    }

    writeEnv(envObj) {
        const content = Object.entries(envObj)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        fs.writeFileSync(this.envPath, content, 'utf-8');
    }

    mergeMissing(existingEnv) {
        const updatedEnv = { ...existingEnv };

        for (const key in this.defaults)
            if (!updatedEnv[key] || updatedEnv[key].trim() === '')
                updatedEnv[key] = this.defaults[key];

        return updatedEnv;
    }

    parseEnvFile(content) {
        const envVariables = {};
        const lines = content.split('\n');

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, value] = trimmedLine.split('=');
                if (key && value) {
                    envVariables[key.trim()] = value.trim();
                }
            }
        }

        return envVariables;
    }


    generateSecret() {
        return crypto.randomBytes(64).toString('hex');
    }
}

export default EnvironmentLoader;
