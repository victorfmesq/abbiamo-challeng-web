# E2E (Playwright)

## Estratégia

- Apenas o smoke test usa login real.
- Os demais testes usam mocks determinísticos via `page.route` para estabilidade em CI.

## Como rodar

```bash
npm run e2e
```

## Credenciais

O helper de login usa credenciais fixas definidas em [`e2e/helpers/auth.ts`](e2e/helpers/auth.ts:1), reutilizando as mesmas do teste anterior.

## Mocks e atualização de contratos

Specs atuais:

- [`e2e/auth.smoke.spec.ts`](e2e/auth.smoke.spec.ts:1) — login real
- [`e2e/deliveries.filters.spec.ts`](e2e/deliveries.filters.spec.ts:1) — mock via `page.route`
- [`e2e/deliveries.bulk-actions.spec.ts`](e2e/deliveries.bulk-actions.spec.ts:1) — mock via `page.route`

Os mocks vivem nos próprios specs E2E:

- [`e2e/deliveries.filters.spec.ts`](e2e/deliveries.filters.spec.ts:1)
- [`e2e/deliveries.bulk-actions.spec.ts`](e2e/deliveries.bulk-actions.spec.ts:1)

Cada interceptação tem comentário apontando a origem do endpoint no código. Se o contrato mudar, atualize o mock e o comentário conforme a nova origem (service/hook) do endpoint.
