import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { SESSION_COOKIE } from "@nusakerja/auth";
import { db, sessions } from "@nusakerja/db";
import { ROLE_COOKIE } from "../../../../src/utils/signed-role-cookie";

export async function POST() {
  const jar = cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }
  jar.delete(SESSION_COOKIE);
  jar.delete(ROLE_COOKIE);
  jar.delete("nk_role");
  return NextResponse.json({ ok: true });
}
