Este documento é NORMATIVO.

Qualquer código gerado por IA que viole estas regras
deve ser considerado incorreto e incompleto.

Este documento define os critérios mínimos de qualidade
esperados em qualquer implementação gerada por IA.

Código sem testes quando exigidos deve ser considerado incompleto.

# Testes e Qualidade

## Regra de Ouro

Toda função agnóstica deve ter teste unitário.

Funções puras, helpers de domínio e lógica de negócio
DEVEM possuir testes unitários.

## Organização dos Testes

### Diretório `src/__tests__/`

Os testes são organizados em `src/__tests__/` espelhando o path do código testado.

```
src/
├── __tests__/
│   ├── app/router/AppRouter.test.tsx      # teste de AppRouter
│   ├── features/deliveries/
│   │   ├── components/DeliveriesTable.test.tsx    # teste do componente de tabela com seleção
│   │   └── domain/deliveriesFilters.test.ts
├── app/router/AppRouter.tsx
└── features/deliveries/
    ├── components/DeliveriesTable.tsx
    └── domain/deliveriesFilters.ts
```

**Regras:**

- Usar alias `@/...` nos imports (ex: `@/features/auth/hooks/useAuth`)
- NÃO usar caminhos relativos nos imports de código fonte
- Manter a estrutura de pastas espelhando o código testado

### Arquivos de teste na mesma pasta (legado)

Arquivos de teste existentes na mesma pasta do código (ex: `src/App.test.tsx`) são permitidos
para testes simples de componentes ou arquivos já existentes, mas novos testes DEVEM seguir
o padrão `src/__tests__/`.

Este documento é NORMATIVO.

Qualquer código gerado por IA que viole estas regras
deve ser considerado incorreto e incompleto.

## Unit (Vitest)

Testar:

- domain/\*
- shared/utils/\*
- helpers de status e prioridade

## UI

- Componentes críticos:
  - [`DeliveriesTable`](src/__tests__/features/deliveries/components/DeliveriesTable.test.tsx) — seleção múltipla, checkbox states, interação de linha
  - FilterBar, BulkActionsBar

## E2E (Playwright)

Fluxos mínimos:

1. abrir app
2. listar entregas
3. executar ação em massa

## Objetivo dos Testes

- Garantir confiança
- NÃO buscar cobertura máxima
