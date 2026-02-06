# KILO MASTER DIRECTIVE — Delivery Monitoring Dashboard

## Contexto do Projeto

Este projeto é um dashboard web para monitoramento de entregas logísticas,
desenvolvido como desafio técnico frontend.

Características principais:

- React 18 + Vite + TypeScript (strict)
- Tailwind CSS
- TanStack React Query para cache e estado de servidor
- Testes unitários e E2E obrigatórios
- API mock bem definida (OpenAPI fornecido)
- Tempo de execução limitado (priorizar simplicidade e clareza)

## Objetivo do Agente

Auxiliar no desenvolvimento do projeto respeitando rigorosamente:

- arquitetura definida
- padrões de código
- consistência visual
- separação de responsabilidades
- foco em entrega sólida e funcional

O agente NÃO deve reinventar padrões nem adicionar complexidade desnecessária.

## Como o Agente Deve Atuar

Antes de implementar qualquer tarefa:

1. Identificar o domínio afetado (auth, deliveries, dashboard, shared, infra).
2. Consultar os documentos abaixo.
3. Seguir as regras sem exceções.

## Documentos de Referência (OBRIGATÓRIO)

- Arquitetura: `docs/kilo/ARCHITECTURE.md`
- Ferramentas e padrões: `docs/kilo/TOOLS_AND_PATTERNS.md`
- UX/UI e Atomic Design: `docs/kilo/UX_UI_AND_ATOMIC.md`
- Design System: `docs/kilo/DESIGN_SYSTEM.md`
- Fluxos do Produto: `docs/kilo/FLOWS.md`
- Testes e Qualidade: `docs/kilo/TESTING.md`

## Regras Invioláveis

- NÃO usar Zod ou validação por schema.
- NÃO criar abstrações genéricas excessivas.
- NÃO misturar regra de negócio com UI.
- Qualquer função agnóstica deve ter teste unitário.
- Reutilizar componentes do `shared` antes de criar novos.
- Priorizar clareza e previsibilidade sobre “arquitetura perfeita”.
