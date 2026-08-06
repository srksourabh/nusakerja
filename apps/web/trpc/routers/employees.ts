import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import {
  db,
  employees,
  assertGrade,
  collectSubtreeIds,
  wouldCreateManagerCycle,
  buildOrgForest,
  type OrgEmployeeNode,
} from "@nusakerja/db";
import { eq, and } from "drizzle-orm";
import { getTerCategory } from "@nusakerja/config";

const gradeSchema = z.number().int().min(1).max(5);

async function loadTenantEmployees(tenantId: string) {
  return db.select().from(employees).where(eq(employees.tenantId, tenantId));
}

function toOrgNode(row: typeof employees.$inferSelect): OrgEmployeeNode {
  return {
    id: row.id,
    fullName: row.fullName,
    employeeCode: row.employeeCode,
    grade: row.grade ?? 1,
    managerEmployeeId: row.managerEmployeeId ?? null,
  };
}

export const employeesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) return [];
    const rows = await loadTenantEmployees(ctx.tenantId);
    if (ctx.user.role === "manager") {
      const self = rows.find((r) => r.userId === ctx.user.id);
      if (!self) return [];
      const allowed = collectSubtreeIds(rows.map(toOrgNode), self.id);
      return rows.filter((r) => allowed.has(r.id));
    }
    if (ctx.user.role === "employee") {
      return rows.filter((r) => r.userId === ctx.user.id);
    }
    return rows;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const result = await db.select().from(employees).where(eq(employees.id, input.id)).limit(1);
      const row = result[0];
      if (!row) return null;
      if (ctx.tenantId && row.tenantId !== ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cross-tenant access denied." });
      }
      return row;
    }),

  orgTree: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) return { roots: [], employees: [] as OrgEmployeeNode[] };
    const rows = await loadTenantEmployees(ctx.tenantId);
    let nodes = rows.map(toOrgNode);
    if (ctx.user.role === "manager") {
      const self = rows.find((r) => r.userId === ctx.user.id);
      if (!self) return { roots: [], employees: [] };
      const allowed = collectSubtreeIds(nodes, self.id);
      nodes = nodes.filter((n) => allowed.has(n.id));
    }
    return { roots: buildOrgForest(nodes), employees: nodes };
  }),

  listTeamSubtree: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) return [];
    const rows = await loadTenantEmployees(ctx.tenantId);
    if (ctx.user.role === "client_admin" || ctx.user.role === "hr_admin") {
      return rows;
    }
    if (ctx.user.role !== "manager") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only managers can list a team subtree." });
    }
    const self = rows.find((r) => r.userId === ctx.user.id);
    if (!self) return [];
    const allowed = collectSubtreeIds(rows.map(toOrgNode), self.id);
    return rows.filter((r) => allowed.has(r.id));
  }),

  updateOrg: protectedProcedure
    .input(
      z.object({
        employeeId: z.string().uuid(),
        grade: gradeSchema.optional(),
        managerEmployeeId: z.string().uuid().nullable().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "client_admin" && ctx.user.role !== "hr_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only Company Admin or HR may assign grade and manager.",
        });
      }
      if (!ctx.tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No company context." });
      }

      const rows = await loadTenantEmployees(ctx.tenantId);
      const target = rows.find((r) => r.id === input.employeeId);
      if (!target) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Employee not found." });
      }

      if (input.grade !== undefined) assertGrade(input.grade);

      if (input.managerEmployeeId !== undefined && input.managerEmployeeId !== null) {
        const manager = rows.find((r) => r.id === input.managerEmployeeId);
        if (!manager) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Manager must be in the same company." });
        }
        if (
          wouldCreateManagerCycle(
            rows.map(toOrgNode),
            input.employeeId,
            input.managerEmployeeId
          )
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "That manager assignment would create a reporting cycle.",
          });
        }
      }

      const [updated] = await db
        .update(employees)
        .set({
          ...(input.grade !== undefined ? { grade: input.grade } : {}),
          ...(input.managerEmployeeId !== undefined
            ? { managerEmployeeId: input.managerEmployeeId }
            : {}),
          updatedAt: new Date(),
        })
        .where(and(eq(employees.id, input.employeeId), eq(employees.tenantId, ctx.tenantId)))
        .returning();

      return updated;
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
          "K_I_0", "K_I_1", "K_I_2", "K_I_3",
        ]),
        workerCategory: z.enum(["PKWTT", "PKWT", "FREELANCE", "COMMISSIONER", "TKA"]),
        joinDate: z.string(),
        basicSalaryIdr: z.number().positive(),
        grade: gradeSchema.default(1),
        managerEmployeeId: z.string().uuid().nullable().optional(),
        kitasExpiryDate: z.string().optional(),
        rptkaRef: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      assertGrade(input.grade);
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
          grade: input.grade,
          managerEmployeeId: input.managerEmployeeId ?? null,
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
