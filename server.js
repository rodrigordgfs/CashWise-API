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

app.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = [
      "https://appcashwise.com.br",
      "https://www.appcashwise.com.br",
      "https://cashwiseapi-hav8m.kinsta.app",
      "https://www.cashwiseapi-hav8m.kinsta.app",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: "*",
  credentials: true,
  exposedHeaders: [
    "x-total-count",
    "x-current-page",
    "x-per-page",
    "x-total-pages",
  ],
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
