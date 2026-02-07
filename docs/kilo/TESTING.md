Este documento define os critérios mínimos de qualidade
esperados em qualquer implementação gerada por IA.

Código sem testes quando exigidos deve ser considerado incompleto.

# Testes e Qualidade

## Regra de Ouro

Toda função agnóstica deve ter teste unitário.

Funções puras, helpers de domínio e lógica de negócio
DEVEM possuir testes unitários.

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
