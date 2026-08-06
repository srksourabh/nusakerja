import { pgTable, uuid, text, timestamp, date, jsonb, integer, pgEnum } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { employees } from "./employees";

export const policyKindEnum = pgEnum("policy_kind", ["leave", "hr_general", "pay_structure"]);

export const hrPolicies = pgTable("hr_policies", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  kind: policyKindEnum("kind").notNull(),
  payload: jsonb("payload").notNull().$type<Record<string, unknown>>(),
  effectiveFrom: date("effective_from").notNull(),
  effectiveTo: date("effective_to"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Exactly one target style per row:
 * - grade set, employee null → grade band
 * - employee set, grade null → person override
 * - both null → tenant default
 */
export const policyAssignments = pgTable("policy_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  policyId: uuid("policy_id")
    .references(() => hrPolicies.id, { onDelete: "cascade" })
    .notNull(),
  grade: integer("grade"),
  employeeId: uuid("employee_id").references(() => employees.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
