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
- **Filtros:**
  - Status (dropdown)
  - Busca por código de rastreio
  - **Data/Período** (novo):
    - Campo base: `expected_delivery_at`
    - Quick filters: Hoje, Amanhã, Esta semana, Atrasadas
    - Date range: De / Até
    - Mudança de filtro reseta paginação para página 1
- Paginação server-side
- **Seleção múltipla:** Checkbox por linha + "Selecionar tudo" com estados full/partial/none
- **Toolbar de seleção:** Badge com contador visível quando há itens selecionados
- Seleção persiste entre páginas (mantida via Set<string>)

## Filtro de Data/Período

### Quick Filters

| Opção       | Descrição                         | Condição                                          |
| ----------- | --------------------------------- | ------------------------------------------------- |
| Hoje        | Entregas com previsão para hoje   | expected_delivery_at = hoje                       |
| Amanhã      | Entregas com previsão para amanhã | expected_delivery_at = amanhã                     |
| Esta semana | Entregas desta semana             | expected_delivery_at entre segunda e domingo      |
| Atrasadas   | Entregas atrasadas                | expected_delivery_at < now && status != DELIVERED |

### Regras de Interação

1. **Quick filter → Data manual:** Quick filter é limpo ao digitar data
2. **Data manual → Quick filter:** Data é limpa ao selecionar quick filter
3. **Limpar:** Reseta todo o filtro de data
4. **Qualquer mudança:** Reseta paginação para página 1

### Query Params da API

```
GET /deliveries?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
```

- Quick filters são convertidos para dateFrom/dateTo no frontend antes da chamada

## Ações em Massa

- Reagendar
- Atribuir motorista
- Alterar prioridade
- Feedback parcial permitido

## Detalhe

- Consumir /deliveries/{id}
- Timeline vertical
- Dados completos do destinatário
