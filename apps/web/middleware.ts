import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { extractTenantSlugFromHost } from "./src/utils/tenant-url";

const TENANT_SLUG_COOKIE = "nk_tenant_slug";
const TENANT_SLUG_HEADER = "x-tenant-slug";

function homeForRole(role: string | undefined): string {
  if (role === "super_admin") return "/super-admin";
  if (role === "reseller_admin") return "/ca";
  if (role === "employee") return "/portal";
  if (role === "client_admin") return "/team";
  return "/dashboard";
}

const CA_ALLOWED = ["/ca", "/payroll", "/playbook"];
const EMPLOYEE_ALLOWED = ["/portal", "/leave", "/expenses", "/attendance", "/inbox", "/playbook"];

function pathAllowed(prefixes: string[], pathname: string): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

const APP_PREFIXES = [
  "/dashboard",
  "/super-admin",
  "/ca",
  "/admin",
  "/leave",
  "/expenses",
  "/attendance",
  "/payroll",
  "/employees",
  "/onboarding",
  "/policies",
  "/playbook",
  "/inbox",
  "/portal",
  "/team",
  "/reports",
  "/severance",
  "/organogram",
];

function isAppPath(pathname: string): boolean {
  return APP_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function roleGuard(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || !isAppPath(pathname)) return null;
  const role = request.cookies.get("nk_role")?.value;
  if (!role) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  const wantsSuper = pathname === "/super-admin" || pathname.startsWith("/super-admin/");
  const wantsCa = pathname === "/ca" || pathname.startsWith("/ca/");
  if (wantsSuper && role !== "super_admin") {
    const url = request.nextUrl.clone();
    url.pathname = homeForRole(role);
    return NextResponse.redirect(url);
  }
  if (wantsCa && role !== "reseller_admin") {
    const url = request.nextUrl.clone();
    url.pathname = homeForRole(role);
    return NextResponse.redirect(url);
  }
  const limited =
    role === "reseller_admin" ? CA_ALLOWED : role === "employee" ? EMPLOYEE_ALLOWED : null;
  if (limited && !pathAllowed(limited, pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = homeForRole(role);
    return NextResponse.redirect(url);
  }
  return null;
}

export function middleware(request: NextRequest) {
  const denied = roleGuard(request);
  if (denied) {
    applySecurityHeaders(denied);
    return denied;
  }

  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  let tenantSlug = extractTenantSlugFromHost(host);

  // Path fallback: /c/{slug}/... when wildcard DNS is not yet configured
  if (!tenantSlug) {
    const pathMatch = pathname.match(/^\/c\/([a-z0-9][a-z0-9-]{0,47})(?:\/|$)/);
    if (pathMatch) tenantSlug = pathMatch[1];
  }

  const requestHeaders = new Headers(request.headers);
  if (tenantSlug) {
    requestHeaders.set(TENANT_SLUG_HEADER, tenantSlug);
  }

  // Subdomain apex → rewrite to company portal path so routing works on one Next app
  if (tenantSlug && extractTenantSlugFromHost(host)) {
    const isCompanyPath = pathname.startsWith(`/c/${tenantSlug}`);
    const isAsset =
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname === "/favicon.ico" ||
      pathname === "/logo.png";
    if (!isCompanyPath && !isAsset && (pathname === "/" || pathname === "/login")) {
      const url = request.nextUrl.clone();
      url.pathname = pathname === "/login" ? `/c/${tenantSlug}/login` : `/c/${tenantSlug}`;
      const rewrite = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
      rewrite.cookies.set(TENANT_SLUG_COOKIE, tenantSlug, {
        path: "/",
        sameSite: "lax",
        httpOnly: false,
      });
      applySecurityHeaders(rewrite);
      return rewrite;
    }
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (tenantSlug) {
    response.cookies.set(TENANT_SLUG_COOKIE, tenantSlug, {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
    });
  }
  applySecurityHeaders(response);
  return response;
}

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  response.headers.set("X-XSS-Protection", "1; mode=block");
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
