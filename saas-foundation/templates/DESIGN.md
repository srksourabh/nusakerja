# Design system — <project-name>

## Brand palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-brand-50` | `#f0f9ff` | Lightest brand bg |
| `--color-brand-100` | `#e0f2fe` | Hover brand bg |
| `--color-brand-500` | `#3b82f6` | Primary buttons, links |
| `--color-brand-600` | `#2563eb` | Button hover, active |
| `--color-brand-700` | `#1d4ed8` | Pressed state |
| `--color-brand-900` | `#1e3a5f` | High-contrast brand text |

*Replace with your actual brand colors. Use Tailwind's `primary` key in `tailwind.config.ts`.*

## Semantic colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-bg` | `#ffffff` | `#0a0a0a` | Page background |
| `--color-bg-subtle` | `#f5f5f5` | `#141414` | Card, sidebar |
| `--color-fg` | `#171717` | `#fafafa` | Primary text |
| `--color-fg-muted` | `#737373` | `#a3a3a3` | Secondary text |
| `--color-border` | `#e5e5e5` | `#262626` | Borders, dividers |
| `--color-success` | `#16a34a` | `#22c55e` | Success states |
| `--color-warning` | `#d97706` | `#eab308` | Warning states |
| `--color-error` | `#dc2626` | `#ef4444` | Error states |
| `--color-info` | `#2563eb` | `#3b82f6` | Info states |

*Implemented via CSS custom properties on `:root` and `.dark` in `app/globals.css`.*

## Typography

### Font stack
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type scale
| Level | Size | Weight | Line height | Tag |
|-------|------|--------|-------------|-----|
| `display` | 4.5rem (72px) | 700 (bold) | 1.1 | `h1` |
| `heading-1` | 2.25rem (36px) | 700 | 1.2 | `h1` |
| `heading-2` | 1.875rem (30px) | 600 | 1.25 | `h2` |
| `heading-3` | 1.5rem (24px) | 600 | 1.3 | `h3` |
| `heading-4` | 1.25rem (20px) | 600 | 1.35 | `h4` |
| `body-large` | 1.125rem (18px) | 400 | 1.5 | `p` |
| `body` | 1rem (16px) | 400 | 1.5 | `p` |
| `body-small` | 0.875rem (14px) | 400 | 1.5 | `small` |
| `caption` | 0.75rem (12px) | 400 | 1.5 | `span` |
| `label` | 0.875rem (14px) | 500 | 1 | `label` |

*Implement as Tailwind extensions in `tailwind.config.ts` under `fontSize`.*

## Spacing scale

| Token | Rem | Px |
|-------|-----|----|
| `space-0` | 0 | 0 |
| `space-1` | 0.25rem | 4px |
| `space-2` | 0.5rem | 8px |
| `space-3` | 0.75rem | 12px |
| `space-4` | 1rem | 16px |
| `space-5` | 1.25rem | 20px |
| `space-6` | 1.5rem | 24px |
| `space-8` | 2rem | 32px |
| `space-10` | 2.5rem | 40px |
| `space-12` | 3rem | 48px |
| `space-16` | 4rem | 64px |
| `space-20` | 5rem | 80px |
| `space-24` | 6rem | 96px |

*Use Tailwind's built-in spacing — no custom config needed unless overriding.*

## Border radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 0.375rem | Inputs, small elements |
| `radius-md` | 0.5rem | Cards, buttons |
| `radius-lg` | 0.75rem | Dialogs, modals |
| `radius-xl` | 1rem | Large panels |
| `radius-full` | 9999px | Pills, avatars |

## Shadows

| Token | Light | Dark |
|-------|-------|------|
| `shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.05)` | `0 1px 2px rgb(0 0 0 / 0.3)` |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | `0 4px 6px -1px rgb(0 0 0 / 0.4)` |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | `0 10px 15px -3px rgb(0 0 0 / 0.5)` |
| `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1)` | `0 20px 25px -5px rgb(0 0 0 / 0.5)` |

## Motion

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `motion-duration-fast` | 150ms | `ease-out` | Hover, tap |
| `motion-duration-normal` | 200ms | `ease-out` | Transitions |
| `motion-duration-slow` | 300ms | `ease-in-out` | Modals, panels |
| `motion-ease-in` | — | `cubic-bezier(0.4, 0, 1, 1)` | Enter |
| `motion-ease-out` | — | `cubic-bezier(0, 0, 0.2, 1)` | Exit |

*Respect `prefers-reduced-motion` — disable all animations when detected.*

## Layout system

### Breakpoints
| Name | Min-width | Target |
|------|-----------|--------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1536px | Ultra-wide |

### Grid
- Page layout: CSS Grid with `--sidebar-width: 16rem` and `1fr` main area
- Content width: max `72rem` (1152px), centered with `mx-auto`
- Card grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

### Page layout template
```
┌──────────┬────────────────────────────────────┐
│          │                                    │
│ Sidebar  │  Main content area                 │
│ 16rem    │  ┌──────────────────────────────┐  │
│          │  │  Header (breadcrumbs +       │  │
│ Logo     │  │  actions)                    │  │
│ Nav      │  ├──────────────────────────────┤  │
│ User     │  │                              │  │
│          │  │  Page content                │  │
│          │  │  (max-width: 72rem)          │  │
│          │  │                              │  │
│          │  └──────────────────────────────┘  │
│          │                                    │
└──────────┴────────────────────────────────────┘
```

## Component architecture

### Component tiers
```
Tier 1 — Primitives (shadcn/ui)
  Button, Input, Label, Badge, Card, Dialog, DropdownMenu, Table, Tabs, Select

Tier 2 — Composed (packages/ui/src/)
  DataTable (Table + pagination + search)
  FormField (Label + Input + error message)
  PageHeader (title + description + actions)
  EmptyState (icon + title + description + CTA)
  ConfirmDialog (Dialog + destructive action)

Tier 3 — Feature components (apps/web/components/)
  UserMenu, SidebarNav, DashboardStats, ActivityFeed
  └── specific to app domain, never in packages/ui/
```

### State patterns
- **Loading**: Skeleton components (shadcn `Skeleton`) — never spinners for content
- **Empty**: `EmptyState` with illustration, description, and primary action
- **Error**: Inline error with retry button, or `error.tsx` boundary
- **Edge**: Truncated text with tooltip, overflow scroll on tables

### Form patterns
- All forms use `react-hook-form` + `@hookform/resolvers/zod`
- Field validation: synchronous (Zod) + async (server-side tRPC)
- Submit button shows loading state, disables during submission
- Errors appear inline below each field
- Success: toast notification (sonner)
- Destructive actions: require `ConfirmDialog`

## Accessibility

- All interactive elements reachable via keyboard (`tabindex`, `aria-*`)
- Forms use semantic `<label>` with `htmlFor`
- Color contrast meets WCAG AA minimum (4.5:1 for text, 3:1 for large text)
- Focus indicators: visible `ring-2 ring-offset-2` on all interactive elements
- Images have `alt` text — empty `alt=""` for decorative
- `prefers-reduced-motion` respected globally
- Error messages linked to inputs via `aria-describedby`
- Page regions: `<header>`, `<nav>`, `<main>`, `<aside>` with `aria-label`
- Skip-to-content link as first focusable element

## Dark mode

- Implemented via Tailwind `darkMode: 'class'` — toggle on `<html>`
- Persist preference in `localStorage` + system default via `prefers-color-scheme`
- Toggle component in dashboard header (sun/moon icon)
- All shadcn/ui components support dark mode out of box
- Custom components: use `dark:` variants on every color property

## Iconography

- Use `lucide-react` (shadcn/ui default)
- Consistent size: `h-4 w-4` for inline, `h-5 w-5` for standalone
- No custom SVG icons unless absolutely necessary
- Icons always inherit `currentColor`

## Coding conventions for UI

```
// File naming: kebab-case
// Component: PascalCase
// Props: camelCase, interface before component
// Export: named export, not default (except pages)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

// Use class-variance-authority (cva) for variant management
// Use cn() utility for conditional class merging
// Never use inline styles — always Tailwind classes
```
