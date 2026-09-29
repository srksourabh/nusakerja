import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { SESSION_COOKIE } from "@nusakerja/auth";
import { db, sessions, users } from "@nusakerja/db";
import { ROLE_COOKIE, roleCookieOptions, signRole } from "../../../../src/utils/signed-role-cookie";

export async function GET() {
  const jar = cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const [row] = await db
    .select({
      userId: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, token))
    .limit(1);

  if (!row || row.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  jar.set(ROLE_COOKIE, await signRole(row.role, token), roleCookieOptions(row.expiresAt));
  jar.delete("nk_role");
  return NextResponse.json({
    id: row.userId,
    email: row.email,
    name: row.name,
    role: row.role,
  });
}
