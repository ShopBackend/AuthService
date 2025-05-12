import EnvironmentLoader from './infrastructure/external/EnvironmentLoader.js';
import { prisma } from './shared/PrismaDbConfig.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

dotenv.config();
new EnvironmentLoader().initialize();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

const PORT = process.env.PORT;
let server;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected.');

    server = app.listen(PORT, () => {
      console.log(`Auth server running on port ${PORT}`);
    });

  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to start Auth application:', error.message);
      await gracefulShutdown(error);
    } else {
      console.error('An unknown error during server start:', error);
      await gracefulShutdown('Unknown error');
    }
  }
};

const gracefulShutdown = async (signalOrError) => {
  const errorMessage = signalOrError instanceof Error ? signalOrError.message : signalOrError;
  console.error('Shutting down due to:', errorMessage);

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
    if (shutdownError instanceof Error) {
      console.error('Error during shutdown:', shutdownError.message);
    } else {
      console.error('Unknown error during shutdown:', shutdownError);
    }
    process.exit(1);
  }
};

process.on('unhandledRejection', gracefulShutdown);
process.on('uncaughtException', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

startServer();
