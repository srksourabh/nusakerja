import { pgTable, uuid, text, timestamp, date } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { employees } from "./employees";

export const documentVault = pgTable("document_vault", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id, { onDelete: "cascade" }).notNull(),
  documentName: text("document_name").notNull(),
  documentType: text("document_type").notNull(), // KTP, NPWP, KITAS, CONTRACT, CERTIFICATE
  fileUrl: text("file_url").notNull(),
  expiryDate: date("expiry_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
