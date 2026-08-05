import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, desc } from "drizzle-orm";
import { can } from "@nusakerja/auth";
import { db, attendancePunches } from "@nusakerja/db";
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
    throw new TRPCError({ code: "FORBIDDEN", message: "Anda tidak memiliki hak presensi untuk tindakan ini." });
  }
}

export const attendanceRouter = router({
  punch: protectedProcedure
    .input(
      z.object({
        employeeId: z.string().uuid(),
        punchType: z.enum(["IN", "OUT"]),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        locationName: z.string().optional(),
        isOfflineSync: z.boolean().default(false),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      assertCap(ctx, "attendance.punch_self");
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Tenant tidak dipilih." });
      }

      const [newPunch] = await db
        .insert(attendancePunches)
        .values({
          tenantId: ctx.tenantId,
          employeeId: input.employeeId,
          punchType: input.punchType,
          punchTime: new Date(),
          latitude: input.latitude ? input.latitude.toString() : null,
          longitude: input.longitude ? input.longitude.toString() : null,
          locationName: input.locationName || "Kantor Pusat Jakarta",
          isGeofenced: true,
          isOfflineSync: input.isOfflineSync,
          notes: input.notes || null,
        })
        .returning();

      return {
        success: true,
        punch: newPunch,
        message:
          input.punchType === "IN"
            ? "Presensi Masuk Berhasil Ditentukan (GPS Verified)"
            : "Presensi Keluar Berhasil (GPS Verified)",
      };
    }),

  getEmployeeHistory: protectedProcedure
    .input(z.object({ employeeId: z.string().uuid(), limit: z.number().default(20) }))
    .query(async ({ input, ctx }) => {
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Tenant tidak dipilih." });
      }
      const canCompany = can(
        { role: ctx.user.role, tenantId: ctx.tenantId, assignedTenantIds: ctx.user.assignedTenantIds ?? [] },
        "attendance.view_company",
        ctx.tenantId
      );
      const canSelf = can(
        { role: ctx.user.role, tenantId: ctx.tenantId, assignedTenantIds: ctx.user.assignedTenantIds ?? [] },
        "attendance.punch_self",
        ctx.tenantId
      );
      if (!canCompany && !canSelf) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Tidak dapat melihat riwayat presensi." });
      }

      return await db
        .select()
        .from(attendancePunches)
        .where(
          and(eq(attendancePunches.employeeId, input.employeeId), eq(attendancePunches.tenantId, ctx.tenantId))
        )
        .orderBy(desc(attendancePunches.punchTime))
        .limit(input.limit);
    }),
});
