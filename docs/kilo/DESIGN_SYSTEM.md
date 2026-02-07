# Design System

> ⚠️ **DARK MODE FIRST** — Este projeto NÃO possui light mode. Todas as decisões de design devem priorizar ambientes escuros.

## Filosofia

- Visual corporativo
- Legibilidade > estética
- Cores com semântica clara
- Dark mode como padrão absoluto

## Tema

### Modo de Exibição

- **Dark Mode Only** — Não implementar light mode
- Usar `text-slate-100` para texto principal
- Usar `text-slate-400` para texto secundário

## Paleta Base (Tailwind)

### Backgrounds

- App Background: `bg-slate-950`
- Surface (cards, modals): `bg-slate-900`
- Surface Hover: `bg-slate-800`
- Border: `border-slate-700`

### Cores de Interface

- Primary: `indigo` (índigo-500 a indigo-600)
- Secondary: `sky` (sky-500)
- Success: `emerald` (emerald-500)
- Warning: `amber` (amber-500)
- Danger: `rose` (rose-500)
- Info: `blue` (blue-500)

### Cores de Texto

- Primary: `text-slate-100`
- Secondary: `text-slate-400`
- Muted: `text-slate-500`

## Status de Entrega

- PENDING → info (`blue`)
- IN_ROUTE → info (`blue`)
- DELIVERED → success (`emerald`)
- DELAYED → warning (`amber`)
- FAILED → danger (`rose`)

## Componentes Compartilhados Obrigatórios

### Atoms

- [`Button`](src/shared/components/Button.tsx) — primary | secondary | ghost | destructive
- [`Input`](src/shared/components/Input.tsx)
- [`Badge`](src/shared/components/Badge.tsx) — por status
- [`Checkbox`](src/shared/components/Checkbox.tsx) — com suporte a estados 'none' | 'partial' | 'full'
- [`Spinner`](src/shared/components/Spinner.tsx)
- [`Alert`](src/shared/components/Alert.tsx)

### Molecules

- [`Field`](src/shared/components/Field.tsx) — wrapper com label e input
- [`SearchInput`](src/shared/components/SearchInput.tsx)
- [`StatusBadge`](src/shared/components/StatusBadge.tsx)
- [`ConfirmDialog`](src/shared/components/ConfirmDialog.tsx)

### Organisms

- [`Table`](src/shared/components/Table.tsx)
- [`FilterBar`](src/shared/components/FilterBar.tsx)
- [`BulkActionsBar`](src/shared/components/BulkActionsBar.tsx)
- [`PageHeader`](src/shared/components/PageHeader.tsx)

## Card Padrão

- `rounded-xl`
- `shadow-sm`
- `bg-slate-900`
- `border border-slate-700`
