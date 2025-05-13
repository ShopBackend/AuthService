import { createClient } from 'redis';

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const redisPassword = process.env.REDIS_PASSWORD;
const redisDb = process.env.REDIS_DB;

const client = createClient({
  url: `redis://${redisHost}:${redisPort}`,
  password: redisPassword,
  db: redisDb,
});

client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('error', (err) => {
  throw err;
});

export default client;