/**
 * Company tenant public URLs.
 * Production: https://{slug}.nusakerja.com
 * Preview/local without wildcard DNS: /c/{slug} on the apex host.
 */

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "api",
  "admin",
  "ca",
  "login",
  "mail",
  "static",
  "portal",
  "docs",
  "status",
  "cdn",
  "assets",
  "super",
  "platform",
  "nusakerja",
]);

export function getTenantRootDomain(): string {
  return (
    process.env.NEXT_PUBLIC_TENANT_ROOT_DOMAIN ||
    process.env.TENANT_ROOT_DOMAIN ||
    "nusakerja.com"
  );
}

export function isReservedTenantSlug(slug: string): boolean {
  return RESERVED_SUBDOMAINS.has(slug.toLowerCase());
}

/** Canonical company URL shown to customers after onboard. */
export function buildCompanyUrl(slug: string): string {
  const root = getTenantRootDomain();
  return `https://${slug}.${root}`;
}

/** Path fallback that works on Vercel preview before wildcard DNS. */
export function buildCompanyPath(slug: string): string {
  return `/c/${slug}`;
}

/**
 * Extract tenant slug from Host header.
 * e.g. acme.nusakerja.com → acme; acme.localhost:3000 → acme
 * Returns null for apex / www / vercel preview hosts without a tenant subdomain.
 */
export function extractTenantSlugFromHost(host: string): string | null {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  if (!hostname || hostname === "localhost" || hostname.endsWith(".localhost")) {
    // acme.localhost → acme
    const parts = hostname.split(".");
    if (parts.length >= 2 && parts[parts.length - 1] === "localhost" && parts[0] !== "localhost") {
      const slug = parts[0];
      return isReservedTenantSlug(slug) ? null : slug;
    }
    return null;
  }

  // vercel.app / preview hosts do not carry custom company subdomains
  if (hostname.endsWith(".vercel.app") || hostname.endsWith(".vercel.sh")) {
    return null;
  }

  const root = getTenantRootDomain().toLowerCase();
  if (hostname === root || hostname === `www.${root}`) {
    return null;
  }

  if (hostname.endsWith(`.${root}`)) {
    const sub = hostname.slice(0, -(root.length + 1));
    // reject nested like a.b.nusakerja.com for now — only one label
    if (!sub || sub.includes(".")) return null;
    if (isReservedTenantSlug(sub)) return null;
    return sub;
  }

  return null;
}
