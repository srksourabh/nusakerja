# DESIGN.md — NusaKerja Design System Specification

## 1. Brand & Cultural Identity

NusaKerja carries an Indonesian cultural identity:
- **Primary Palette (Merah Putih)**: Deep Red (`#D62828`) and Pure White (`#FFFFFF`) with Slate neutral darks (`#1E293B`).
- **Typography**: Inter for UI body & display, JetBrains Mono for monetary values and NIK/NPWP numbers.
- **Language Priority**: Bahasa Indonesia default with immediate English toggle support.

---

## 2. Color System Tokens

```css
:root {
  --color-brand-red-500: #D62828;
  --color-brand-red-600: #B71C1C;
  --color-brand-red-50:  #FEF2F2;
  --color-neutral-900:   #0F172A;
  --color-neutral-100:   #F1F5F9;
  --color-success-600:   #059669;
  --color-warning-600:   #D97706;
  --color-error-600:     #E11D48;
}
```

---

## 3. Accessibility & Responsiveness

- **WCAG AA Compliance**: High contrast ratios on all text and button elements.
- **Responsive Layout**: Mobile-first PWA design for field employees punching via mobile phones on 3G networks.
