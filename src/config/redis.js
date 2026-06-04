const Redis = require('ioredis');
const logger = require('./logger');

let redisClient;

async function connectRedis() {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => Math.min(times * 50, 2000)
  });

  redisClient.on('connect', () => logger.info('Redis connected successfully'));
  redisClient.on('error', (err) => logger.error('Redis error:', err));
}

function getRedis() {
  if (!redisClient) throw new Error('Redis not initialized');
  return redisClient;
}

module.exports = { connectRedis, getRedis };
