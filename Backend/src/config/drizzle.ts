import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  users,
  workers,
  specializations,
  liveLocations,
  jobs,
  transactions,
  reviews,
  notifications,
} from "@/db/schema";

const schema = {
  users,
  workers,
  specializations,
  liveLocations,
  jobs,
  transactions,
  reviews,
  notifications,
};

// Create a new pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
export { pool };
