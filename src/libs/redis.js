import { createClient } from "redis";
import environment from "../config/envs.js";

const redisClient = createClient({
  url: environment.redisUrl,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  await redisClient.connect();
})();

export default redisClient;
