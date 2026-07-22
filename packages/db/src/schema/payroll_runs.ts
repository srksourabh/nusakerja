import { pgTable, uuid, text, timestamp, integer, pgEnum, decimal } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { users } from "./users";

export const payrollStatusEnum = pgEnum("payroll_status", [
  "DRAFT", "CALCULATED", "REVIEWED", "APPROVED", "DISBURSED", "CANCELLED"
]);

export const payrollRuns = pgTable("payroll_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  status: payrollStatusEnum("status").default("DRAFT").notNull(),
  totalGrossSalaryIdr: decimal("total_gross_salary_idr", { precision: 18, scale: 2 }).default("0").notNull(),
  totalPph21TaxIdr: decimal("total_pph21_tax_idr", { precision: 18, scale: 2 }).default("0").notNull(),
  totalBpjsEmployerIdr: decimal("total_bpjs_employer_idr", { precision: 18, scale: 2 }).default("0").notNull(),
  totalBpjsEmployeeIdr: decimal("total_bpjs_employee_idr", { precision: 18, scale: 2 }).default("0").notNull(),
  totalNetPayoutIdr: decimal("total_net_payout_idr", { precision: 18, scale: 2 }).default("0").notNull(),
  approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
