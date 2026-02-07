# Ferramentas e Padrões

## Stack Definida

- React 18
- Vite
- TypeScript strict
- Tailwind CSS
- TanStack React Query
- React Hook Form (sem Zod)
- Vitest + Testing Library
- Playwright (E2E)

## React Query — Uso Correto

- Usar hooks específicos por feature:
  - useDeliveries()
  - useDeliveryStats()
- Query keys devem ser arrays estáveis.
- Mutations devem invalidar queries relacionadas.
- NÃO esconder React Query atrás de abstrações genéricas.

## TypeScript

- Sem `any`.
- Interfaces claras para DTOs.
- Enums da API mapeados para labels no front.

## Código

- Componentes pequenos.
- Hooks focados.
- Funções puras para regra.
- Imports via alias.
- Services de feature chamam api.request(...) diretamente.
- Proibido criar createHttpClient dentro de feature.
- authService apenas chama /auth/login e NÃO gerencia token (token é infra).

## Anti-patterns

- Hooks “faz tudo”.
- Utils que conhecem domínio.
- Wrapper genérico de fetch dentro de feature.

## Proibições Explícitas

É proibido ao agente:

- Criar múltiplas instâncias de HTTP client
- Criar validação por schema (Zod, Yup, etc.)
- Criar abstrações genéricas não documentadas
- Introduzir novas bibliotecas sem instrução explícita
- Criar state management adicional
