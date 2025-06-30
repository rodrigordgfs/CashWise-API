import "dotenv/config";

/**
 * Application environment configuration object
 * Loads and validates environment variables for the application
 * @type {Object}
 * @property {number} port - The port number for the server
 * @property {string} env - The current environment (development, production, etc.)
 * @property {string} publishableKey - Clerk publishable key for authentication
 * @property {string} secretKey - Clerk secret key for authentication
 */
const environment = {
  port: parseInt(process.env.PORT),
  env: process.env.NODE_ENV || "development",
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
};

export default environment;