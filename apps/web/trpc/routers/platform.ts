import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { hashPassword } from "@nusakerja/auth";
import {
  db,
  tenants,
  users,
  companyCaAssignments,
  caFirms,
  invites,
  auditLogs,
} from "@nusakerja/db";
import { platformProcedure, publicProcedure, router } from "../trpc";
import {
  buildCompanyPath,
  buildCompanyUrl,
  isReservedTenantSlug,
} from "../../src/utils/tenant-url";

async function writeAudit(opts: {
  userId?: string | null;
  tenantId?: string | null;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
}) {
  await db.insert(auditLogs).values({
    userId: opts.userId ?? null,
    tenantId: opts.tenantId ?? null,
    action: opts.action,
    resource: opts.resource,
    resourceId: opts.resourceId,
    details: opts.details ?? {},
  });
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export const platformRouter = router({
  /** Public: resolve company portal by slug (name only — no PII). */
  resolveBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(2).max(48) }))
    .query(async ({ input }) => {
      const slug = input.slug.toLowerCase();
      if (isReservedTenantSlug(slug)) return null;
      const [row] = await db
        .select({
          id: tenants.id,
          name: tenants.name,
          slug: tenants.slug,
          isActive: tenants.isActive,
        })
        .from(tenants)
        .where(eq(tenants.slug, slug))
        .limit(1);
      if (!row || !row.isActive) return null;
      return {
        ...row,
        companyUrl: buildCompanyUrl(row.slug),
        companyPath: buildCompanyPath(row.slug),
      };
    }),

  listTenants: platformProcedure.query(async () => {
    const rows = await db
      .select({
        id: tenants.id,
        name: tenants.name,
        slug: tenants.slug,
        isActive: tenants.isActive,
        createdAt: tenants.createdAt,
      })
      .from(tenants);
    return rows.map((t) => ({
      ...t,
      companyUrl: buildCompanyUrl(t.slug),
      companyPath: buildCompanyPath(t.slug),
    }));
  }),

  createTenant: platformProcedure
    .input(
      z.object({
        name: z.string().min(2),
        slug: z
          .string()
          .min(2)
          .max(48)
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: huruf kecil, angka, dan tanda hubung")
          .optional(),
        companyAdminEmail: z.string().email(),
        companyAdminName: z.string().min(2).default("Company Admin"),
        caUserId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const slug = (input.slug || slugify(input.name)).toLowerCase();
      if (isReservedTenantSlug(slug)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Slug "${slug}" cadangan sistem. Pilih nama URL lain.`,
        });
      }
      const [existing] = await db.select({ id: tenants.id }).from(tenants).where(eq(tenants.slug, slug)).limit(1);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `URL ${buildCompanyUrl(slug)} sudah dipakai. Ganti slug.`,
        });
      }

      const schema_name = `tenant_${slug.replace(/-/g, "_")}`;

      const [tenant] = await db
        .insert(tenants)
        .values({
          name: input.name,
          slug,
          schema_name,
          isActive: true,
        })
        .returning();

      const token = randomBytes(24).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await db.insert(invites).values({
        email: input.companyAdminEmail,
        role: "client_admin",
        tenantId: tenant.id,
        token,
        invitedBy: ctx.user.id,
        expiresAt,
      });

      // Provision first Company Admin so demo/real login works without email provider
      const tempPassword = `Welcome!${randomBytes(4).toString("hex")}`;
      const [admin] = await db
        .insert(users)
        .values({
          email: input.companyAdminEmail,
          name: input.companyAdminName,
          role: "client_admin",
          tenantId: tenant.id,
          passwordHash: hashPassword(tempPassword),
          locale: "id-ID",
        })
        .onConflictDoNothing()
        .returning();

      if (input.caUserId) {
        await db.insert(companyCaAssignments).values({
          tenantId: tenant.id,
          caUserId: input.caUserId,
          assignedBy: ctx.user.id,
        });
      }

      const companyUrl = buildCompanyUrl(slug);
      const companyPath = buildCompanyPath(slug);

      await writeAudit({
        userId: ctx.user.id,
        tenantId: tenant.id,
        action: "tenant.create",
        resource: "tenant",
        resourceId: tenant.id,
        details: { companyAdminEmail: input.companyAdminEmail, companyUrl },
      });

      return {
        tenant,
        companyUrl,
        companyPath,
        inviteToken: token,
        inviteExpiresAt: expiresAt,
        provisionalPassword: admin ? tempPassword : undefined,
        inviteAcceptPath: `/invite/${token}`,
      };
    }),

  suspendTenant: platformProcedure
    .input(z.object({ tenantId: z.string().uuid(), isActive: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const [row] = await db
        .update(tenants)
        .set({ isActive: input.isActive, updatedAt: new Date() })
        .where(eq(tenants.id, input.tenantId))
        .returning();
      await writeAudit({
        userId: ctx.user.id,
        tenantId: input.tenantId,
        action: input.isActive ? "tenant.reactivate" : "tenant.suspend",
        resource: "tenant",
        resourceId: input.tenantId,
      });
      return row;
    }),

  assignCa: platformProcedure
    .input(z.object({ tenantId: z.string().uuid(), caUserId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const [ca] = await db.select().from(users).where(eq(users.id, input.caUserId)).limit(1);
      if (!ca || ca.role !== "reseller_admin") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Pengguna bukan akun CA." });
      }
      await db.delete(companyCaAssignments).where(eq(companyCaAssignments.tenantId, input.tenantId));
      const [assignment] = await db
        .insert(companyCaAssignments)
        .values({
          tenantId: input.tenantId,
          caUserId: input.caUserId,
          assignedBy: ctx.user.id,
        })
        .returning();
      await writeAudit({
        userId: ctx.user.id,
        tenantId: input.tenantId,
        action: "ca.assign",
        resource: "company_ca_assignment",
        resourceId: assignment.id,
        details: { caUserId: input.caUserId },
      });
      return assignment;
    }),

  clearCa: platformProcedure
    .input(z.object({ tenantId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      await db.delete(companyCaAssignments).where(eq(companyCaAssignments.tenantId, input.tenantId));
      await writeAudit({
        userId: ctx.user.id,
        tenantId: input.tenantId,
        action: "ca.clear",
        resource: "company_ca_assignment",
        resourceId: input.tenantId,
      });
      return { ok: true };
    }),

  hierarchy: platformProcedure
    .input(z.object({ tenantId: z.string().uuid() }))
    .query(async ({ input }) => {
      const members = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          role: users.role,
        })
        .from(users)
        .where(eq(users.tenantId, input.tenantId));

      const [assignment] = await db
        .select({
          caUserId: companyCaAssignments.caUserId,
          assignedAt: companyCaAssignments.assignedAt,
        })
        .from(companyCaAssignments)
        .where(eq(companyCaAssignments.tenantId, input.tenantId))
        .limit(1);

      // Control plane only — no salary / NIK / NPWP / payslip fields
      return {
        members,
        caAssignment: assignment ?? null,
      };
    }),

  listCaUsers: platformProcedure.query(async () => {
    return db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .where(eq(users.role, "reseller_admin"));
  }),

  ensureCaFirm: platformProcedure
    .input(z.object({ email: z.string().email(), name: z.string(), firmName: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const existing = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      let user = existing[0];
      const password = `Ca!${randomBytes(4).toString("hex")}`;
      if (!user) {
        const [created] = await db
          .insert(users)
          .values({
            email: input.email,
            name: input.name,
            role: "reseller_admin",
            passwordHash: hashPassword(password),
            locale: "id-ID",
          })
          .returning();
        user = created;
      }
      const [firm] = await db
        .insert(caFirms)
        .values({ name: input.firmName, userId: user.id })
        .onConflictDoNothing()
        .returning();
      await writeAudit({
        userId: ctx.user.id,
        action: "ca.firm.ensure",
        resource: "ca_firm",
        resourceId: firm?.id ?? user.id,
      });
      return { userId: user.id, email: user.email, provisionalPassword: existing[0] ? undefined : password };
    }),
});
