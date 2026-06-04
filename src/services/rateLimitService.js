const { getRedis } = require('../config/redis');

const LIMITS = {
  email: parseInt(process.env.MAX_EMAILS_PER_HOUR) || 5,
  sms: parseInt(process.env.MAX_SMS_PER_HOUR) || 3,
  inapp: 50
};

async function checkRateLimit(userId, channel) {
  const redis = getRedis();
  const key = `ratelimit:${channel}:${userId}`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, 3600); // 1 hour window
  }
  if (current > LIMITS[channel]) {
    const ttl = await redis.ttl(key);
    return {
      allowed: false,
      message: `Rate limit exceeded for ${channel}. Retry after ${ttl}s`,
      retryAfter: ttl
    };
  }
  return { allowed: true, current, limit: LIMITS[channel] };
}

async function getRateLimitStatus(userId, channel) {
  const redis = getRedis();
  const key = `ratelimit:${channel}:${userId}`;
  const current = parseInt(await redis.get(key)) || 0;
  const ttl = await redis.ttl(key);
  return { current, limit: LIMITS[channel], remaining: Math.max(0, LIMITS[channel] - current), resetIn: ttl };
}

module.exports = { checkRateLimit, getRateLimitStatus };
