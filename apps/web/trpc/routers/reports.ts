import { z } from "zod";
import { router, adminProcedure } from "../trpc";
import { db, payrollRuns, payrollItems, employees } from "@nusakerja/db";
import { eq } from "drizzle-orm";

export const reportsRouter = router({
  generateSptMasaCoretaxXml: adminProcedure
    .input(z.object({ payrollRunId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const items = await db
        .select()
        .from(payrollItems)
        .where(eq(payrollItems.payrollRunId, input.payrollRunId));

      const xmlRows = items.map((item) => `
        <MasaPajak>
          <EmployeeId>${item.employeeId}</EmployeeId>
          <Bruto>${item.grossSalaryIdr}</Bruto>
          <PPh21Ter>${item.pph21TaxIdr}</PPh21Ter>
          <TerCategory>${item.terCategory}</TerCategory>
        </MasaPajak>
      `).join("\n");

      const xmlOutput = `<?xml version="1.0" encoding="UTF-8"?>\n<CoretaxSptMasa21 xmlns="http://djp.go.id/coretax">\n${xmlRows}\n</CoretaxSptMasa21>`;

      return {
        filename: `SPT_Masa_PPh21_${input.payrollRunId}.xml`,
        mimeType: "application/xml",
        content: xmlOutput,
      };
    }),

  generateBpjsSippCsv: adminProcedure
    .input(z.object({ payrollRunId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const items = await db
        .select()
        .from(payrollItems)
        .where(eq(payrollItems.payrollRunId, input.payrollRunId));

      const headers = "EmployeeID,GrossSalary,JHT_Employee,JHT_Employer,JP_Employee,JP_Employer,JKK,JKM,JKP\n";
      const rows = items.map((i) =>
        `${i.employeeId},${i.grossSalaryIdr},${i.bpjsJhtEmployeeIdr},${i.bpjsJhtEmployerIdr},${i.bpjsJpEmployeeIdr},${i.bpjsJpEmployerIdr},${i.bpjsJkkEmployerIdr},${i.bpjsJkmEmployerIdr},${i.bpjsJkpEmployerIdr}`
      ).join("\n");

      return {
        filename: `BPJS_TK_SIPP_${input.payrollRunId}.csv`,
        mimeType: "text/csv",
        content: headers + rows,
      };
    }),

  generateBpjsEdabuCsv: adminProcedure
    .input(z.object({ payrollRunId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const items = await db
        .select()
        .from(payrollItems)
        .where(eq(payrollItems.payrollRunId, input.payrollRunId));

      const headers = "EmployeeID,GrossSalary,KS_Employer_4Pct,KS_Employee_1Pct,Total_KS\n";
      const rows = items.map((i) => {
        const total = parseFloat(i.bpjsKsEmployerIdr) + parseFloat(i.bpjsKsEmployeeIdr);
        return `${i.employeeId},${i.grossSalaryIdr},${i.bpjsKsEmployerIdr},${i.bpjsKsEmployeeIdr},${total}`;
      }).join("\n");

      return {
        filename: `BPJS_KS_EDABU_${input.payrollRunId}.csv`,
        mimeType: "text/csv",
        content: headers + rows,
      };
    }),
});
