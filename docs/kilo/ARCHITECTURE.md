# Arquitetura da Aplicação

## Princípios

- Simplicidade > abstração
- Coesão por domínio
- Infra global mínima
- Regra de negócio isolada de exibição

## Estrutura Oficial

src/
app/ # bootstrap, providers, router (quando existir)
features/ # domínios da aplicação
shared/ # componentes e utils reutilizáveis
services/ # APENAS infraestrutura (http client)
storage/ # wrappers genéricos de storage
tests/ # e2e, factories, setup

## Organização por Feature

Cada feature pode conter:

- pages/
- components/
- hooks/
- services/ → chamadas de API DAQUELA FEATURE
- domain/ → regras puras (sem React)
- types.ts

## Regras Importantes

- services/ global NÃO contém endpoints de domínio.
- domain/ NÃO depende de React, React Query ou browser APIs.
- shared NÃO depende de features.
- Feature pode depender de shared, nunca o inverso.

## Proibições

- Pastas “genéricas” sem dono.
- Lógica de filtro/agregação dentro de componentes visuais.
- Copiar componente do shared para “adaptar”.
