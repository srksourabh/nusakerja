import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, desc, gte, lt } from "drizzle-orm";
import { can } from "@nusakerja/auth";
import {
  db,
  attendancePunches,
  employees,
  assertNextPunchAllowed,
  computeDayPunchStatus,
  filterPunchesForLocalDay,
  formatDuration,
  localDateKey,
  type PunchEvent,
} from "@nusakerja/db";
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
    throw new TRPCError({ code: "FORBIDDEN", message: "You do not have attendance permission for this action." });
  }
}

async function resolveEmployeeId(
  ctx: { user: { id: string }; tenantId: string | null },
  employeeId?: string
): Promise<string> {
  if (employeeId) return employeeId;
  if (!ctx.tenantId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
  }
  const [row] = await db
    .select({ id: employees.id })
    .from(employees)
    .where(and(eq(employees.tenantId, ctx.tenantId), eq(employees.userId, ctx.user.id)))
    .limit(1);
  if (!row) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No employee profile linked to this login. Ask HR to link your user.",
    });
  }
  return row.id;
}

async function loadDayPunches(tenantId: string, employeeId: string, dayKey: string): Promise<PunchEvent[]> {
  // Wide UTC window covering Asia/Jakarta day, then filter by local key
  const startGuess = new Date(`${dayKey}T00:00:00+07:00`);
  const endGuess = new Date(startGuess.getTime() + 36 * 3600_000);
  const rows = await db
    .select()
    .from(attendancePunches)
    .where(
      and(
        eq(attendancePunches.tenantId, tenantId),
        eq(attendancePunches.employeeId, employeeId),
        gte(attendancePunches.punchTime, new Date(startGuess.getTime() - 12 * 3600_000)),
        lt(attendancePunches.punchTime, endGuess)
      )
    )
    .orderBy(attendancePunches.punchTime);

  return filterPunchesForLocalDay(
    rows.map((r) => ({
      punchType: r.punchType as "IN" | "OUT",
      punchTime: r.punchTime,
    })),
    dayKey
  );
}

export const attendanceRouter = router({
  todayStatus: protectedProcedure
    .input(
      z
        .object({
          employeeId: z.string().uuid().optional(),
          dayKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      assertCap(ctx, "attendance.punch_self");
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
      }
      const employeeId = await resolveEmployeeId(ctx, input?.employeeId);
      const dayKey = input?.dayKey ?? localDateKey(new Date());
      const punches = await loadDayPunches(ctx.tenantId, employeeId, dayKey);
      const now = new Date();
      const status = computeDayPunchStatus(punches, now);
      return {
        employeeId,
        dayKey,
        ...status,
        totalClosedLabel: formatDuration(status.totalSecondsClosed),
        liveLabel: formatDuration(status.liveElapsedSeconds),
        workedIncludingLiveLabel: formatDuration(status.totalSecondsClosed + status.liveElapsedSeconds),
        punchCount: punches.length,
      };
    }),

  punch: protectedProcedure
    .input(
      z.object({
        employeeId: z.string().uuid().optional(),
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
        throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
      }

      const employeeId = await resolveEmployeeId(ctx, input.employeeId);
      const now = new Date();
      const dayKey = localDateKey(now);
      const dayPunches = await loadDayPunches(ctx.tenantId, employeeId, dayKey);
      try {
        assertNextPunchAllowed(dayPunches, input.punchType, now);
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: e instanceof Error ? e.message : "Invalid punch sequence",
        });
      }

      const [newPunch] = await db
        .insert(attendancePunches)
        .values({
          tenantId: ctx.tenantId,
          employeeId,
          punchType: input.punchType,
          punchTime: now,
          latitude: input.latitude != null ? input.latitude.toString() : null,
          longitude: input.longitude != null ? input.longitude.toString() : null,
          locationName: input.locationName || "Office",
          isGeofenced: true,
          isOfflineSync: input.isOfflineSync,
          notes: input.notes || null,
        })
        .returning();

      const after = computeDayPunchStatus(
        [...dayPunches, { punchType: input.punchType, punchTime: now }],
        now
      );

      return {
        success: true,
        punch: newPunch,
        dayKey,
        status: after,
        totalClosedLabel: formatDuration(after.totalSecondsClosed),
        message:
          input.punchType === "IN"
            ? "Punch IN recorded. Timer started."
            : "Punch OUT recorded. Segment closed and added to today's hours.",
      };
    }),

  getEmployeeHistory: protectedProcedure
    .input(z.object({ employeeId: z.string().uuid().optional(), limit: z.number().default(40) }))
    .query(async ({ input, ctx }) => {
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
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
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot view attendance history." });
      }

      const employeeId = await resolveEmployeeId(ctx, input.employeeId);

      return await db
        .select()
        .from(attendancePunches)
        .where(and(eq(attendancePunches.employeeId, employeeId), eq(attendancePunches.tenantId, ctx.tenantId)))
        .orderBy(desc(attendancePunches.punchTime))
        .limit(input.limit);
    }),
});
