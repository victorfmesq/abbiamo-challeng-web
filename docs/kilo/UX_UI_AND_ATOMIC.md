# UX/UI e Atomic Design

> 📘 **Verificar [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** para paleta de cores, tema dark mode e componentes compartilhados obrigatórios.

## Atomic Design

- Atoms: Button, Input, Badge, Checkbox, Spinner
- Molecules: Field, SearchInput, StatusBadge, DeliveryDateFilter, MetricCard, DashboardPeriodFilter
- Organisms: FilterBar, Table, BulkActionsBar, DeliveriesFilterBar, DashboardKpis, DashboardActionTables, DashboardTrends

## Heurísticas de Reuso

Antes de criar algo novo:

1. Existe no shared?
2. Dá pra compor?
3. É específico da feature?

## UX Obrigatório

- Loading state visível
- Empty state claro
- Error state explícito
- Ações em massa só aparecem quando há seleção
- **Todos os elementos com `onClick` devem ter `hover:cursor-pointer`**

## Acessibilidade Básica

- Labels em inputs
- aria-label em botões de ícone
- foco visível

---

## Normativas de Responsividade

As seguintes regras são **OBRIGATÓRIAS** para todas as implementações de UI:

### 1. Mobile-First

- Desenvolver primeiro para dispositivos móveis (telas pequenas)
- Usar breakpoints do Tailwind (`sm:`, `md:`, `lg:`, `xl:`) para adaptar a telas maiores
- Garantir usabilidade em telas a partir de 320px de largura

### 2. Layout de Tabelas com Altura Controlada

**Todas as páginas com tabelas devem:**

- Usar container flex com `min-h-0` para permitir scroll interno
- A tabela deve ocupar todo o espaço disponível (`flex-1`)
- **NÃO pode ultrapassar a viewport** — usar `overflow-hidden` no container pai
- Header e filtros ficam no topo (fixos)
- Footer de paginação fica na parte inferior do conteúdo da página
- A área da tabela deve ter scroll interno vertical (`overflow-auto`)

## Dashboard Components

- MetricCard (molecule): card padrão para KPIs (label + value + hint)
- DashboardPeriodFilter (molecule): dropdown de período global
- DashboardKpis (organism): grid de KPIs principais
- DashboardActionTables (organism): tabelas curtas de ação
- DashboardTrends (organism): gráficos e distribuições

**Exemplo de estrutura:**

```tsx
<div className='flex min-h-0 flex-1 flex-col'>
  {' '}
  {/* Container principal */}
  <div className='shrink-0'>Header e filtros</div> {/* Fixos no topo */}
  <Card className='flex min-h-0 flex-1 flex-col overflow-hidden'>
    <div className='overflow-auto'>Tabela com scroll interno</div>
    <TablePagination /> {/* Footer fixo na parte inferior */}
  </Card>
</div>
```

### 3. Footer de Paginação Responsivo

**O componente [`TablePagination`](src/shared/components/TablePagination.tsx) deve:**

- Exibir: "Página X de Y" e total de itens (ex: "1–10 de 50")
- Incluir seletor de limite por página: 10, 20, 50 itens
- Botões de navegação: Anterior / Próximo
- **Mobile:** Usar layout empilhado (`flex-col`, `flex-wrap`)
- **Desktop:** Usar layout em linha (`sm:flex-row`)
- Quando o limite mudar, resetar para página 1 e refazer fetch
- Nunca causar overflow horizontal — usar `flex-wrap` para quebrar linhas

### 4. Filtros Responsivos

**Componente FilterBar deve:**

- Mobile: Empilhado (`flex-col`, `gap-4`)
- Desktop: Em linha (`sm:flex-row`, `sm:items-center`)
- Usar `w-full` em mobile, larguras fixas ou percentuais em desktop

### 5. Regras Gerais de Não-Ultrapassar Viewport

- **NUNCA** usar `height: 100vh` em elementos internos
- **NUNCA** permitir scroll duplo (page + inner scroll)
- Usar `min-h-0` em containers flex para permitir que children shring
- Em doubt, preferir `overflow-hidden` no container pai e `overflow-auto` no child

### 6. Componentes Table Obrigatórios

**Usar sempre os componentes de [`Table`](src/shared/components/Table.tsx):**

- `Table` — Container wrapper
- `Thead` — Cabeçalho
- `Tbody` — Corpo
- `Tr` — Linha
- `Th` — Célula de cabeçalho
- `Td` — Célula de dados
- `TablePagination` — Footer de paginação (genérico, reutilizável)
- `TableWithPagination` — Container completo com pagination

---

## Hierarquia de Layout por Página

```
┌─────────────────────────────────────┐
│  Page Container (flex flex-col)     │
│  ├─ Header (shrink-0)              │
│  ├─ Filters (shrink-0)              │
│  └─ Table Container (flex-1)       │
│      └─ Card (overflow-hidden)      │
│          ├─ Table Scroll Area       │
│          └─ Pagination Footer       │
└─────────────────────────────────────┘
```

---

## Contrato de Layout (Flexbox Default)

**Regra:** Flexbox é o padrão mental de layout do projeto.

- **Layout de página:** `flex`
- **Cards/containers:** `flex`
- **Scroll/viewport:** `flex + min-h-0 + overflow-*`

### Por quê?

- Flexbox oferece comportamento previsível para layouts verticais
- `min-h-0` permite que containers flexíveis shrinkage corretamente
- Evita overflow acidental em containers aninhados

---

## Scroll Controlado (`min-h-0` + `overflow`)

**Regra:** Scroll sempre controlado, sem overflow acidental.

- Containers com conteúdo rolável devem ter `min-h-0` E `overflow-auto`/`overflow-y-auto`
- Evitar `overflow-hidden` fora do necessário
- Remover `overflow-*` de wrappers intermediários que não são donos do scroll

### Estrutura Padrão de Página com Scroll

```tsx
<div className='min-h-dvh flex flex-col'>
  {' '}
  {/* Root */}
  <header className='shrink-0'>...</header> {/* Header fixo */}
  <main className='flex-1 min-h-0 flex flex-col'>
    {' '}
    {/* Main */}
    <div className='flex-1 min-h-0 overflow-auto'>
      {' '}
      {/* Scroll viewport */}
      {/* Conteúdo rolável */}
    </div>
  </main>
</div>
```

### Por quê?

- `min-h-0` em ancestors flex é obrigatório para permitir scroll interno
- `overflow-auto` no container correto previne scroll duplo (page + inner)
- Header/footer ficam fixos enquanto conteúdo rola

---

## Tabelas Semânticas: `<table>` Puro

**Regra:** Tabelas de dados usam `<table>` semântico puro.

- **NÃO usar** `flex`/`grid` para estruturar linhas/colunas de dados tabulares
- Flexbox fica **fora** da tabela (shell, card, viewport, toolbar, paginação)
- Componentes Table: `Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td`

### Estrutura Correta

```tsx
<Card className='flex flex-col min-h-0 overflow-hidden'>
  <div className='flex-1 min-h-0 overflow-auto'>
    <Table>
      <Thead>
        <Tr>
          <Th>...</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>...</Td>
        </Tr>
      </Tbody>
    </Table>
  </div>
  <TablePagination />
</Card>
```

## Sticky Header em Tabelas

**Regra:** O header da tabela deve permanecer fixo durante o scroll.

### Implementação Correta

```tsx
// Table.tsx - Th component (sticky classes aqui)
<Th className='sticky top-0 z-10 bg-slate-800 shadow-sm ...'>Coluna</Th>
```

### How to Apply (Wrapper + Table + Sticky TH)

```tsx
// Página completa com sticky header
<div className='flex flex-col flex-1 min-h-0'>
  {/* Toolbar/Filters (shrink-0) */}

  {/* Table Container */}
  <Card className='flex flex-col min-h-0 overflow-hidden'>
    {/* Scroll wrapper - È O DONO DO SCROLL (overflow-auto) */}
    <div className='overflow-auto min-h-0 flex-1'>
      {/* Table SEM wrapper div com overflow - para sticky funcionar */}
      <Table>
        <Thead>
          <Tr>
            {/* Sticky TH - mais robusto que sticky Thead */}
            <Th className='sticky top-0 z-10 bg-slate-800 shadow-sm'>Coluna 1</Th>
            <Th className='sticky top-0 z-10 bg-slate-800 shadow-sm'>Coluna 2</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>...</Td>
          </Tr>
        </Tbody>
      </Table>
    </div>

    {/* Pagination (fora do scroll) */}
    <TablePagination />
  </Card>
</div>
```

### Classes Essenciais no `Th`

| Classe         | Propósito                                         |
| -------------- | ------------------------------------------------- |
| `sticky`       | Habilita posicionamento sticky                    |
| `top-0`        | Distância do topo do scroll container             |
| `z-10`         | Garante que fique acima do conteúdo               |
| `bg-slate-800` | Fundo(opaque) para não "vazar" conteúdo por baixo |
| `shadow-sm`    | Separador visual do conteúdo                      |

### Por quê?

- **CRÍTICO:** NÃO colocar `overflow-auto` em wrapper dentro da `<Table>` - isso quebra sticky
- O scroll wrapper deve estar FORA da `<table>`, envolvendo-a diretamente
- Sticky no `th` é mais robusto que no `thead`
- Cada célula sticka independentemente
- Bordas e backgrounds funcionam corretamente

### Checklist de Validação

- [ ] Scroll rola somente no container esperado
- [ ] Header permanece fixo durante scroll
- [ ] Sem jitter ou "sumir" do header
- [ ] Background do header cobre conteúdo que passa por baixo
- [ ] Mobile: tabela rola horizontal se necessário (`overflow-x-auto`)
- [ ] Paginação fica fora do scroll (ou dentro se for requisito)

---

## Seleção em Tabelas (Checkbox)

**Regra:** Tabelas com ações em massa devem ter checkbox para seleção de linhas.

### Estrutura de Seleção

```tsx
// Estado no componente pai (page)
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

// Props passadas para a tabela
interface TableProps {
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}
```

### Checkbox com 3 Estados

| Estado    | Visual           | Prop `state` | Quando usar                                     |
| --------- | ---------------- | ------------ | ----------------------------------------------- |
| `none`    | ☑️ vazio         | `'none'`     | Nenhuma linha selecionada                       |
| `partial` | ☐ com traço (-)  | `'partial'`  | Pelo menos uma linha selecionada, mas não todas |
| `full`    | ☑️ com ✓ (check) | `'full'`     | Todas as linhas da página atual selecionadas    |

**Interface do componente:**

```tsx
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  state?: 'none' | 'partial' | 'full';
  label?: string;
  indeterminate?: boolean;
}
```

### "Selecionar Todos" - Comportamento

**Regra de negócio:**

- **Clique em "Selecionar todos" quando nenhuma linha da página atual está selecionada:**
  → Seleciona TODOS os registros visíveis na página

- **Clique em "Selecionar todos" quando AO MENOS uma linha da página atual está selecionada:**
  → Desseleciona TODOS os registros (clear all)

**Por quê essa decisão?**

1. **Simplicidade:** Evita estados ambíguos entre páginas
2. **Previsibilidade:** O usuário sempre sabe o que vai acontecer
3. **Performance:** Não requer carregar todos os registros para seleção total
4. **UX consistente:** Funciona igual em paginação, filtros e ordenação

### Implementação

```tsx
// Componente pai (page)
const handleToggleSelectAll = () => {
  const currentPageIds = data?.data.map((d) => d.id) || [];
  const allSelected = currentPageIds.every((id) => selectedIds.has(id));

  if (allSelected) {
    // Deselect all from current page
    setSelectedIds((prev) => {
      const next = new Set(prev);
      currentPageIds.forEach((id) => next.delete(id));
      return next;
    });
  } else {
    // Select all from current page
    setSelectedIds((prev) => {
      const next = new Set(prev);
      currentPageIds.forEach((id) => next.add(id));
      return next;
    });
  }
};

// Determinar estado do checkbox
const selectAllState = useMemo(() => {
  if (currentPageIds.length === 0) return 'none';
  const allSelected = currentPageIds.every((id) => selectedIds.has(id));
  const someSelected = currentPageIds.some((id) => selectedIds.has(id));
  if (allSelected) return 'full';
  if (someSelected) return 'partial';
  return 'none';
}, [data?.data, selectedIds]);
```

### Toolbar de Seleção

```tsx
<div className='flex items-center justify-between p-4 border-b border-slate-700 shrink-0'>
  <div className='flex items-center gap-3'>
    <Checkbox state={selectAllState} onChange={handleToggleSelectAll} label='Selecionar tudo' />
    {selectedIds.size > 0 && <Badge variant='info'>{selectedIds.size} selecionado(s)</Badge>}
  </div>
  {/* Bulk actions aqui quando houver seleção */}
</div>
```

### Checkbox na Linha

```tsx
<Td onClick={(e) => e.stopPropagation()}>
  <Checkbox
    state={isSelected ? 'full' : 'none'}
    onChange={() => onToggleSelect(delivery.id)}
    aria-label={`Selecionar entrega ${delivery.tracking_code}`}
  />
</Td>
```

> **Nota:** Usar `state` com `'full'`/`'none'` em vez de `checked` para consistência com o checkbox de "Selecionar todos".

### Regras de UI

- `e.stopPropagation()` no checkbox da linha evita clique na linha
- `aria-label` descritivo para acessibilidade
- Contador de selecionados visível (Badge) acima da tabela
- Toolbar com ações em massa aparece só quando há seleção (ou sempre visível, conforme UX)

### Checklist de Validação

- [ ] Checkbox marca/desmarca corretamente
- [ ] "Selecionar todos" funciona conforme regra de negócio
- [ ] Estado visual (full/partial/none) está correto
- [ ] Contador mostra número correto
- [ ] Acessibilidade (aria-label) presente
- [ ] Paginação: seleção persiste entre páginas?
- [ ] Filtros: seleção é mantida ou limpada?

---

## DeliveryDateFilter (Filtro de Data/Período)

**Arquivo:** [`src/features/deliveries/components/DeliveryDateFilter.tsx`](src/features/deliveries/components/DeliveryDateFilter.tsx)

### Visão Geral

Componente Molecule para filtragem de entregas por data de previsão de entrega (`expected_delivery_at`).

### Interface

```tsx
export interface DeliveryDateFilterValue {
  dateFrom?: string;
  dateTo?: string;
  quickFilter?: 'today' | 'tomorrow' | 'thisWeek' | 'overdue' | null;
}

export interface DeliveryDateFilterProps {
  value: DeliveryDateFilterValue;
  onChange: (value: DeliveryDateFilterValue) => void;
  className?: string;
}
```

### Funcionalidades

| Funcionalidade         | Descrição                                     |
| ---------------------- | --------------------------------------------- |
| **Data única**         | Filtra por dia específico (dateFrom = dateTo) |
| **Intervalo de datas** | dateFrom e dateTo para range                  |
| **Quick Filters**      | Chips para seleção rápida                     |

### Quick Filters (Chips)

| Label       | Valor      | Descrição                                         |
| ----------- | ---------- | ------------------------------------------------- |
| Hoje        | `today`    | expected_delivery_at = hoje                       |
| Amanhã      | `tomorrow` | expected_delivery_at = amanhã                     |
| Esta semana | `thisWeek` | expected_delivery_at nesta semana                 |
| Atrasadas   | `overdue`  | expected_delivery_at < now && status != DELIVERED |

### Regras de Negócio

| Regra                | Comportamento                                             |
| -------------------- | --------------------------------------------------------- |
| Chip selecionado     | Limpa inputs de data manual                               |
| Data manual digitada | Limpa seleção de chip rápido                              |
| Limpar filtro        | Reseta dateFrom, dateTo e quickFilter para undefined/null |
| Mudança de filtro    | Reseta paginação para página 1 (implementado na page)     |

### UI/UX

```tsx
// Estrutura visual
<div className='flex flex-col gap-4'>
  {/* Quick Filter Chips */}
  <div className='flex flex-wrap gap-2'>
    {QUICK_FILTERS.map(...)}
  </div>

  {/* Date Range Inputs */}
  <div className='flex flex-col sm:flex-row gap-3 sm:items-end'>
    <Input id='dateFrom' type='date' />
    <Input id='dateTo' type='date' />
    {hasFilters && <Button variant='ghost' size='sm'>Limpar</Button>}
  </div>
</div>
```

### Responsividade

| Breakpoint       | Layout Chips      | Layout Inputs             |
| ---------------- | ----------------- | ------------------------- |
| Mobile (<640px)  | `flex-wrap gap-2` | `flex-col` empilhados     |
| Desktop (≥640px) | Em linha          | `sm:flex-row` lado a lado |

### Estados Visuais dos Chips

| Estado      | Classes                                                                  |
| ----------- | ------------------------------------------------------------------------ |
| **Ativo**   | `bg-indigo-600 text-white`                                               |
| **Inativo** | `bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700` |

### Acessibilidade

- `aria-pressed` nos chips para indicar estado ativo
- `htmlFor` e `id` nos labels dos inputs
- `type='button'` nos chips para evitar submit de form

### Integração com API

```tsx
// Params enviados para API
{
  dateFrom?: string;  // ISO date (YYYY-MM-DD)
  dateTo?: string;    // ISO date (YYYY-MM-DD)
}

// Quick filters são calculados no backend
// ou convertidos para dateFrom/dateTo no hook
```

### Arquivos Relacionados

| Arquivo                                                                                                                                                  | Propósito                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| [`src/features/deliveries/domain/deliveriesFilters.ts`](src/features/deliveries/domain/deliveriesFilters.ts)                                             | Tipos e normalização de filtros |
| [`src/__tests__/features/deliveries/components/DeliveriesFilterBar.test.tsx`](src/__tests__/features/deliveries/components/DeliveriesFilterBar.test.tsx) | Testes do componente            |
| [`src/features/deliveries/pages/DeliveriesListPage.tsx`](src/features/deliveries/pages/DeliveriesListPage.tsx)                                           | Página que integra o filtro     |
