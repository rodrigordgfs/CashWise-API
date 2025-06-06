import redisClient from "../libs/redis.js";

export const getRedisCache = async (cacheKey) => {
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
};
