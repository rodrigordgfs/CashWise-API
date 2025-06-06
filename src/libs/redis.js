import { createClient } from "redis";
import environment from "../config/envs.js";

const redisClient = createClient({
  username: environment.redisUsername,
  password: environment.redisPassword,
  socket: {
      host: environment.redisHost,
      port: environment.redisPort
  }
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  await redisClient.connect();
})();

export default redisClient;
