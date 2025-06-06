import redisClient from "../libs/redis.js";

export const invalidateTransactionCache = async (name) => {
  const keys = await redisClient.keys(`${name}:*`);
  if (keys.length) {
    await redisClient.del(keys);
  }
};
