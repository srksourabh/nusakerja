"use client";

import { Globe } from "lucide-react";
import { useI18n, type Locale } from "../context/i18n-context";

interface LanguageToggleProps {
  variant?: "compact" | "segmented";
  className?: string;
}

export function LanguageToggle({ variant = "compact", className }: LanguageToggleProps) {
  const { locale, setLocale, tx } = useI18n();

  if (variant === "segmented") {
    const btn = (loc: Locale, label: string, activeClass: string) => (
      <button
        type="button"
        onClick={() => setLocale(loc)}
        className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
          locale === loc ? activeClass : "text-slate-400 hover:text-white"
        }`}
      >
        {label}
      </button>
    );
    return (
      <div className={`bg-slate-800 p-1 rounded-full border border-slate-700 flex items-center space-x-1 ${className ?? ""}`}>
        {btn("id-ID", "🇮🇩 ID", "bg-red-600 text-white shadow-md")}
        {btn("en-US", "🇺🇸 EN", "bg-blue-600 text-white shadow-md")}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "id-ID" ? "en-US" : "id-ID")}
      className={className}
      style={
        className
          ? undefined
          : {
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 9999,
              background: locale === "en-US" ? "#E0F2FE" : "#FEE2E2",
              color: locale === "en-US" ? "#075985" : "#991B1B",
              border: "1px solid #E2E8F0",
              cursor: "pointer",
            }
      }
      title={tx("Language — English by default; choose Indonesian when needed", "Bahasa — default English; pilih Indonesia jika diperlukan")}
    >
      <Globe style={{ width: 13, height: 13 }} />
      <span>{locale === "id-ID" ? "Bahasa Indonesia" : "English"}</span>
    </button>
  );
}
