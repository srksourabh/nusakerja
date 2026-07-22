import { pgTable, uuid, text, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { payrollRuns } from "./payroll_runs";
import { employees } from "./employees";

export const payrollItems = pgTable("payroll_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  payrollRunId: uuid("payroll_run_id").references(() => payrollRuns.id, { onDelete: "cascade" }).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id, { onDelete: "cascade" }).notNull(),
  basicSalaryIdr: decimal("basic_salary_idr", { precision: 15, scale: 2 }).notNull(),
  fixedAllowancesIdr: decimal("fixed_allowances_idr", { precision: 15, scale: 2 }).default("0").notNull(),
  variableAllowancesIdr: decimal("variable_allowances_idr", { precision: 15, scale: 2 }).default("0").notNull(),
  overtimePayIdr: decimal("overtime_pay_idr", { precision: 15, scale: 2 }).default("0").notNull(),
  thrPayIdr: decimal("thr_pay_idr", { precision: 15, scale: 2 }).default("0").notNull(),
  grossSalaryIdr: decimal("gross_salary_idr", { precision: 15, scale: 2 }).notNull(),
  
  // BPJS Deductions & Cost
  bpjsJhtEmployeeIdr: decimal("bpjs_jht_employee_idr", { precision: 15, scale: 2 }).default("0").notNull(),
  bpjsJpEmployeeIdr: decimal("bpjs_jp_employee_idr", { precision: 15, scale: 2 }).default("0").notNull(),
  bpjsKsEmployeeIdr: decimal("bpjs_ks_employee_idr", { precision: 15, scale: 2 }).default("0").notNull(),
  
  bpjsJhtEmployerIdr: decimal("bpjs_jht_employer_idr", { precision: 15, scale: 2 }).default("0").notNull(),
  bpjsJpEmployerIdr: decimal("bpjs_jp_employer_idr", { precision: 15, scale: 2 }).default("0").notNull(),
  bpjsJkkEmployerIdr: decimal("bpjs_jkk_employer_idr", { precision: 15, scale: 2 }).default("0").notNull(),
  bpjsJkmEmployerIdr: decimal("bpjs_jkm_employer_idr", { precision: 15, scale: 2 }).default("0").notNull(),
  bpjsJkpEmployerIdr: decimal("bpjs_jkp_employer_idr", { precision: 15, scale: 2 }).default("0").notNull(),
  bpjsKsEmployerIdr: decimal("bpjs_ks_employer_idr", { precision: 15, scale: 2 }).default("0").notNull(),
  
  // PPh 21 Tax
  terCategory: text("ter_category"), // A, B, C
  terRatePercent: decimal("ter_rate_percent", { precision: 5, scale: 2 }),
  pph21TaxIdr: decimal("pph21_tax_idr", { precision: 15, scale: 2 }).notNull(),
  hasNpwpSurcharge: text("has_npwp_surcharge").default("false").notNull(),

  netSalaryIdr: decimal("net_salary_idr", { precision: 15, scale: 2 }).notNull(),
  calculationDrilldown: jsonb("calculation_drilldown").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
