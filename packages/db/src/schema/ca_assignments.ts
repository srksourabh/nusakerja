import { pgTable, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { users } from "./users";

/** One CA firm maps to exactly one CA user at launch (R9). */
export const caFirms = pgTable("ca_firms", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Zero or one operating CA per company tenant (R6). */
export const companyCaAssignments = pgTable(
  "company_ca_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .references(() => tenants.id, { onDelete: "cascade" })
      .notNull(),
    caUserId: uuid("ca_user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    assignedBy: uuid("assigned_by").references(() => users.id, { onDelete: "set null" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  },
  (table) => ({
    tenantUnique: uniqueIndex("company_ca_assignments_tenant_uidx").on(table.tenantId),
  })
);

export const invites = pgTable("invites", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  invitedBy: uuid("invited_by").references(() => users.id, { onDelete: "set null" }),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
