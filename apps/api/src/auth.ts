import { betterAuth } from "better-auth";
import { magicLink, openAPI } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import env from "./env.ts";

import { db, schema } from "./db.ts";

export const auth = betterAuth({
  // Fix the baseURL to the auth server
  baseURL: `http://localhost:${env.PORT}`,
  appName: "Runreal-deno-template",
  // I really need this
  trustedOrigins: ["http://localhost:5173"],
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
    usePlural: true,
  }),
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
  plugins: [
    openAPI(),
    magicLink({
      sendMagicLink: ({ email, token, url }) => {
        console.log(`sending email ${email}, token ${token}, url ${url}`);
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
