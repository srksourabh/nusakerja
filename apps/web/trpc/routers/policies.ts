import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import { can } from "@nusakerja/auth";
import {
  db,
  hrPolicies,
  policyAssignments,
  employees,
  auditLogs,
  assertAssignmentTarget,
  resolvePolicy,
  localDateKey,
  type PolicyKind,
} from "@nusakerja/db";
import { router, protectedProcedure } from "../trpc";

const kindSchema = z.enum(["leave", "hr_general", "pay_structure"]);

function assertHrOps(ctx: {
  user: { role: Parameters<typeof can>[0]["role"]; assignedTenantIds?: string[] };
  tenantId: string | null;
}) {
  const ok = can(
    { role: ctx.user.role, tenantId: ctx.tenantId, assignedTenantIds: ctx.user.assignedTenantIds ?? [] },
    "company.full_ops",
    ctx.tenantId
  );
  if (!ok || !ctx.tenantId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Only HR or Company Admin can manage policies." });
  }
}

async function writeAudit(opts: {
  userId?: string | null;
  tenantId?: string | null;
  action: string;
  resourceId?: string;
  details?: Record<string, unknown>;
}) {
  await db.insert(auditLogs).values({
    userId: opts.userId ?? null,
    tenantId: opts.tenantId ?? null,
    action: opts.action,
    resource: "hr_policy",
    resourceId: opts.resourceId,
    details: opts.details ?? {},
  });
}

export const policiesRouter = router({
  list: protectedProcedure
    .input(z.object({ kind: kindSchema.optional() }).optional())
    .query(async ({ input, ctx }) => {
      assertHrOps(ctx);
      const tenantId = ctx.tenantId!;
      const rows = input?.kind
        ? await db
            .select()
            .from(hrPolicies)
            .where(and(eq(hrPolicies.tenantId, tenantId), eq(hrPolicies.kind, input.kind)))
        : await db.select().from(hrPolicies).where(eq(hrPolicies.tenantId, tenantId));

      const assignments = await db
        .select()
        .from(policyAssignments)
        .where(eq(policyAssignments.tenantId, tenantId));

      return rows.map((p) => ({
        ...p,
        assignments: assignments.filter((a) => a.policyId === p.id),
      }));
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(120),
        kind: kindSchema,
        payload: z.record(z.unknown()),
        effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        effectiveTo: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .nullable()
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      assertHrOps(ctx);
      const [row] = await db
        .insert(hrPolicies)
        .values({
          tenantId: ctx.tenantId!,
          name: input.name,
          kind: input.kind,
          payload: input.payload,
          effectiveFrom: input.effectiveFrom,
          effectiveTo: input.effectiveTo ?? null,
        })
        .returning();

      await writeAudit({
        userId: ctx.user.id,
        tenantId: ctx.tenantId,
        action: "policy.create",
        resourceId: row.id,
        details: { name: row.name, kind: row.kind },
      });

      return row;
    }),

  assign: protectedProcedure
    .input(
      z.object({
        policyId: z.string().uuid(),
        grade: z.number().int().min(1).max(5).nullable(),
        employeeId: z.string().uuid().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      assertHrOps(ctx);
      try {
        assertAssignmentTarget(input.grade, input.employeeId);
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: e instanceof Error ? e.message : "Invalid assignment",
        });
      }

      const [policy] = await db
        .select()
        .from(hrPolicies)
        .where(and(eq(hrPolicies.id, input.policyId), eq(hrPolicies.tenantId, ctx.tenantId!)))
        .limit(1);
      if (!policy) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Policy not found." });
      }

      if (input.employeeId) {
        const [emp] = await db
          .select()
          .from(employees)
          .where(and(eq(employees.id, input.employeeId), eq(employees.tenantId, ctx.tenantId!)))
          .limit(1);
        if (!emp) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Employee not in this company." });
        }
      }

      const [row] = await db
        .insert(policyAssignments)
        .values({
          tenantId: ctx.tenantId!,
          policyId: input.policyId,
          grade: input.grade,
          employeeId: input.employeeId,
        })
        .returning();

      await writeAudit({
        userId: ctx.user.id,
        tenantId: ctx.tenantId,
        action: "policy.assign",
        resourceId: policy.id,
        details: { grade: input.grade, employeeId: input.employeeId },
      });

      return row;
    }),

  removeAssignment: protectedProcedure
    .input(z.object({ assignmentId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      assertHrOps(ctx);
      const [row] = await db
        .delete(policyAssignments)
        .where(
          and(eq(policyAssignments.id, input.assignmentId), eq(policyAssignments.tenantId, ctx.tenantId!))
        )
        .returning();
      if (!row) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Assignment not found." });
      }
      await writeAudit({
        userId: ctx.user.id,
        tenantId: ctx.tenantId,
        action: "policy.unassign",
        resourceId: row.policyId,
        details: { assignmentId: row.id },
      });
      return { success: true };
    }),

  /** Resolve leave / HR / pay policy for an employee (person → grade → tenant). */
  resolve: protectedProcedure
    .input(
      z.object({
        employeeId: z.string().uuid(),
        kind: kindSchema,
        asOf: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
      }
      const canOps = can(
        { role: ctx.user.role, tenantId: ctx.tenantId, assignedTenantIds: ctx.user.assignedTenantIds ?? [] },
        "company.full_ops",
        ctx.tenantId
      );
      const canSelf = can(
        { role: ctx.user.role, tenantId: ctx.tenantId, assignedTenantIds: ctx.user.assignedTenantIds ?? [] },
        "leave.request",
        ctx.tenantId
      );
      if (!canOps && !canSelf) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot resolve policies." });
      }

      const [emp] = await db
        .select()
        .from(employees)
        .where(and(eq(employees.id, input.employeeId), eq(employees.tenantId, ctx.tenantId)))
        .limit(1);
      if (!emp) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Employee not found." });
      }
      if (!canOps && emp.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Can only resolve your own policies." });
      }

      const policies = await db.select().from(hrPolicies).where(eq(hrPolicies.tenantId, ctx.tenantId));
      const assignments = await db
        .select()
        .from(policyAssignments)
        .where(eq(policyAssignments.tenantId, ctx.tenantId));

      const asOf = input.asOf ?? localDateKey(new Date());
      return resolvePolicy({
        policies: policies.map((p) => ({
          id: p.id,
          tenantId: p.tenantId,
          name: p.name,
          kind: p.kind as PolicyKind,
          payload: (p.payload ?? {}) as Record<string, unknown>,
          effectiveFrom: p.effectiveFrom,
          effectiveTo: p.effectiveTo,
        })),
        assignments: assignments.map((a) => ({
          policyId: a.policyId,
          grade: a.grade,
          employeeId: a.employeeId,
        })),
        kind: input.kind,
        employeeId: emp.id,
        grade: emp.grade ?? 1,
        asOf,
      });
    }),
});
