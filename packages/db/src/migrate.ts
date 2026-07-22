import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";

async function runMigrate() {
  console.log("Running Drizzle migrations on Hostinger PostgreSQL...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations applied successfully!");
  process.exit(0);
}

runMigrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
