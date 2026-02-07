# UX/UI e Atomic Design

> 📘 **Verificar [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** para paleta de cores, tema dark mode e componentes compartilhados obrigatórios.

## Atomic Design

- Atoms: Button, Input, Badge, Spinner
- Molecules: Field, SearchInput, StatusBadge
- Organisms: FilterBar, Table, BulkActionsBar

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
