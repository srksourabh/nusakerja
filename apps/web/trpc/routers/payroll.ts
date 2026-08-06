import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { can } from "@nusakerja/auth";
import { db, payrollRuns, payrollItems, employees, auditLogs } from "@nusakerja/db";
import { calculateBpjsContribution, calculatePph21Ter } from "@nusakerja/config";
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
      message: "Anda tidak memiliki hak untuk melakukan tindakan payroll ini.",
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

export const payrollRouter = router({
  listRuns: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Tenant tidak dipilih." });
    }
    if (ctx.user.role === "super_admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "SuperAdmin tidak mengakses data payroll." });
    }
    return await db.select().from(payrollRuns).where(eq(payrollRuns.tenantId, ctx.tenantId));
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
        throw new TRPCError({ code: "FORBIDDEN", message: "Tenant tidak dipilih." });
      }

      const employeeList = await db.select().from(employees).where(eq(employees.tenantId, tenantId));

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

      for (const emp of employeeList) {
        const basicSalary = parseFloat(emp.basicSalaryIdr);
        const fixedAllowance = 0;
        const variableAllowance = 0;
        const overtimePay = 0;
        const thrPay = input.includeThr ? basicSalary : 0;
        const grossSalary = basicSalary + fixedAllowance + variableAllowance + overtimePay + thrPay;
        const bpjs = calculateBpjsContribution(basicSalary, fixedAllowance, emp.workerCategory);
        const tax = calculatePph21Ter(grossSalary, emp.ptkpStatus, !!emp.npwp, emp.workerCategory);
        const netSalary = grossSalary - bpjs.totalEmployeeDeductions - tax.pph21TaxIdr;

        await db.insert(payrollItems).values({
          payrollRunId: run.id,
          employeeId: emp.id,
          basicSalaryIdr: basicSalary.toString(),
          fixedAllowancesIdr: fixedAllowance.toString(),
          variableAllowancesIdr: variableAllowance.toString(),
          overtimePayIdr: overtimePay.toString(),
          thrPayIdr: thrPay.toString(),
          grossSalaryIdr: grossSalary.toString(),
          bpjsJhtEmployeeIdr: bpjs.jhtEmployee.toString(),
          bpjsJpEmployeeIdr: bpjs.jpEmployee.toString(),
          bpjsKsEmployeeIdr: bpjs.ksEmployee.toString(),
          bpjsJhtEmployerIdr: bpjs.jhtEmployer.toString(),
          bpjsJpEmployerIdr: bpjs.jpEmployer.toString(),
          bpjsJkkEmployerIdr: bpjs.jkkEmployer.toString(),
          bpjsJkmEmployerIdr: bpjs.jkmEmployer.toString(),
          bpjsJkpEmployerIdr: bpjs.jkpEmployer.toString(),
          bpjsKsEmployerIdr: bpjs.ksEmployer.toString(),
          terCategory: tax.terCategory,
          terRatePercent: tax.terRatePercent.toString(),
          pph21TaxIdr: tax.pph21TaxIdr.toString(),
          hasNpwpSurcharge: tax.npwpSurcharge.toString(),
          netSalaryIdr: netSalary.toString(),
          calculationDrilldown: {
            bpjsUpahBase: bpjs.upahBase,
            terCategory: tax.terCategory,
            terRatePercent: tax.terRatePercent,
            hasNpwp: !!emp.npwp,
            npwpSurchargeApplied: tax.npwpSurcharge,
          },
        });

        totalGross += grossSalary;
        totalPph21 += tax.pph21TaxIdr;
        totalBpjsEmployer += bpjs.totalEmployerCost;
        totalBpjsEmployee += bpjs.totalEmployeeDeductions;
        totalNet += netSalary;
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
      });

      return {
        runId: run.id,
        employeeCount: employeeList.length,
        totalGrossIdr: totalGross,
        totalPph21TaxIdr: totalPph21,
        totalNetPayoutIdr: totalNet,
      };
    }),

  approveDisbursement: protectedProcedure
    .input(z.object({ runId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      assertCap(ctx, "payroll.disburse");
      if (!ctx.tenantId) throw new TRPCError({ code: "FORBIDDEN", message: "Tenant tidak dipilih." });

      const [run] = await db.select().from(payrollRuns).where(eq(payrollRuns.id, input.runId)).limit(1);
      if (!run || run.tenantId !== ctx.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Payroll run tidak ditemukan." });
      }
      if (run.status !== "CALCULATED" && run.status !== "REVIEWED") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Status payroll tidak siap untuk disbursement." });
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
      if (!ctx.tenantId) throw new TRPCError({ code: "FORBIDDEN", message: "Tenant tidak dipilih." });

      const [run] = await db.select().from(payrollRuns).where(eq(payrollRuns.id, input.runId)).limit(1);
      if (!run || run.tenantId !== ctx.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Payroll run tidak ditemukan." });
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
