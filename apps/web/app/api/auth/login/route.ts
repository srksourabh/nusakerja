import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { SESSION_COOKIE, newSessionToken, verifyPassword } from "@nusakerja/auth";
import { db, users, sessions, auditLogs, tenants } from "@nusakerja/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "");
    const password = String(body.password || "");
    const tenantSlug = body.tenantSlug ? String(body.tenantSlug).toLowerCase() : null;

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ message: "Email atau kata sandi salah." }, { status: 401 });
    }

    let resolvedTenantId = user.tenantId;
    if (tenantSlug) {
      const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, tenantSlug)).limit(1);
      if (!tenant || !tenant.isActive) {
        return NextResponse.json({ message: "Portal perusahaan tidak ditemukan." }, { status: 404 });
      }
      // Platform SuperAdmin / CA may open any assigned flow; company users must match tenant
      if (user.role !== "super_admin" && user.role !== "reseller_admin") {
        if (user.tenantId !== tenant.id) {
          return NextResponse.json(
            { message: "Akun ini bukan anggota perusahaan pada URL tersebut." },
            { status: 403 }
          );
        }
      }
      resolvedTenantId = tenant.id;
      cookies().set("nk_tenant_slug", tenantSlug, { path: "/", sameSite: "lax" });
      if (user.role === "reseller_admin") {
        cookies().set("nk_active_tenant", tenant.id, { path: "/", sameSite: "lax" });
      }
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
      tenantId: resolvedTenantId,
      action: "login",
      resource: "session",
      resourceId: user.id,
      details: tenantSlug ? { tenantSlug } : {},
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: resolvedTenantId,
      tenantSlug: tenantSlug ?? undefined,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Login gagal" },
      { status: 500 }
    );
  }
}
