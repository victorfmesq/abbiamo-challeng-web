# Fluxos do Produto

## Autenticação e Navegação

### Tratamento de Rotas Inexistentes

O sistema de rotas (`AppRouter`) trata rotas inexistentes de forma consistente:

- **Usuário NÃO autenticado + rota inexistente** → Redireciona para `/login`
- **Usuário autenticado + rota inexistente** → Redireciona para `/dashboard`

A decisão de redirecionamento considera:

- `isAuthenticated`: Determina o destino do redirecionamento

### Fluxo de Login

1. Usuário acessa `/login`
2. Se já autenticado → redirecionado para `/dashboard`
3. Após login bem-sucedido → redirecionado para página original ou `/dashboard`

### Proteção de Rotas

- Todas as rotas sob `/` são protegidas por `RequireAuth`
- Usuário não autenticado é redirecionado para `/login`

## Dashboard

- Consumir /deliveries/stats
- Exibir cards e gráficos
- Não recalcular métricas no front

## Listagem

- Consumir /deliveries
- Filtros por status, data e busca
- Paginação server-side
- Seleção múltipla + ações em massa

## Ações em Massa

- Reagendar
- Atribuir motorista
- Alterar prioridade
- Feedback parcial permitido

## Detalhe

- Consumir /deliveries/{id}
- Timeline vertical
- Dados completos do destinatário
