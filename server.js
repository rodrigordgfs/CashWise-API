import fastify from "fastify";
import cors from "@fastify/cors";
import { createRequire } from "node:module";
import routes from "./src/routes/index.js";
import environment from "./src/config/envs.js";

const require = createRequire(import.meta.url);
const { clerkPlugin } = require("@clerk/fastify");

const app = fastify({
  pluginTimeout: 60_000,
  bodyLimit: 10 * 1024 * 1024,
});

/* ----- CORS ----- */
app.register(cors, {
  origin: (origin, cb) => {
    const allow = [
      "https://appcashwise.com.br",
      "https://www.appcashwise.com.br",
      "https://cashwiseapi-hav8m.kinsta.app",
      "https://www.cashwiseapi-hav8m.kinsta.app",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ];
    if (!origin || allow.includes(origin)) cb(null, true);
    else cb(new Error("Not allowed by CORS"), false);
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

/* ----- Auth (Clerk) ----- */
app.register(clerkPlugin, {
  secretKey: environment.secretKey,
  publishableKey: environment.publishableKey,
});

/* ----- Custom plugins ----- */
await app.register(import("./src/plugins/userId.js"));
await app.register(import("./src/plugins/zodValidate.js"));

/* ----- Rotas ----- */
await app.register(routes);

/* ----- Start ----- */
app
  .listen({ port: environment.port ?? 8080, host: "0.0.0.0" })
  .then(() =>
    console.log(`🚀  Server rodando na porta ${environment.port ?? 8080}`),
  )
  .catch((err) => {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  });