const encoder = new TextEncoder();

export const ROLE_COOKIE = "nk_role_sig";

const ROLES = new Set([
  "employee",
  "manager",
  "hr_admin",
  "client_admin",
  "payroll_admin",
  "reseller_admin",
  "super_admin",
]);

export function authSecret(): string {
  return process.env.AUTH_SECRET || "supersecret_change_me_in_production_min_32_chars";
}

function hex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmac(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return hex(signature);
}

async function bindToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(token));
  return hex(digest).slice(0, 16);
}

export async function signRole(role: string, sessionToken: string, now = Date.now()): Promise<string> {
  const exp = now + 7 * 24 * 60 * 60 * 1000;
  const bind = await bindToken(sessionToken);
  const payload = `${role}.${exp}.${bind}`;
  const signature = await hmac(authSecret(), payload);
  return `${payload}.${signature}`;
}

export async function readSignedRole(
  value: string | undefined,
  sessionToken: string | undefined,
  now = Date.now()
): Promise<string | null> {
  if (!value || !sessionToken) return null;
  const parts = value.split(".");
  if (parts.length !== 4) return null;
  const [role, expStr, bind, signature] = parts;
  if (!role || !ROLES.has(role) || !expStr || !bind || !signature) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < now) return null;
  if ((await bindToken(sessionToken)) !== bind) return null;
  const expected = await hmac(authSecret(), `${role}.${expStr}.${bind}`);
  if (expected.length !== signature.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  if (diff !== 0) return null;
  return role;
}

export function roleCookieOptions(expires: Date) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}
