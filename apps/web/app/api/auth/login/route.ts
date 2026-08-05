import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { SESSION_COOKIE, newSessionToken, verifyPassword } from "@nusakerja/auth";
import { db, users, sessions, auditLogs } from "@nusakerja/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "");
    const password = String(body.password || "");
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ message: "Email atau kata sandi salah." }, { status: 401 });
    }

    const token = newSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(sessions).values({ userId: user.id, token, expiresAt });
    cookies().set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });
    await db.insert(auditLogs).values({
      userId: user.id,
      tenantId: user.tenantId,
      action: "login",
      resource: "session",
      resourceId: user.id,
      details: {},
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Login gagal" },
      { status: 500 }
    );
  }
}
