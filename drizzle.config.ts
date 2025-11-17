import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Use DATABASE_URL_DEV for local development (preview/dev branch)
// Use DATABASE_URL for production (main branch)
// Fallback to DATABASE_URL if DATABASE_URL_DEV is not set
const databaseUrl = process.env.DATABASE_URL_DEV || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL or DATABASE_URL_DEV environment variable is required"
  );
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/server/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
