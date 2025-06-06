import "dotenv/config";

const environment = {
  port: parseInt(process.env.PORT),
  env: process.env.NODE_ENV || "development",
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
  redisUrl: process.env.REDIS_URL,
};

export default environment;
