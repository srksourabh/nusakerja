import { pgTable, uuid, text, timestamp, date, pgEnum, integer } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { employees } from "./employees";

export const leaveTypeEnum = pgEnum("leave_type", [
  "CUTI_TAHUNAN",
  "CUTI_SAKIT",
  "CUTI_MELAHIRKAN",
  "CUTI_KEGUGURAN",
  "CUTI_HAID",
  "CUTI_PENTING",
  "CUTI_UNPAID"
]);

export const leaveStatusEnum = pgEnum("leave_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED"
]);

export const leaveRequests = pgTable("leave_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id, { onDelete: "cascade" }).notNull(),
  leaveType: leaveTypeEnum("leave_type").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  totalDays: integer("total_days").notNull(),
  reason: text("reason"),
  attachmentUrl: text("attachment_url"),
  status: leaveStatusEnum("status").default("PENDING").notNull(),
  approvedBy: uuid("approved_by"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
