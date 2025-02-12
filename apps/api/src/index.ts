import { Hono } from "hono";
import { cors } from "npm:hono/cors";
import { db, schema } from "./db.ts";
import type { InsertUser } from "./db.ts";
import { trpcApp } from "./router.ts";
import { auth } from "./auth.ts";
import env from "./env.ts";

const app = new Hono();

export async function createDummyUser(data: InsertUser) {
  await db.insert(schema.users).values(data);
}

app.use(
  "/api/auth/**", // or replace with "*" to enable cors for all routes
  // "*",
  cors({
    origin: "http://localhost:5173", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

app.route("/", trpcApp);

console.log(`Server is running on http://localhost:${env.PORT}`);
console.log(`Database URL: ${env.DATABASE_URL}`);

Deno.serve({ port: env.PORT }, app.fetch);
