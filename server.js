import fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./src/routes/index.js";
import { clerkPlugin } from "@clerk/fastify";
import environment from "./src/config/envs.js"

const app = fastify({
  pluginTimeout: 60000,
  bodyLimit: 10 * 1024 * 1024,
});

app.register(cors, {
  origin: true,
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