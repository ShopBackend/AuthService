import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

class EnvBootstrapper {
    #envPath;
    #defaults;
    #called = false;

    constructor(options = {}) {
        const rootDir = options.rootDir || process.cwd();
        this.#envPath = path.resolve(rootDir, '.env');

        this.#defaults = {
            DATABASE_URL: 'your-database-url',
            ACCESS_TOKEN_SECRET: this.#generateSecret(),
            REFRESH_TOKEN_SECRET: this.#generateSecret(),
            ACCESS_TOKEN_EXPIRATION: '1h',
            REFRESH_TOKEN_EXPIRATION: '7d',
            PORT: '3001',
            ...(options.defaults || {}),
        };
    }

    initialize() {
        if (this.#called) return;
        this.#called = true;

        let envExists = fs.existsSync(this.#envPath);

        if (!envExists) {
            this.#writeEnv(this.#defaults);
            console.log('[env] .env created with default values.');
        } else {
            const parsed = this.#parseEnvFile(fs.readFileSync(this.#envPath, 'utf-8'));
            const merged = this.#mergeMissing(parsed, this.#defaults);

            if (this.#hasDifferences(parsed, merged)) {
                this.#writeEnv(merged);
                console.log('[env] .env updated with missing or empty values.');
            }
        }

        this.#loadEnvToProcess();
    }

    #writeEnv(envObj) {
        const content = Object.entries(envObj)
            .map(([k, v]) => `${k}=${v}`)
            .join('\n');

        fs.writeFileSync(this.#envPath, content, 'utf-8');
    }

    #parseEnvFile(content) {
        return content
            .split('\n')
            .filter(line => line.trim() && !line.trim().startsWith('#'))
            .reduce((acc, line) => {
                const [key, ...rest] = line.split('=');
                const value = rest.join('=').trim();
                if (key && value) acc[key.trim()] = value;
                return acc;
            }, {});
    }

    #mergeMissing(existing, defaults) {
        return Object.keys(defaults).reduce((acc, key) => {
            const val = existing[key];
            acc[key] = val && val.trim() !== '' ? val : defaults[key];
            return acc;
        }, { ...existing });
    }

    #hasDifferences(before, after) {
        return Object.keys(after).some(key => after[key] !== before[key]);
    }

    #loadEnvToProcess() {
        const raw = fs.readFileSync(this.#envPath, 'utf-8');
        const parsed = this.#parseEnvFile(raw);
        for (const [key, value] of Object.entries(parsed)) {
            if (!(key in process.env)) {
                process.env[key] = value;
            }
        }
    }

    #generateSecret() {
        return crypto.randomBytes(64).toString('hex');
    }
}

export default EnvBootstrapper;
