export type Locale = "id-ID" | "en-US";

export function interpolate(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] != null ? String(vars[key]) : `{${key}}`
  );
}

export function pickCopy(
  locale: Locale,
  en: string,
  id: string,
  vars?: Record<string, string | number>
): string {
  return interpolate(locale === "id-ID" ? id : en, vars);
}
