import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { can } from "@nusakerja/auth";
import {
  db,
  payrollRuns,
  payrollItems,
  employees,
  auditLogs,
  hrPolicies,
  policyAssignments,
  resolvePolicy,
  localDateKey,
  type PolicyKind,
} from "@nusakerja/db";
import {
  calculateThr,
  computeStatutoryPayrollLine,
  parsePayStructureCompensation,
} from "@nusakerja/config";
import { router, protectedProcedure } from "../trpc";

function assertCap(
  ctx: { user: { id: string; role: Parameters<typeof can>[0]["role"]; assignedTenantIds?: string[] }; tenantId: string | null },
  capability: Parameters<typeof can>[1]
) {
  const ok = can(
    {
      role: ctx.user.role,
      tenantId: ctx.tenantId,
      assignedTenantIds: ctx.user.assignedTenantIds ?? [],
    },
    capability,
    ctx.tenantId
  );
  if (!ok) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission for this payroll action.",
    });
  }
}

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

async function loadPayStructureMaps(tenantId: string, asOf: string) {
  const policies = await db.select().from(hrPolicies).where(eq(hrPolicies.tenantId, tenantId));
  const assignments = await db
    .select()
    .from(policyAssignments)
    .where(eq(policyAssignments.tenantId, tenantId));

  return {
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
    asOf,
  };
}

function compensationForEmployee(
  maps: Awaited<ReturnType<typeof loadPayStructureMaps>>,
  emp: { id: string; grade: number | null; basicSalaryIdr: string }
) {
  const resolved = resolvePolicy({
    policies: maps.policies,
    assignments: maps.assignments,
    kind: "pay_structure",
    employeeId: emp.id,
    grade: emp.grade ?? 1,
    asOf: maps.asOf,
  });
  const fallback = parseFloat(emp.basicSalaryIdr) || 0;
  const parsed = parsePayStructureCompensation(resolved?.payload ?? null, fallback);
  return {
    ...parsed,
    policyId: resolved?.policyId ?? null,
    policyName: resolved?.name ?? null,
    resolveSource: resolved?.source ?? null,
  };
}

export const payrollRouter = router({
  listRuns: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) {
      throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
    }
    if (ctx.user.role === "super_admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "SuperAdmin cannot access payroll." });
    }
    return await db.select().from(payrollRuns).where(eq(payrollRuns.tenantId, ctx.tenantId));
  }),

  /** Preview one employee line using resolved pay_structure → statutory engines. */
  previewEmployee: protectedProcedure
    .input(
      z.object({
        employeeId: z.string().uuid(),
        asOf: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        includeThr: z.boolean().default(false),
      })
    )
    .query(async ({ input, ctx }) => {
      assertCap(ctx, "payroll.calculate_finalize");
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
      }
      const [emp] = await db
        .select()
        .from(employees)
        .where(eq(employees.id, input.employeeId))
        .limit(1);
      if (!emp || emp.tenantId !== ctx.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Employee not found." });
      }

      const asOf = input.asOf ?? localDateKey(new Date());
      const maps = await loadPayStructureMaps(ctx.tenantId, asOf);
      const comp = compensationForEmployee(maps, emp);
      const thrPayIdr = input.includeThr
        ? calculateThr(comp.basicSalaryIdr, comp.fixedAllowancesIdr)
        : 0;
      const line = computeStatutoryPayrollLine({
        basicSalaryIdr: comp.basicSalaryIdr,
        fixedAllowancesIdr: comp.fixedAllowancesIdr,
        thrPayIdr,
        ptkpStatus: emp.ptkpStatus,
        hasNpwp: !!emp.npwp,
        workerCategory: emp.workerCategory,
        payStructureSource: comp.source,
      });

      return {
        employeeId: emp.id,
        fullName: emp.fullName,
        grade: emp.grade,
        policyId: comp.policyId,
        policyName: comp.policyName,
        resolveSource: comp.resolveSource,
        components: comp.components,
        line,
      };
    }),

  calculatePayrollRun: protectedProcedure
    .input(
      z.object({
        year: z.number().int(),
        month: z.number().int().min(1).max(12),
        includeThr: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      assertCap(ctx, "payroll.calculate_finalize");
      const tenantId = ctx.tenantId;
      if (!tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
      }

      const employeeList = await db.select().from(employees).where(eq(employees.tenantId, tenantId));
      const asOf = `${input.year}-${String(input.month).padStart(2, "0")}-01`;
      const maps = await loadPayStructureMaps(tenantId, asOf);

      const [run] = await db
        .insert(payrollRuns)
        .values({
          tenantId,
          year: input.year,
          month: input.month,
          status: "CALCULATED",
          calculatedBy: ctx.user.id,
          calculatedAt: new Date(),
        })
        .returning();

      let totalGross = 0;
      let totalPph21 = 0;
      let totalBpjsEmployer = 0;
      let totalBpjsEmployee = 0;
      let totalNet = 0;
      let fromPolicy = 0;

      for (const emp of employeeList) {
        const comp = compensationForEmployee(maps, emp);
        if (comp.source === "policy") fromPolicy += 1;
        const thrPayIdr = input.includeThr
          ? calculateThr(comp.basicSalaryIdr, comp.fixedAllowancesIdr)
          : 0;
        const line = computeStatutoryPayrollLine({
          basicSalaryIdr: comp.basicSalaryIdr,
          fixedAllowancesIdr: comp.fixedAllowancesIdr,
          thrPayIdr,
          ptkpStatus: emp.ptkpStatus,
          hasNpwp: !!emp.npwp,
          workerCategory: emp.workerCategory,
          payStructureSource: comp.source,
        });

        await db.insert(payrollItems).values({
          payrollRunId: run.id,
          employeeId: emp.id,
          basicSalaryIdr: line.basicSalaryIdr.toString(),
          fixedAllowancesIdr: line.fixedAllowancesIdr.toString(),
          variableAllowancesIdr: line.variableAllowancesIdr.toString(),
          overtimePayIdr: line.overtimePayIdr.toString(),
          thrPayIdr: line.thrPayIdr.toString(),
          grossSalaryIdr: line.grossSalaryIdr.toString(),
          bpjsJhtEmployeeIdr: line.bpjs.jhtEmployee.toString(),
          bpjsJpEmployeeIdr: line.bpjs.jpEmployee.toString(),
          bpjsKsEmployeeIdr: line.bpjs.ksEmployee.toString(),
          bpjsJhtEmployerIdr: line.bpjs.jhtEmployer.toString(),
          bpjsJpEmployerIdr: line.bpjs.jpEmployer.toString(),
          bpjsJkkEmployerIdr: line.bpjs.jkkEmployer.toString(),
          bpjsJkmEmployerIdr: line.bpjs.jkmEmployer.toString(),
          bpjsJkpEmployerIdr: line.bpjs.jkpEmployer.toString(),
          bpjsKsEmployerIdr: line.bpjs.ksEmployer.toString(),
          terCategory: line.terCategory,
          terRatePercent: line.terRatePercent.toString(),
          pph21TaxIdr: line.pph21TaxIdr.toString(),
          hasNpwpSurcharge: line.tax.npwpSurcharge.toString(),
          netSalaryIdr: line.netSalaryIdr.toString(),
          calculationDrilldown: {
            bpjsUpahBase: line.bpjs.upahBase,
            terCategory: line.terCategory,
            terRatePercent: line.terRatePercent,
            hasNpwp: !!emp.npwp,
            npwpSurchargeApplied: line.tax.npwpSurcharge,
            payStructureSource: line.payStructureSource,
            payStructurePolicyId: comp.policyId,
            payStructurePolicyName: comp.policyName,
            resolveSource: comp.resolveSource,
            components: comp.components,
          },
        });

        totalGross += line.grossSalaryIdr;
        totalPph21 += line.pph21TaxIdr;
        totalBpjsEmployer += line.bpjsEmployerIdr;
        totalBpjsEmployee += line.bpjsEmployeeIdr;
        totalNet += line.netSalaryIdr;
      }

      await db
        .update(payrollRuns)
        .set({
          totalGrossSalaryIdr: totalGross.toString(),
          totalPph21TaxIdr: totalPph21.toString(),
          totalBpjsEmployerIdr: totalBpjsEmployer.toString(),
          totalBpjsEmployeeIdr: totalBpjsEmployee.toString(),
          totalNetPayoutIdr: totalNet.toString(),
        })
        .where(eq(payrollRuns.id, run.id));

      await writeAudit({
        userId: ctx.user.id,
        tenantId,
        action: "payroll.calculate_finalize",
        resource: "payroll_run",
        resourceId: run.id,
        details: { fromPolicy, employeeCount: employeeList.length },
      });

      return {
        runId: run.id,
        employeeCount: employeeList.length,
        employeesFromPayStructure: fromPolicy,
        totalGrossIdr: totalGross,
        totalPph21TaxIdr: totalPph21,
        totalNetPayoutIdr: totalNet,
      };
    }),

  approveDisbursement: protectedProcedure
    .input(z.object({ runId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      assertCap(ctx, "payroll.disburse");
      if (!ctx.tenantId) throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });

      const [run] = await db.select().from(payrollRuns).where(eq(payrollRuns.id, input.runId)).limit(1);
      if (!run || run.tenantId !== ctx.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Payroll run not found." });
      }
      if (run.status !== "CALCULATED" && run.status !== "REVIEWED") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Payroll status is not ready for disbursement." });
      }

      const [updated] = await db
        .update(payrollRuns)
        .set({
          status: "APPROVED",
          approvedBy: ctx.user.id,
          approvedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(payrollRuns.id, input.runId))
        .returning();

      await writeAudit({
        userId: ctx.user.id,
        tenantId: ctx.tenantId,
        action: "payroll.disburse",
        resource: "payroll_run",
        resourceId: input.runId,
      });

      return updated;
    }),

  signOffFiling: protectedProcedure
    .input(z.object({ runId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      assertCap(ctx, "filing.signoff");
      if (!ctx.tenantId) throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });

      const [run] = await db.select().from(payrollRuns).where(eq(payrollRuns.id, input.runId)).limit(1);
      if (!run || run.tenantId !== ctx.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Payroll run not found." });
      }

      const [updated] = await db
        .update(payrollRuns)
        .set({
          status: "REVIEWED",
          filingSignedOffBy: ctx.user.id,
          filingSignedOffAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(payrollRuns.id, input.runId))
        .returning();

      await writeAudit({
        userId: ctx.user.id,
        tenantId: ctx.tenantId,
        action: "filing.signoff",
        resource: "payroll_run",
        resourceId: input.runId,
      });

      return updated;
    }),
});
