import redisClient from "../libs/redis.js";
import { generateCacheKey } from "../utils/generateCacheKey.js";

export const getRedisCache = async (model, filters) => {
  const cacheKey = generateCacheKey(model, filters);

  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
};
