import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import { db, leaveRequests } from "@nusakerja/db";
import { eq, and } from "drizzle-orm";

export const leaveRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select()
      .from(leaveRequests)
      .where(ctx.tenantId ? eq(leaveRequests.tenantId, ctx.tenantId) : undefined);
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
          "CUTI_UNPAID"
        ]),
        startDate: z.string(),
        endDate: z.string(),
        totalDays: z.number().int().positive(),
        reason: z.string().optional(),
        attachmentUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [newRequest] = await db
        .insert(leaveRequests)
        .values({
          tenantId: ctx.tenantId || "00000000-0000-0000-0000-000000000000",
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

  approveLeave: adminProcedure
    .input(z.object({ requestId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
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
