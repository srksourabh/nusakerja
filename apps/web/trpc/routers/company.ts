import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import { randomBytes } from "crypto";
import { hashPassword, can } from "@nusakerja/auth";
import { db, users, auditLogs } from "@nusakerja/db";
import { protectedProcedure, router } from "../trpc";

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

export const companyRouter = router({
  listTeam: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Tidak ada konteks perusahaan." });
    }
    const allowed =
      ctx.user.role === "client_admin" ||
      ctx.user.role === "hr_admin" ||
      ctx.user.role === "super_admin";
    if (!allowed) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Anda tidak dapat melihat tim peran." });
    }
    return db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      })
      .from(users)
      .where(eq(users.tenantId, ctx.tenantId));
  }),

  /** Only Company Admin may mint / change HR seats (R11). */
  appointHr: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(2),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (
        !can(
          {
            role: ctx.user.role,
            tenantId: ctx.tenantId,
            assignedTenantIds: ctx.user.assignedTenantIds ?? [],
          },
          "hr.appoint"
        )
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Hanya Company Admin yang dapat mengangkat HR.",
        });
      }
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Tidak ada konteks perusahaan." });
      }

      const [existing] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (existing) {
        if (existing.tenantId && existing.tenantId !== ctx.tenantId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email sudah terdaftar di perusahaan lain.",
          });
        }
        const [updated] = await db
          .update(users)
          .set({ role: "hr_admin", name: input.name, updatedAt: new Date() })
          .where(and(eq(users.id, existing.id), eq(users.tenantId, ctx.tenantId)))
          .returning();
        await writeAudit({
          userId: ctx.user.id,
          tenantId: ctx.tenantId,
          action: "hr.appoint",
          resource: "user",
          resourceId: updated.id,
          details: { email: input.email, mode: "promote" },
        });
        return { user: updated, provisionalPassword: undefined as string | undefined };
      }

      const tempPassword = `Hr!${randomBytes(4).toString("hex")}`;
      const [created] = await db
        .insert(users)
        .values({
          email: input.email,
          name: input.name,
          role: "hr_admin",
          tenantId: ctx.tenantId,
          passwordHash: hashPassword(tempPassword),
          locale: "id-ID",
        })
        .returning();

      await writeAudit({
        userId: ctx.user.id,
        tenantId: ctx.tenantId,
        action: "hr.appoint",
        resource: "user",
        resourceId: created.id,
        details: { email: input.email, mode: "create" },
      });

      return { user: created, provisionalPassword: tempPassword };
    }),

  addCompanyAdmin: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(2),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "client_admin" || !ctx.tenantId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Hanya Company Admin yang dapat menambah peer Company Admin.",
        });
      }
      const [existing] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (existing) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Email sudah terdaftar." });
      }
      const tempPassword = `Admin!${randomBytes(4).toString("hex")}`;
      const [created] = await db
        .insert(users)
        .values({
          email: input.email,
          name: input.name,
          role: "client_admin",
          tenantId: ctx.tenantId,
          passwordHash: hashPassword(tempPassword),
          locale: "id-ID",
        })
        .returning();
      await writeAudit({
        userId: ctx.user.id,
        tenantId: ctx.tenantId,
        action: "company_admin.add",
        resource: "user",
        resourceId: created.id,
        details: { email: input.email },
      });
      return { user: created, provisionalPassword: tempPassword };
    }),
});
