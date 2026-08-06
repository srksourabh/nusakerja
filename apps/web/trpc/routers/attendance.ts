import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, desc, gte, lt, inArray } from "drizzle-orm";
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
  collectSubtreeIds,
  toMapPins,
  latestPinPerEmployee,
  type PunchEvent,
  type PunchGeoRow,
  type OrgEmployeeNode,
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

function dayWindow(dayKey: string) {
  const startGuess = new Date(`${dayKey}T00:00:00+07:00`);
  const endGuess = new Date(startGuess.getTime() + 36 * 3600_000);
  return {
    startGuess,
    endGuess,
    rangeStart: new Date(startGuess.getTime() - 12 * 3600_000),
  };
}

async function loadDayPunches(tenantId: string, employeeId: string, dayKey: string): Promise<PunchEvent[]> {
  const { endGuess, rangeStart } = dayWindow(dayKey);
  const rows = await db
    .select()
    .from(attendancePunches)
    .where(
      and(
        eq(attendancePunches.tenantId, tenantId),
        eq(attendancePunches.employeeId, employeeId),
        gte(attendancePunches.punchTime, rangeStart),
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

async function loadDayGeoRows(
  tenantId: string,
  employeeIds: string[],
  dayKey: string
): Promise<PunchGeoRow[]> {
  if (employeeIds.length === 0) return [];
  const { endGuess, rangeStart } = dayWindow(dayKey);
  const rows = await db
    .select({
      id: attendancePunches.id,
      employeeId: attendancePunches.employeeId,
      punchType: attendancePunches.punchType,
      punchTime: attendancePunches.punchTime,
      latitude: attendancePunches.latitude,
      longitude: attendancePunches.longitude,
      locationName: attendancePunches.locationName,
      fullName: employees.fullName,
    })
    .from(attendancePunches)
    .innerJoin(employees, eq(employees.id, attendancePunches.employeeId))
    .where(
      and(
        eq(attendancePunches.tenantId, tenantId),
        inArray(attendancePunches.employeeId, employeeIds),
        gte(attendancePunches.punchTime, rangeStart),
        lt(attendancePunches.punchTime, endGuess)
      )
    )
    .orderBy(attendancePunches.punchTime);

  return rows
    .filter((r) => localDateKey(r.punchTime) === dayKey)
    .map((r) => ({
      id: r.id,
      employeeId: r.employeeId,
      punchType: r.punchType as "IN" | "OUT",
      punchTime: r.punchTime,
      latitude: r.latitude,
      longitude: r.longitude,
      locationName: r.locationName,
      fullName: r.fullName,
    }));
}

function serializePin(pin: ReturnType<typeof toMapPins>[number]) {
  return {
    ...pin,
    punchTime: pin.punchTime.toISOString(),
  };
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

  /** Own geo punches for a Jakarta calendar day (pins without coords omitted). */
  mapPunches: protectedProcedure
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
      const rows = await loadDayGeoRows(ctx.tenantId, [employeeId], dayKey);
      const pins = toMapPins(rows).map(serializePin);
      return { dayKey, employeeId, pins, omittedWithoutCoords: rows.length - pins.length };
    }),

  /**
   * Latest geo pin per teammate for the day.
   * Managers: reporting subtree only. HR/Company Admin: full company.
   */
  teamMapLocations: protectedProcedure
    .input(
      z
        .object({
          dayKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      assertCap(ctx, "attendance.view_company");
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
      }

      const dayKey = input?.dayKey ?? localDateKey(new Date());
      const allRows = await db.select().from(employees).where(eq(employees.tenantId, ctx.tenantId));
      const nodes: OrgEmployeeNode[] = allRows.map((r) => ({
        id: r.id,
        fullName: r.fullName,
        employeeCode: r.employeeCode,
        grade: r.grade ?? 1,
        managerEmployeeId: r.managerEmployeeId ?? null,
      }));

      let allowed: Set<string>;
      if (ctx.user.role === "manager") {
        const self = allRows.find((r) => r.userId === ctx.user.id);
        if (!self) {
          return { dayKey, pins: [], team: [] as OrgEmployeeNode[], scope: "subtree" as const };
        }
        allowed = collectSubtreeIds(nodes, self.id);
      } else {
        allowed = new Set(allRows.map((r) => r.id));
      }

      const geoRows = await loadDayGeoRows(ctx.tenantId, [...allowed], dayKey);
      const pins = latestPinPerEmployee(geoRows, allowed).map(serializePin);
      const team = nodes.filter((n) => allowed.has(n.id));

      return {
        dayKey,
        pins,
        team,
        scope: ctx.user.role === "manager" ? ("subtree" as const) : ("company" as const),
      };
    }),
});
