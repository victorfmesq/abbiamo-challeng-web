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

- [`DataTableWithLayout`](src/shared/components/DataTableWithLayout.tsx) — Tabela completa com toolbar, paginação e estados (padrão do sistema)
- [`DataTable`](src/shared/components/DataTable.tsx) — Componente base da tabela (uso interno)
- [`Table`](src/shared/components/Table.tsx) — Componentes low-level da tabela (Thead, Tbody, Tr, Th, Td)
- [`FilterBar`](src/shared/components/FilterBar.tsx)
- [`BulkActionsBar`](src/shared/components/BulkActionsBar.tsx)
- [`PageHeader`](src/shared/components/PageHeader.tsx)

## Tabela Padrão do Sistema

Para todas as tabelas do sistema, utilize **obrigatoriamente** o componente `DataTableWithLayout`. Ele já inclui:

- Toolbar com checkbox de "selecionar tudo" e contagem de itens selecionados
- Tabela com scroll interno
- Footer com paginação
- Estados de loading e erro

### Exemplo de Uso

```tsx
const columns: DataTableColumn<MyData>[] = [
  { key: 'id', header: 'ID', width: '80px' },
  { key: 'name', header: 'Nome' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <Badge variant={row.status}>{row.status}</Badge>,
  },
];

<DataTableWithLayout
  data={data}
  columns={columns}
  selectedIds={selectedIds}
  onToggleSelect={handleSelect}
  selectAllState={selectAllState}
  onToggleSelectAll={handleSelectAll}
  selectedCount={selectedIds.size}
  pagination={meta}
  isLoading={isLoading}
  onPageChange={handlePageChange}
  onLimitChange={handleLimitChange}
/>;
```

### Actions Column

Para adicionar coluna de ações:

```tsx
const actions: DataTableAction<MyData>[] = [
  {
    key: 'view',
    variant: 'ghost',
    label: 'Ver',
    icon: <EyeIcon />,
    onClick: (row) => navigate(`/details/${row.id}`),
    ariaLabel: 'Ver detalhes',
  },
  {
    key: 'edit',
    variant: 'ghost',
    label: 'Editar',
    icon: <PencilIcon />,
    onClick: (row) => openEdit(row),
    ariaLabel: 'Editar',
  },
];

<DataTableWithLayout
  data={data}
  columns={columns}
  actions={{ header: 'Ações', actions }}
  // ...outros props
/>;
```

## Card Padrão

- `rounded-xl`
- `shadow-sm`
- `bg-slate-900`
- `border border-slate-700`
