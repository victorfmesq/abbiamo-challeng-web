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
│   ├── App.test.tsx                          # teste do componente App
│   ├── app/router/AppRouter.test.tsx         # teste de AppRouter
│   ├── features/deliveries/
│   │   ├── components/DeliveriesTable.test.tsx    # teste do componente de tabela com seleção
│   │   └── domain/deliveriesFilters.test.ts
│   └── shared/utils/pagination.test.ts
```

**Regras:**

- Usar alias `@/...` nos imports (ex: `@/features/auth/hooks/useAuth`)
- NÃO usar caminhos relativos nos imports de código fonte
- Manter a estrutura de pastas espelhando o código testado

### Arquivos de teste na mesma pasta (legado)

> ⚠️ **REGRA: Todos os testes DEVEM estar em `src/__tests__/`**

Arquivos de teste existentes na mesma pasta do código são considerados **legado** e **devem ser migrados** para `src/__tests__/`.

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

### Estratégia

- Apenas o smoke test usa login real.
- Os demais testes usam mocks determinísticos via `page.route` para estabilidade em CI.

### Como rodar

```bash
npm run e2e
```

### Credenciais

O helper de login usa credenciais fixas definidas em [`e2e/helpers/auth.ts`](e2e/helpers/auth.ts:1), reutilizando as mesmas do teste anterior.

### Mocks e atualização de contratos

Specs atuais:

- [`e2e/auth.smoke.spec.ts`](e2e/auth.smoke.spec.ts:1) — login real
- [`e2e/deliveries.filters.spec.ts`](e2e/deliveries.filters.spec.ts:1) — mock via `page.route`
- [`e2e/deliveries.bulk-actions.spec.ts`](e2e/deliveries.bulk-actions.spec.ts:1) — mock via `page.route`

Os mocks vivem nos próprios specs E2E:

- [`e2e/deliveries.filters.spec.ts`](e2e/deliveries.filters.spec.ts:1)
- [`e2e/deliveries.bulk-actions.spec.ts`](e2e/deliveries.bulk-actions.spec.ts:1)

Cada interceptação tem comentário apontando a origem do endpoint no código. Se o contrato mudar, atualize o mock e o comentário conforme a nova origem (service/hook) do endpoint.

## Objetivo dos Testes

- Garantir confiança
- NÃO buscar cobertura máxima
