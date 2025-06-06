import redisClient from "../libs/redis.js";

export const saveRedisCache = async (key, data) => {
  await redisClient.set(key, JSON.stringify(data), {
    EX: 3600,
  });
};
