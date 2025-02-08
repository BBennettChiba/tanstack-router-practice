import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

import env from "../env.ts";
export const { signIn, signOut, useSession } = createAuthClient({
  appName: "Runreal-deno-template",
  plugins: [magicLinkClient()],
  // That's the url of the hono server
  baseURL: env.VITE_APP_API_BASE_URL, // the base url of your auth server
});
