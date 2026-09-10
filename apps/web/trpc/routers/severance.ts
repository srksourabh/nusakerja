import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { calculateSeverancePay, type TerminationReason } from "@nusakerja/config/severance";

export const severanceRouter = router({
  calculate: protectedProcedure
    .input(
      z.object({
        monthlyWage: z.number().positive(),
        yearsOfService: z.number().nonnegative(),
        terminationReason: z.enum(["LAYOFF", "RETIREMENT", "RESIGNATION", "DISABILITY"]),
      })
    )
    .query(({ input }) => {
      return calculateSeverancePay(
        input.monthlyWage,
        input.yearsOfService,
        input.terminationReason as TerminationReason
      );
    }),
});
