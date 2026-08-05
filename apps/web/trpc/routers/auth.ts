import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  newSessionToken,
  verifyPassword,
} from "@nusakerja/auth";
import { db, users, sessions, auditLogs } from "@nusakerja/db";
import { publicProcedure, protectedProcedure, router } from "../trpc";

const DEMO_ENABLED =
  process.env.ENABLE_DEMO_LOGIN === "true" || process.env.NODE_ENV !== "production";

async function writeAudit(opts: {
  userId?: string | null;
  tenantId?: string | null;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
}) {
  await db.insert(auditLogs).values({
    userId: opts.userId ?? null,
    tenantId: opts.tenantId ?? null,
    action: opts.action,
    resource: opts.resource,
    resourceId: opts.resourceId,
    details: opts.details ?? {},
  });
}

export const authRouter = router({
  me: publicProcedure.query(({ ctx }) => ({
    user: ctx.user,
    tenantId: ctx.tenantId,
    demoEnabled: DEMO_ENABLED,
  })),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [user] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (!user?.passwordHash || !verifyPassword(input.password, user.passwordHash)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email atau kata sandi salah.",
        });
      }

      const token = newSessionToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await db.insert(sessions).values({
        userId: user.id,
        token,
        expiresAt,
      });

      cookies().set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
      });

      await writeAudit({
        userId: user.id,
        tenantId: user.tenantId,
        action: "login",
        resource: "session",
        resourceId: user.id,
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      };
    }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (token) {
      await db.delete(sessions).where(eq(sessions.token, token));
    }
    cookies().delete(SESSION_COOKIE);
    cookies().delete("nk_active_tenant");
    await writeAudit({
      userId: ctx.user.id,
      tenantId: ctx.tenantId,
      action: "logout",
      resource: "session",
    });
    return { ok: true };
  }),

  setActiveTenant: protectedProcedure
    .input(z.object({ tenantId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "reseller_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Hanya CA yang dapat memilih tenant aktif.",
        });
      }
      const allowed = ctx.user.assignedTenantIds ?? [];
      if (!allowed.includes(input.tenantId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Perusahaan ini tidak ditugaskan kepada CA Anda.",
        });
      }
      cookies().set("nk_active_tenant", input.tenantId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
      return { tenantId: input.tenantId };
    }),

  demoCredentials: publicProcedure.query(() => {
    if (!DEMO_ENABLED) return { enabled: false as const, personas: [] as const };
    return {
      enabled: true as const,
      personas: [
        {
          key: "super_admin",
          email: "srksourabh@gmail.com",
          password: "DemoSuperAdmin!2026",
          label: "SuperAdmin",
        },
        { key: "reseller_admin", email: "ca@nusakerja.id", password: "DemoCA!2026", label: "CA" },
        {
          key: "client_admin",
          email: "admin@nusantara.co.id",
          password: "DemoAdmin!2026",
          label: "Company Admin",
        },
        {
          key: "hr_admin",
          email: "bambang.hr@nusantara.co.id",
          password: "DemoHR!2026",
          label: "HR",
        },
        {
          key: "manager",
          email: "manager@nusantara.co.id",
          password: "DemoManager!2026",
          label: "Manager",
        },
        {
          key: "employee",
          email: "budi.santoso@nusantara.co.id",
          password: "DemoEmployee!2026",
          label: "Employee",
        },
      ] as const,
    };
  }),
});
