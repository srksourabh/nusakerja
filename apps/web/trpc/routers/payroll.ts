import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import { db, payrollRuns, payrollItems, employees } from "@nusakerja/db";
import { eq } from "drizzle-orm";
import { calculateBpjsContribution, calculatePph21Ter, calculateOvertimePay } from "@nusakerja/config";

export const payrollRouter = router({
  listRuns: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select()
      .from(payrollRuns)
      .where(ctx.tenantId ? eq(payrollRuns.tenantId, ctx.tenantId) : undefined);
  }),

  calculatePayrollRun: adminProcedure
    .input(
      z.object({
        year: z.number().int(),
        month: z.number().int().min(1).max(12),
        includeThr: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const tenantId = ctx.tenantId || "00000000-0000-0000-0000-000000000000";

      // 1. Fetch active employees
      const employeeList = await db
        .select()
        .from(employees)
        .where(eq(employees.tenantId, tenantId));

      // 2. Create Draft Payroll Run
      const [run] = await db
        .insert(payrollRuns)
        .values({
          tenantId,
          year: input.year,
          month: input.month,
          status: "CALCULATED",
        })
        .returning();

      let totalGross = 0;
      let totalPph21 = 0;
      let totalBpjsEmployer = 0;
      let totalBpjsEmployee = 0;
      let totalNet = 0;

      // 3. Process each employee
      for (const emp of employeeList) {
        const basicSalary = parseFloat(emp.basicSalaryIdr);
        const fixedAllowance = 0;
        const variableAllowance = 0;
        const overtimePay = 0;
        const thrPay = input.includeThr ? basicSalary : 0;

        const grossSalary = basicSalary + fixedAllowance + variableAllowance + overtimePay + thrPay;

        // BPJS Statutory Calculation
        const bpjs = calculateBpjsContribution(basicSalary, fixedAllowance, emp.workerCategory);

        // PPh 21 TER Tax Calculation
        const tax = calculatePph21Ter(grossSalary, emp.ptkpStatus, !!emp.npwp, emp.workerCategory);

        const netSalary = grossSalary - bpjs.totalEmployeeDeductions - tax.pph21TaxIdr;

        // Insert Payroll Item line
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

      // Update Run Totals
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

      return {
        runId: run.id,
        employeeCount: employeeList.length,
        totalGrossIdr: totalGross,
        totalPph21TaxIdr: totalPph21,
        totalNetPayoutIdr: totalNet,
      };
    }),
});
