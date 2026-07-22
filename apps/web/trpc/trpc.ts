import { initTRPC, TRPCError } from "@trpc/server";
import type { SessionUser } from "@nusakerja/auth";

export interface Context {
  user: SessionUser | null;
  tenantId: string | null;
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Anda harus login terlebih dahulu." });
  }
  return next({
    ctx: {
      user: ctx.user,
      tenantId: ctx.tenantId || ctx.user.tenantId,
    },
  });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const allowedRoles = ["super_admin", "reseller_admin", "client_admin", "hr_admin", "payroll_admin"];
  if (!allowedRoles.includes(ctx.user.role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Anda tidak memiliki hak akses administratif." });
  }
  return next({ ctx });
});
