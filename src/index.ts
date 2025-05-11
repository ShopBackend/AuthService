import express from 'express';
import Startup from './infrastructure/external/Startup';
import { prisma } from './shared/PrismaDbConfig';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import http from 'http';

dotenv.config();
new Startup().initialize();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

const PORT = process.env.PORT || 3001;
let server: http.Server;

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Database connected.');

    server = app.listen(PORT, () => {
      console.log(`Auth server running on port ${PORT}`);
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to start Auth application:', error.message);
      await gracefulShutdown(error);
    } else {
      console.error('An unknown error during server start:', error);
      await gracefulShutdown('Unknown error');
    }
  }
};

const gracefulShutdown = async (signalOrError: string | Error): Promise<void> => {
  const errorMessage = signalOrError instanceof Error ? signalOrError.message : signalOrError;
  console.error('Shutting down due to:', errorMessage);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }

    await prisma.$disconnect();
    console.log('Graceful shutdown completed.');
    process.exit(0);
  } catch (shutdownError: unknown) {
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
