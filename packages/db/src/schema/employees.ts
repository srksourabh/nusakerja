import { pgTable, uuid, text, timestamp, date, pgEnum, decimal, integer, type AnyPgColumn } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { users } from "./users";

export const ptkpStatusEnum = pgEnum("ptkp_status", [
  "TK_0", "TK_1", "TK_2", "TK_3",
  "K_0", "K_1", "K_2", "K_3",
  "K_I_0", "K_I_1", "K_I_2", "K_I_3"
]);

export const workerCategoryEnum = pgEnum("worker_category", [
  "PKWTT", "PKWT", "FREELANCE", "COMMISSIONER", "TKA"
]);

/** Grade 1 (lowest) … 5 (highest) — drives leave/HR/pay policy assignment. */
export const employees = pgTable("employees", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  employeeCode: text("employee_code").notNull(),
  fullName: text("full_name").notNull(),
  nikKtp: text("nik_ktp").notNull(),
  npwp: text("npwp"),
  bpjsKetenagakerjaanNo: text("bpjs_tk_no"),
  bpjsKesehatanNo: text("bpjs_ks_no"),
  ptkpStatus: ptkpStatusEnum("ptkp_status").default("TK_0").notNull(),
  workerCategory: workerCategoryEnum("worker_category").default("PKWTT").notNull(),
  joinDate: date("join_date").notNull(),
  basicSalaryIdr: decimal("basic_salary_idr", { precision: 15, scale: 2 }).notNull(),
  grade: integer("grade").default(1).notNull(),
  managerEmployeeId: uuid("manager_employee_id").references((): AnyPgColumn => employees.id, {
    onDelete: "set null",
  }),
  kitasExpiryDate: date("kitas_expiry_date"),
  rptkaRef: text("rptka_ref"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
