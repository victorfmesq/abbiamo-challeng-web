⚠️ ATIVAÇÃO OBRIGATÓRIA

Este arquivo é o ponto de entrada do projeto para agentes de IA.

Qualquer agente de IA que receba uma tarefa DEVE:

1. Ler este arquivo primeiro
2. Seguir todas as regras aqui descritas
3. Consultar os documentos aqui referenciados antes de escrever código

Se este arquivo não for explicitamente referenciado no prompt,
as regras aqui contidas NÃO são consideradas carregadas.

⚠️ FONTE DE VERDADE DO PROJETO

Este diretório (docs/kilo) define os padrões globais, decisões
arquiteturais e restrições deste projeto.

Este conteúdo existe PRIMARIAMENTE para orientar agentes de IA
(stateless) utilizados no desenvolvimento.

Nenhuma decisão arquitetural, estrutural ou de stack
deve ser tomada fora do que está documentado aqui.

## Como esta documentação deve ser usada por agentes de IA

Antes de qualquer implementação, o agente DEVE:

1. Ler este arquivo (KILO_MASTER.md)
2. Identificar quais documentos adicionais são relevantes para a tarefa
3. Consultar explicitamente esses documentos antes de escrever código

Esta documentação deve ser tratada como um "filesystem mental"
do projeto. Se algo não estiver aqui, o agente NÃO deve inventar.

# KILO MASTER DIRECTIVE — Delivery Monitoring Dashboard

## Modo Stateless e Limite de Tokens

Os agentes utilizados neste projeto:

- não mantêm memória entre sessões
- possuem limite de tokens
- não inferem contexto implícito

Portanto:

- A documentação NUNCA será reenviada inteira no prompt
- O agente deve ser instruído a consultá-la via referência
- Qualquer implementação deve assumir que esta é a única fonte de verdade

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

- Modo de Operação: `docs/kilo/AI_OPERATION_MODE.md`
- Arquitetura: `docs/kilo/ARCHITECTURE.md`
- Ferramentas e padrões: `docs/kilo/TOOLS_AND_PATTERNS.md`
- UX/UI e Atomic Design: `docs/kilo/UX_UI_AND_ATOMIC.md`
- Design System: `docs/kilo/DESIGN_SYSTEM.md`
- Fluxos do Produto: `docs/kilo/FLOWS.md`
- Testes e Qualidade: `docs/kilo/TESTING.md`
- Dashboards: `docs/kilo/DASHBOARD.md`

## Regras Invioláveis

- NÃO usar Zod ou validação por schema.
- NÃO criar abstrações genéricas excessivas.
- NÃO misturar regra de negócio com UI.
- Qualquer função agnóstica deve ter teste unitário.
- Reutilizar componentes do `shared` antes de criar novos.
- Priorizar clareza e previsibilidade sobre "arquitetura perfeita".

## Ativação da Documentação (uso obrigatório em prompts)

Todo novo chat com um agente de IA DEVE iniciar com um prompt
que aponte explicitamente para este diretório (docs/kilo)
e para este arquivo (KILO_MASTER.md).

**Prompt de ativação obrigatório:**

```
Use o projeto conforme definido em docs/kilo/KILO_MASTER.md.
Implemente a tarefa abaixo seguindo estritamente essas regras.
```

Sem isso, esta documentação não é considerada carregada.
