import loadEnv from "../../../envLoader.ts";

const env = loadEnv(["DATABASE_URL", "PORT", "BETTER_AUTH_SECRET"]);

export default env;
