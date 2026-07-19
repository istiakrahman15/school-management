import { defineConfig } from "drizzle-kit";

const isProduction =
  process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: isProduction ? "turso" : "sqlite",
  ...(isProduction
    ? {
        dbCredentials: {
          url: process.env.TURSO_DATABASE_URL!,
          authToken: process.env.TURSO_AUTH_TOKEN!,
        },
      }
    : {
        dbCredentials: {
          url: "local.db",
        },
      }),
  verbose: true,
  strict: true,
});
