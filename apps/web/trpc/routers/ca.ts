import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { db, companyCaAssignments, tenants } from "@nusakerja/db";
import { protectedProcedure, router } from "../trpc";

export const caRouter = router({
  portfolio: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "reseller_admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Hanya akun CA yang memiliki portofolio." });
    }
    const rows = await db
      .select({
        tenantId: tenants.id,
        name: tenants.name,
        slug: tenants.slug,
        isActive: tenants.isActive,
        assignedAt: companyCaAssignments.assignedAt,
      })
      .from(companyCaAssignments)
      .innerJoin(tenants, eq(companyCaAssignments.tenantId, tenants.id))
      .where(eq(companyCaAssignments.caUserId, ctx.user.id));
    return rows;
  }),
});
