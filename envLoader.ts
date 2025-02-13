import { type } from "arktype";

const isServer = typeof Deno !== "undefined" && !!Deno.env;

const backendSchema = type({
  PORT: "string.integer",
  DATABASE_URL: "string.url",
  BETTER_AUTH_SECRET: "string",
}).pipe((t) => ({ ...t, PORT: Number(t.PORT) }));

const frontendSchema = type({
  VITE_APP_API_BASE_URL: "string.url",
});

type BackendEnv = typeof backendSchema.infer;
type FrontendEnv = typeof frontendSchema.infer;
type EnvSchema = BackendEnv & FrontendEnv;
type Keys = keyof EnvSchema;

// @ts-ignore deno doesn't support import.meta
const envData = isServer ? Deno.env.toObject() : import.meta.env;

const parsedEnv = isServer ? backendSchema(envData) : frontendSchema(envData);

const envIsBackend = (_env: unknown): _env is BackendEnv => isServer;

export default function loadEnv<K extends Keys>(keys: readonly K[]) {
  if (parsedEnv instanceof type.errors) {
    console.error(parsedEnv.summary);
    throw new Error(parsedEnv.summary);
  }
  if (envIsBackend(parsedEnv)) {
    return Object.fromEntries(
      keys.map((key) => [key, parsedEnv[key as keyof BackendEnv]]),
    ) as {
      [P in K]: EnvSchema[P];
    };
  } else {
    return Object.fromEntries(
      keys.map((key) => [key, parsedEnv[key as keyof FrontendEnv]]),
    ) as {
      [P in K]: EnvSchema[P];
    };
  }
}
