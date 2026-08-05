import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { can } from "@nusakerja/auth";
import { db, leaveRequests } from "@nusakerja/db";
import { router, protectedProcedure } from "../trpc";

function assertCap(
  ctx: { user: { role: Parameters<typeof can>[0]["role"]; assignedTenantIds?: string[] }; tenantId: string | null },
  capability: Parameters<typeof can>[1]
) {
  const ok = can(
    { role: ctx.user.role, tenantId: ctx.tenantId, assignedTenantIds: ctx.user.assignedTenantIds ?? [] },
    capability,
    ctx.tenantId
  );
  if (!ok) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Anda tidak memiliki hak cuti untuk tindakan ini." });
  }
}

export const leaveRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Tenant tidak dipilih." });
    }
    if (ctx.user.role === "super_admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "SuperAdmin tidak mengakses data cuti perusahaan." });
    }
    return await db.select().from(leaveRequests).where(eq(leaveRequests.tenantId, ctx.tenantId));
  }),

  requestLeave: protectedProcedure
    .input(
      z.object({
        employeeId: z.string().uuid(),
        leaveType: z.enum([
          "CUTI_TAHUNAN",
          "CUTI_SAKIT",
          "CUTI_MELAHIRKAN",
          "CUTI_KEGUGURAN",
          "CUTI_HAID",
          "CUTI_PENTING",
          "CUTI_UNPAID",
        ]),
        startDate: z.string(),
        endDate: z.string(),
        totalDays: z.number().int().positive(),
        reason: z.string().optional(),
        attachmentUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      assertCap(ctx, "leave.request");
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Tenant tidak dipilih." });
      }

      const [newRequest] = await db
        .insert(leaveRequests)
        .values({
          tenantId: ctx.tenantId,
          employeeId: input.employeeId,
          leaveType: input.leaveType,
          startDate: input.startDate,
          endDate: input.endDate,
          totalDays: input.totalDays,
          reason: input.reason || null,
          attachmentUrl: input.attachmentUrl || null,
          status: "PENDING",
        })
        .returning();

      return newRequest;
    }),

  approveLeave: protectedProcedure
    .input(z.object({ requestId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      assertCap(ctx, "leave.approve");
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Tenant tidak dipilih." });
      }

      const [existing] = await db
        .select()
        .from(leaveRequests)
        .where(eq(leaveRequests.id, input.requestId))
        .limit(1);
      if (!existing || existing.tenantId !== ctx.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Permohonan cuti tidak ditemukan." });
      }

      const [updated] = await db
        .update(leaveRequests)
        .set({
          status: "APPROVED",
          approvedBy: ctx.user.id,
          approvedAt: new Date(),
        })
        .where(eq(leaveRequests.id, input.requestId))
        .returning();

      return updated;
    }),
});
