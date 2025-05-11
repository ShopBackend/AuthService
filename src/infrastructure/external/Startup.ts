import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

class Startup {
    private called: boolean = false;

    initialize(): void {
        if (this.called) {
            console.warn('Startup has already been initialized. Skipping initialization.');
            return;
        }
        this.called = true;
        this.checkRequiredEnvVars();
        this.createEnvFileIfMissing();
    }

    private checkRequiredEnvVars(): void {
        const requiredVars = [
            'DATABASE_URL',
            'ACCESS_TOKEN_SECRET',
            'REFRESH_TOKEN_SECRET',
            'ACCESS_TOKEN_EXPIRATION',
            'REFRESH_TOKEN_EXPIRATION',
            'PORT',
        ];

        requiredVars.forEach((varName) => {
            if (!process.env[varName]) {
                console.error(`Missing required environment variable: ${varName}`);
                process.exit(1);
            }
        });
    }

    private createEnvFileIfMissing(): void {
        const ENV_PATH = path.resolve(process.cwd(), '.env');

        if (!fs.existsSync(ENV_PATH)) {
            console.log('.env file not found, creating with default values...');

            const defaultValues = {
                DATABASE_URL: 'your-database-url',
                ACCESS_TOKEN_SECRET: this.generateSecret(),
                REFRESH_TOKEN_SECRET: this.generateSecret(),
                ACCESS_TOKEN_EXPIRATION: '1h',
                REFRESH_TOKEN_EXPIRATION: '7d',
                PORT: '3001',
            };

            const envContent = Object.entries(defaultValues)
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');

            fs.writeFileSync(ENV_PATH, envContent, 'utf-8');
            console.log('.env file created with default values, including generated secrets.');
        } else {
            console.log('.env file exists.');
        }
    }

    private generateSecret(): string {
        return crypto.randomBytes(64).toString('hex');
    }
}

export default Startup;
