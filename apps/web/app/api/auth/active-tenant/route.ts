import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { SESSION_COOKIE } from "@nusakerja/auth";
import { db, sessions, users, companyCaAssignments } from "@nusakerja/db";

export async function POST(req: Request) {
  try {
    const { tenantId } = await req.json();
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const [row] = await db
      .select({ userId: users.id, role: users.role })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.token, token))
      .limit(1);
    if (!row || row.role !== "reseller_admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const [asg] = await db
      .select()
      .from(companyCaAssignments)
      .where(eq(companyCaAssignments.tenantId, tenantId))
      .limit(1);
    if (!asg || asg.caUserId !== row.userId) {
      return NextResponse.json({ message: "Perusahaan tidak ditugaskan" }, { status: 403 });
    }

    cookies().set("nk_active_tenant", tenantId, { httpOnly: true, sameSite: "lax", path: "/" });
    return NextResponse.json({ tenantId });
  } catch (e) {
    return NextResponse.json({ message: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}
