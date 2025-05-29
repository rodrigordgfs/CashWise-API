import fastify from "fastify";
import cors from "@fastify/cors";
import { clerkPlugin } from "@clerk/fastify";

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
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

// app.register(routes);

app
  .listen({
    port: process.env.PORT || 8080,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });