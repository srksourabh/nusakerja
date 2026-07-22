import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import { db, employees, users } from "@nusakerja/db";
import { eq, and } from "drizzle-orm";
import { getTerCategory } from "@nusakerja/config";

export const employeesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select()
      .from(employees)
      .where(ctx.tenantId ? eq(employees.tenantId, ctx.tenantId) : undefined);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(employees)
        .where(eq(employees.id, input.id))
        .limit(1);
      return result[0] || null;
    }),

  create: adminProcedure
    .input(
      z.object({
        employeeCode: z.string().min(2),
        fullName: z.string().min(2),
        nikKtp: z.string().regex(/^\d{16}$/, "NIK/KTP harus 16 digit"),
        npwp: z.string().optional(),
        bpjsKetenagakerjaanNo: z.string().optional(),
        bpjsKesehatanNo: z.string().optional(),
        ptkpStatus: z.enum([
          "TK_0", "TK_1", "TK_2", "TK_3",
          "K_0", "K_1", "K_2", "K_3",
          "K_I_0", "K_I_1", "K_I_2", "K_I_3"
        ]),
        workerCategory: z.enum(["PKWTT", "PKWT", "FREELANCE", "COMMISSIONER", "TKA"]),
        joinDate: z.string(),
        basicSalaryIdr: z.number().positive(),
        kitasExpiryDate: z.string().optional(),
        rptkaRef: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const derivedTerCategory = getTerCategory(input.ptkpStatus);

      const [newEmployee] = await db
        .insert(employees)
        .values({
          tenantId: ctx.tenantId || "00000000-0000-0000-0000-000000000000",
          employeeCode: input.employeeCode,
          fullName: input.fullName,
          nikKtp: input.nikKtp,
          npwp: input.npwp || null,
          bpjsKetenagakerjaanNo: input.bpjsKetenagakerjaanNo || null,
          bpjsKesehatanNo: input.bpjsKesehatanNo || null,
          ptkpStatus: input.ptkpStatus,
          workerCategory: input.workerCategory,
          joinDate: input.joinDate,
          basicSalaryIdr: input.basicSalaryIdr.toString(),
          kitasExpiryDate: input.kitasExpiryDate || null,
          rptkaRef: input.rptkaRef || null,
        })
        .returning();

      return {
        employee: newEmployee,
        derivedTerCategory,
      };
    }),
});
