import { initTRPC, TRPCError } from "@trpc/server";
import { can, type Capability, type SessionUser } from "@nusakerja/auth";

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
      tenantId: ctx.tenantId ?? ctx.user.tenantId ?? null,
    },
  });
});

/** Platform control plane — SuperAdmin only. */
export const platformProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "super_admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Hanya Platform SuperAdmin yang dapat mengakses kontrol platform.",
    });
  }
  return next({ ctx });
});

/** Company-plane operators (not SuperAdmin, not bare CA without tenant). */
export const companyProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const companyRoles = ["client_admin", "hr_admin", "payroll_admin", "manager", "employee"];
  if (!companyRoles.includes(ctx.user.role) || !ctx.tenantId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Akses perusahaan tidak tersedia untuk peran ini.",
    });
  }
  return next({ ctx });
});

/** Legacy admin lump — prefer capability checks for new code. */
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const allowedRoles = ["super_admin", "reseller_admin", "client_admin", "hr_admin", "payroll_admin"];
  if (!allowedRoles.includes(ctx.user.role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Anda tidak memiliki hak akses administratif." });
  }
  return next({ ctx });
});

export function requireCapability(capability: Capability, resourceTenantId?: string | null) {
  return protectedProcedure.use(async ({ ctx, next }) => {
    const allowed = can(
      {
        role: ctx.user.role,
        tenantId: ctx.tenantId,
        assignedTenantIds: ctx.user.assignedTenantIds ?? [],
      },
      capability,
      resourceTenantId ?? ctx.tenantId
    );
    if (!allowed) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Anda tidak memiliki hak untuk melakukan tindakan ini.",
      });
    }
    return next({ ctx });
  });
}

export const trpc = {
  tenants: {
    list: { useQuery: () => ({ data: [], refetch: () => {} }) },
    create: { useMutation: () => ({ mutate: () => {}, isPending: false }) },
  },
} as any;
