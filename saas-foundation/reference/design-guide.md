# Front-end design reference

## Implementation roadmap

When generating the project, implement design in this order:

### Step 1 — Globals CSS (`apps/web/app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-bg: 0 0% 100%;
    --color-fg: 0 0% 9%;
    /* ... all CSS custom properties from DESIGN.md ... */
  }

  .dark {
    --color-bg: 0 0% 4%;
    --color-fg: 0 0% 98%;
    /* ... dark overrides ... */
  }
}
```

### Step 2 — Tailwind config (`apps/web/tailwind.config.ts`)

Extend the default theme:
- `colors.primary` → brand palette
- `fontSize` → type scale
- `borderRadius` → radius tokens
- `boxShadow` → shadow tokens
- `transitionDuration` → motion tokens
- `animation` → custom keyframes

### Step 3 — shadcn/ui init

- `components.json`: style default, Tailwind CSS, CSS variables for colors
- Base components: Button, Input, Label, Card, Badge, Dialog, DropdownMenu, Table, Tabs, Select, Skeleton, Avatar, Toast/Sonner

### Step 4 — Layout components (`apps/web/app/(dashboard)/layout.tsx`)

```
├── Sidebar (sticky, 16rem, scrollable)
│   ├── Logo/App name
│   ├── Nav items (icon + label)
│   │   ├── Dashboard
│   │   ├── [feature links]
│   │   └── Settings
│   └── User info (avatar + name + logout)
├── Main area
│   ├── Top bar (breadcrumbs + global actions + theme toggle + user menu)
│   └── Page content (<slot />)
```

### Step 5 — Page layouts

Each page follows this structure:

```
<PageHeader title="..." description="..." />
  └── <div className="space-y-4">
        <SearchBar />            // if list page
        <DataTable />            // if list page
        <EmptyState />           // if zero state
      </div>
```

### Step 6 — Responsive behavior

| Viewport | Sidebar | Layout |
|----------|---------|--------|
| >= 1024px | Visible, pinned | Two-column |
| < 1024px | Hidden, slide-over drawer | Single column |
| < 640px | Full-width, stacked | Single column, stacked |

## Component composition patterns

### DataTable pattern
```tsx
// Server: trpc procedure returns { data: T[], total: number }
// Client: useQuery with pagination state
// Features: sort, search, paginate, row selection, export

<DataTable
  columns={columns}
  data={data ?? []}
  total={total ?? 0}
  page={page}
  pageSize={pageSize}
  onPageChange={setPage}
  loading={isLoading}
  empty={<EmptyState title="No results" action={<Button>Create</Button>} />}
/>
```

### Form page pattern
```tsx
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Section title</CardTitle>
      <CardDescription>Section description</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormField ... />
      <FormField ... />
    </CardContent>
  </Card>
  <div className="flex gap-4 justify-end">
    <Button variant="ghost" type="button">Cancel</Button>
    <Button type="submit" loading={isPending}>Save</Button>
  </div>
</form>
```

## Anti-patterns

- **Don't** invent custom colors outside the semantic palette. Use Tailwind built-in or config tokens.
- **Don't** mix Tailwind classes and CSS-in-JS. Tailwind only.
- **Don't** add new shadcn/ui components per feature page — compose from existing.
- **Don't** use spinners for loading data. Use skeleton shapes that match content layout.
- **Don't** write custom CSS for layout. Tailwind utilities cover 99% of cases.
- **Don't** use `!important` — Tailwind's `@layer` system handles specificity.
- **Don't** implement dark mode by toggling a separate stylesheet — use `dark:` variants.
- **Don't** hardcode breakpoints — use Tailwind's responsive prefix system.
