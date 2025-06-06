import "dotenv/config";

const environment = {
  port: parseInt(process.env.PORT),
  env: process.env.NODE_ENV || "development",
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
  redisUsername: process.env.REDIS_USERNAME,
  redisPassword: process.env.REDIS_PASSWORD,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
};

export default environment;
