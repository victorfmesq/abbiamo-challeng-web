# Testes e Qualidade

## Regra de Ouro

Toda função agnóstica deve ter teste unitário.

## Unit (Vitest)

Testar:

- domain/\*
- shared/utils/\*
- helpers de status e prioridade

## UI

- Componentes críticos (FilterBar, BulkActionsBar)

## E2E (Playwright)

Fluxos mínimos:

1. abrir app
2. listar entregas
3. executar ação em massa

## Objetivo dos Testes

- Garantir confiança
- NÃO buscar cobertura máxima
