import { pgTable, uuid, text, timestamp, pgEnum, decimal } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { employees } from "./employees";
import { users } from "./users";

export const expenseCategoryEnum = pgEnum("expense_category", [
  "TRAVEL",
  "MEAL",
  "MEDICAL",
  "OTHER",
]);

export const expenseStatusEnum = pgEnum("expense_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]);

export const expenseClaims = pgTable("expense_claims", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  employeeId: uuid("employee_id")
    .references(() => employees.id, { onDelete: "cascade" })
    .notNull(),
  amountIdr: decimal("amount_idr", { precision: 15, scale: 2 }).notNull(),
  category: expenseCategoryEnum("category").notNull(),
  description: text("description").notNull(),
  receiptUrl: text("receipt_url"),
  status: expenseStatusEnum("status").default("PENDING").notNull(),
  /** Immediate boss (or HR fallback) who must decide. */
  approverEmployeeId: uuid("approver_employee_id").references(() => employees.id, {
    onDelete: "set null",
  }),
  approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
  approvedAt: timestamp("approved_at"),
  decisionNote: text("decision_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const notificationTypeEnum = pgEnum("notification_type", [
  "LEAVE_SUBMITTED",
  "LEAVE_DECIDED",
  "EXPENSE_SUBMITTED",
  "EXPENSE_DECIDED",
]);

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  resource: text("resource").notNull(),
  resourceId: uuid("resource_id"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
