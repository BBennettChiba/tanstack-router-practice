import { initTRPC, TRPCError } from "@trpc/server";
import { type } from "arktype";
import { Hono } from "hono";
import { cors } from "npm:hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { db, type InsertUser, schema } from "./db.ts";
import { auth, type Session } from "./auth.ts";
import { createDummyUser } from "./index.ts";
import { users } from "./schema/users.ts";

const trpcApp = new Hono();

trpcApp.use(
  "/trpc/*",
  cors({
    origin: "http://localhost:5173", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);
interface Context {
  session?: Session;
}

type User = typeof users.$inferInsert;

const userSchema = type({
  name: "string",
  email: "string.email",
  emailVerified: "boolean",
  "image?": "null | string",
  "role?": "string",
}).as<User>();

const t = initTRPC.context<Context>().create();

const protectedProcedure = t.procedure.use(function isAuth(opts) {
  const { ctx } = opts;
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next(opts);
});

const publicProcedure = t.procedure;
const router = t.router;

export const appRouter = router({
  hello: publicProcedure
    .input(type("string | undefined").assert)
    .query(({ input }) => {
      return `Hello ${input ?? "World"}!`;
    }),

  getUsers: protectedProcedure.query(async () => {
    return await db.select().from(schema.users);
  }),
  createUser: protectedProcedure
    .input(userSchema.assert)
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      console.log(ctx);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return input;
    }),
});

trpcApp.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: async (_, c) => {
      const session = await auth.api.getSession({
        headers: c.req.raw.headers,
      });
      return {
        session: session,
      };
    },
  }),
);

export { trpcApp };
export type AppRouter = typeof appRouter;
