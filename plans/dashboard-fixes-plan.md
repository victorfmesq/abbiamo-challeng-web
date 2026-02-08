# Plan: Dashboard Fixes

## Objective

Fix identified issues in the Dashboard without changing functionality, adding features, or removing Recharts.

> ⚠️ Scroll issue ALREADY FIXED - removed from plan

---

## Design System Colors (Existing)

From `docs/kilo/DESIGN_SYSTEM.md`:

- Primary: `indigo-500`
- Secondary: `sky-500`
- Success: `emerald-500`
- Warning: `amber-500`
- Danger: `rose-500`
- Info: `blue-500`

Status mapping:

- PENDING → info → `blue-500`
- IN_ROUTE → info → `blue-500`
- DELIVERED → success → `emerald-500`
- DELAYED → warning → `amber-500`
- FAILED → danger → `rose-500`

---

## 1. Remove Hardcoded Colors from Recharts

### Problem

[`DashboardTrends.tsx`](src/features/dashboard/components/DashboardTrends.tsx:19-38) has hardcoded hex colors.

### Solution: Semantic Color Labels

#### Step 1: Add CSS variables in src/index.css

```css
@layer base {
  :root {
    /* Semantic color labels - map to existing Tailwind colors */
    --color-info: #3b82f6; /* blue-500 */
    --color-success: #10b981; /* emerald-500 */
    --color-warning: #f59e0b; /* amber-500 */
    --color-danger: #f43f5e; /* rose-500 */
    --color-neutral: #64748b; /* slate-500 */
  }
}
```

#### Step 2: Update tailwind.config.js (optional - extend for consistency)

```js
export default {
  theme: {
    extend: {
      colors: {
        // Use semantic names that map to existing colors
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#f43f5e',
        neutral: '#64748b',
      },
    },
  },
};
```

#### Step 3: Update DashboardTrends.tsx

```tsx
// OLD - hardcoded hex:
const STATUS_COLORS: Record<string, string> = {
  PENDING: '#3b82f6',
  DELIVERED: '#10b981',
  // ...
};

// NEW - use CSS variable labels:
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'var(--color-info)',
  IN_ROUTE: 'var(--color-info)',
  DELIVERED: 'var(--color-success)',
  DELAYED: 'var(--color-warning)',
  FAILED: 'var(--color-danger)',
};

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: 'var(--color-danger)',
  HIGH: 'var(--color-warning)',
  NORMAL: 'var(--color-info)',
  LOW: 'var(--color-neutral)',
};

const CHART_COLORS = {
  predicted: 'var(--color-neutral)',
  delivered: 'var(--color-success)',
};
```

### Why This Approach

- Uses existing Tailwind colors from DESIGN_SYSTEM.md
- Semantic labels: `var(--color-success)` instead of hardcoded hex
- Change color in one place (`src/index.css`), entire app updates
- Recharts can use `var(--...)` strings

---

## 2. Fix PieChart Label/Legend Bug

### Problem

[`DashboardTrends.tsx`](src/features/dashboard/components/DashboardTrends.tsx:226-228) uses `name` from PieLabelRenderProps, but data has `status/count/percentage`.

### Solution

```tsx
// Line 226 - fix label function to use status key
label={({ status, percent }: PieLabelRenderProps) =>
  `${getStatusLabel(status || '')}: ${((percent || 0) * 100).toFixed(0)}%`
}
```

### Key Changes

- Use `status` key (from data) instead of `name`
- Apply `getStatusLabel()` for localized display
- Add fallback for undefined status

---

## 3. Translate Period Filter to PT-BR

### File

[`DashboardPeriodFilter.tsx`](src/features/dashboard/components/DashboardPeriodFilter.tsx)

### Changes

```tsx
const periodLabels: Record<DashboardPeriod, string> = {
  today: 'Hoje',
  '7d': '7 dias',
  '14d': '14 dias',
  '30d': '30 dias',
};

// Line 22 - label text
<label htmlFor='dashboard-period-filter' className='text-sm font-medium text-slate-300'>
  Período
</label>;
```

---

## 4. Fix FailedDeliveries Sorting

### File

[`dashboardService.ts`](src/features/dashboard/services/dashboardService.ts:198-219)

### Problem

`failedDeliveries` is not sorted by `last_event_at` descending.

### Solution

Add sorting after mapping (around line 218):

```tsx
const failedDeliveries: DashboardData['failedDeliveries'] = allDeliveries
  .filter((d) => d.status === 'FAILED' || d.status === 'DELAYED')
  .map((d) => {
    /* ... existing mapping ... */
  })
  // ADD SORT HERE:
  .sort((a, b) => new Date(b.last_event_at).getTime() - new Date(a.last_event_at).getTime())
  .slice(0, 8);
```

---

## 5. Documentation

### File

[`docs/kilo/DASHBOARD.md`](docs/kilo/DASHBOARD.md)

### Updates Required

#### Colors Section

```markdown
## Cores do Sistema

Cores definidas em `src/index.css` (CSS variables):

| Label             | Valor   | Uso                       |
| ----------------- | ------- | ------------------------- |
| `--color-info`    | #3b82f6 | PENDING, IN_ROUTE, NORMAL |
| `--color-success` | #10b981 | DELIVERED                 |
| `--color-warning` | #f59e0b | DELAYED, HIGH             |
| `--color-danger`  | #f43f5e | FAILED, URGENT            |
| `--color-neutral` | #64748b | LOW, charts               |

> Mapeado para cores existentes do Tailwind (DESIGN_SYSTEM.md).
> Altere o valor da variável para atualizar em todo o app.
```

#### Calculations Section

```markdown
## Cálculos

### delivered_at Inference

- Busca último evento com status === 'DELIVERED' na timeline
- Se não existir, a entrega NÃO entra em métricas temporais
```

#### Failed Deliveries Sorting

```markdown
### Falhas Recentes

- Ordenação: last_event_at DESC (mais recente primeiro)
```

---

## File Summary

| File                                                          | Changes                                     |
| ------------------------------------------------------------- | ------------------------------------------- |
| `tailwind.config.js`                                          | Optional: extend with semantic color names  |
| `src/index.css`                                               | Add CSS variables for semantic color labels |
| `src/features/dashboard/components/DashboardTrends.tsx`       | Use CSS var labels, fix PieChart label      |
| `src/features/dashboard/components/DashboardPeriodFilter.tsx` | PT-BR translations                          |
| `src/features/dashboard/services/dashboardService.ts`         | Sort failedDeliveries by last_event_at      |
| `docs/kilo/DASHBOARD.md`                                      | Update documentation                        |

---

## Verification Checklist

- [ ] Charts use semantic color labels (not hardcoded hex)
- [ ] Colors map to existing Tailwind colors (info, success, warning, danger, neutral)
- [ ] One place to change colors (src/index.css CSS vars)
- [ ] PieChart labels show correct status names
- [ ] Period filter shows PT-BR labels
- [ ] Failed deliveries sorted by most recent event
- [ ] No new dependencies added
- [ ] Recharts still used
- [ ] Documentation updated
