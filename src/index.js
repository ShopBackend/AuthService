import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';

import Envrionment from './infrastructure/external/Envrionment.js';
import createRedisClient from './infrastructure/cache/RedisClient.js';

import generateCorsMiddleware from './presentation/middleware/CorsMiddleware.js';
import AuthRoutes from './presentation/routes/AuthRoutes.js';

import PrismaUserRepository from './infrastructure/db/repositories/PrismaUserRepository.js';
import RedisRefreshTokenRepository from './infrastructure/cache/repositories/RedisRefreshTokenRepository.js';

const enviornment = new Envrionment();
enviornment.initialize();

const redisClient = createRedisClient(enviornment);
const prisma = new PrismaClient();

const prismaUserRepository = new PrismaUserRepository(prisma);
const redisRefreshTokenRepository = new RedisRefreshTokenRepository(redisClient);

const authRoutes = new AuthRoutes(prismaUserRepository, redisRefreshTokenRepository, enviornment);

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  throw err;
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(generateCorsMiddleware(enviornment.allowedOrigins, enviornment.isProduction));

app.use('/auth', authRoutes.getRouter());

const PORT = enviornment.port;
let server;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected.');

    await redisClient.connect();

    server = app.listen(PORT, () => {
      console.log(`Auth server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start Auth application:', error instanceof Error ? error.message : error);
    await gracefulShutdown(error);
  }
};

const gracefulShutdown = async (signalOrError) => {
  console.error('Shutting down due to:', signalOrError);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }

    await prisma.$disconnect();
    console.log('Graceful shutdown completed.');
    process.exit(0);
  } catch (shutdownError) {
    console.error('Error during shutdown:', shutdownError instanceof Error ? shutdownError.message : shutdownError);
    process.exit(1);
  }
};

process.on('unhandledRejection', gracefulShutdown);
process.on('uncaughtException', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

startServer();
