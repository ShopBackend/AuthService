import { createClient } from 'redis';

export function createRedisClient(envrionment) {
  const redisHost = envrionment.redisHost;
  const redisPort = envrionment.redisPort;
  const redisPassword = envrionment.redisPassword;
  const redisDb = envrionment.redisDb;

  return createClient({
    url: `redis://${redisHost}:${redisPort}`,
    password: redisPassword,
    db: redisDb,
  });
}

export default createRedisClient;