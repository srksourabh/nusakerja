import { pgTable, uuid, text, timestamp, date, jsonb } from "drizzle-orm/pg-core";

export const statutoryParameters = pgTable("statutory_parameters", {
  id: uuid("id").defaultRandom().primaryKey(),
  parameterKey: text("parameter_key").notNull().unique(), // e.g. BPJS_JP_CAP, TER_TABLE_A, PTKP_THRESHOLDS
  description: text("description"),
  effectiveFrom: date("effective_from").notNull(),
  effectiveTo: date("effective_to"),
  parameterValue: jsonb("parameter_value").notNull(),
  sourceNote: text("source_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
