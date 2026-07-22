import { pgTable, uuid, text, timestamp, boolean, decimal, pgEnum } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { employees } from "./employees";

export const punchTypeEnum = pgEnum("punch_type", ["IN", "OUT"]);

export const attendancePunches = pgTable("attendance_punches", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id, { onDelete: "cascade" }).notNull(),
  punchType: punchTypeEnum("punch_type").notNull(),
  punchTime: timestamp("punch_time").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  locationName: text("location_name"),
  isGeofenced: boolean("is_geofenced").default(true).notNull(),
  isOfflineSync: boolean("is_offline_sync").default(false).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
