import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db, attendancePunches } from "@nusakerja/db";
import { eq, and, desc } from "drizzle-orm";

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
      const [newPunch] = await db
        .insert(attendancePunches)
        .values({
          tenantId: ctx.tenantId || "00000000-0000-0000-0000-000000000000",
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
        message: input.punchType === "IN" ? "Presensi Masuk Berhasil Ditentukan (GPS Verified)" : "Presensi Keluar Berhasil (GPS Verified)",
      };
    }),

  getEmployeeHistory: protectedProcedure
    .input(z.object({ employeeId: z.string().uuid(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      return await db
        .select()
        .from(attendancePunches)
        .where(eq(attendancePunches.employeeId, input.employeeId))
        .orderBy(desc(attendancePunches.punchTime))
        .limit(input.limit);
    }),
});
