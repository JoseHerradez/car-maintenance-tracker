import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";

// Initialize the database connection with the schema
export const db = drizzle(sql, { schema });
