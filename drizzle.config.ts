import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Load environment variables from .env.local for local development
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
