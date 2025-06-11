import fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./src/routes/index.js";
import { createRequire } from "node:module";
import environment from "./src/config/envs.js";

const require = createRequire(import.meta.url);
const { clerkPlugin } = require("@clerk/fastify");

const app = fastify({
  pluginTimeout: 60000,
  bodyLimit: 10 * 1024 * 1024,
});

const isProduction = environment.env === "production";

app.register(cors, {
  origin: isProduction
    ? "https://www.appcashwise.com.br"
    : ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: "*",
  credentials: true,
});

app.register(clerkPlugin, {
  secretKey: environment.secretKey,
  publishableKey: environment.publishableKey,
});

app.register(routes);

app
  .listen({
    port: environment.port || 8080,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log(`Server is running on port ${environment.port || 8080}`);
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
