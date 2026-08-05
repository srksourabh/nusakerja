import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import {
  SESSION_COOKIE,
  type SessionUser,
} from "@nusakerja/auth";
import { db, sessions, users, companyCaAssignments } from "@nusakerja/db";
import type { Context } from "../../../trpc/trpc";

export async function createTRPCContext(): Promise<Context> {
  try {
    const jar = cookies();
    const token = jar.get(SESSION_COOKIE)?.value;
    if (!token) return { user: null, tenantId: null };

    const [row] = await db
      .select({
        sessionId: sessions.id,
        expiresAt: sessions.expiresAt,
        userId: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        tenantId: users.tenantId,
        locale: users.locale,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.token, token))
      .limit(1);

    if (!row || row.expiresAt.getTime() < Date.now()) {
      return { user: null, tenantId: null };
    }

    let assignedTenantIds: string[] | undefined;
    if (row.role === "reseller_admin") {
      const assignments = await db
        .select({ tenantId: companyCaAssignments.tenantId })
        .from(companyCaAssignments)
        .where(eq(companyCaAssignments.caUserId, row.userId));
      assignedTenantIds = assignments.map((a) => a.tenantId);
    }

    const activeTenantCookie = jar.get("nk_active_tenant")?.value;
    let tenantId = row.tenantId;
    if (row.role === "reseller_admin" && activeTenantCookie && assignedTenantIds?.includes(activeTenantCookie)) {
      tenantId = activeTenantCookie;
    }
    if (row.role === "super_admin") {
      tenantId = null;
    }

    const user: SessionUser = {
      id: row.userId,
      email: row.email,
      name: row.name,
      role: row.role,
      locale: row.locale,
      tenantId: tenantId ?? undefined,
      assignedTenantIds,
    };

    return { user, tenantId: tenantId ?? null };
  } catch {
    return { user: null, tenantId: null };
  }
}
