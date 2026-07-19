import { createClient } from "@libsql/client";
import { drizzle as drizzleTurso } from "drizzle-orm/libsql";
import { drizzle as drizzleSQLite } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

function createDb() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  // Use Turso in production if credentials are provided
  if (tursoUrl && tursoToken) {
    const client = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });
    return drizzleTurso(client, { schema });
  }

  // Fall back to local SQLite for development
  const sqlite = new Database(
    process.env.DATABASE_URL?.replace("file:", "") ?? "local.db"
  );
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return drizzleSQLite(sqlite, { schema });
}

// Singleton pattern for Next.js hot-reload
declare global {
  // eslint-disable-next-line no-var
  var __db: ReturnType<typeof createDb> | undefined;
}

export const db = globalThis.__db ?? createDb();
if (process.env.NODE_ENV !== "production") {
  globalThis.__db = db;
}
