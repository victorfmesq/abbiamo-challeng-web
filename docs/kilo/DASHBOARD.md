# Dashboard

## Objetivo

O operador precisa de uma visão geral acionável das entregas, priorizando:

1. Situação atual (ação imediata)
2. Risco operacional
3. Tendências e distribuições (visão analítica)

## Layout (ordem da página)

### 1) KPIs principais (primeira dobra)

Cards (4):

- Total (no período)
- Em rota (status = IN_ROUTE)
- Concluídas (status = DELIVERED)
- Atrasadas (expected_delivery_at < now e delivered_at não inferido)

### 2) Risco operacional

Cards (3):

- % Atrasadas = overdue / total
- Atraso médio (apenas atrasadas) = avg(now - expected_delivery_at)
- Tentativas médias = avg(delivery_attempts)

### 3) Ações prioritárias

Tabelas curtas (até 8 itens):

- Atrasadas (mais críticas)
  - Ordenação: maior atraso → prioridade → status
  - CTA: abrir DeliveryDetailsModal
- Urgentes em rota
  - Filtro: priority in (URGENT, HIGH) AND status = IN_ROUTE
  - CTA: abrir DeliveryDetailsModal
- Falhas recentes
  - Filtro: status in (FAILED, DELAYED)
  - Ordenação: last_event_at desc (evento mais recente primeiro)
  - CTA: abrir DeliveryDetailsModal

### 4) Tendências e distribuições

Gráficos:

- Tendência: Previstas vs Concluídas (por dia)
  - Previstas: agrupado por dia de expected_delivery_at
  - Concluídas: agrupado por dia do delivered_at inferido (último evento timeline[].status === DELIVERED)
  - Entregas sem evento DELIVERED não contam como concluídas no gráfico
- Distribuição por status (donut/barras)
- (Opcional) Distribuição por prioridade

## Período do dashboard

Controle global (dropdown):

- Hoje
- 7 dias
- 14 dias
- 30 dias

O período afeta:

- KPIs
- Tabelas
- Gráficos

## Regras de interação

- Alterar período → refetch + mantém usuário na mesma página
- CTA "Ver detalhes" abre DeliveryDetailsModal sem navegar
- Estados:
  - Loading: skeleton/spinner por seção
  - Error: mensagem + botão "Tentar novamente"

## Cores do Sistema

Cores alinhadas com `docs/kilo/DESIGN_SYSTEM.md`:

| Status    | Hex     | Tailwind | Uso |
| --------- | ------- | -------- | ----- |
| PENDING   | #3b82f6 | blue-500 | Cards, Badges, Gráficos |
| IN_ROUTE  | #3b82f6 | blue-500 | Cards, Badges, Gráficos |
| DELIVERED | #10b981 | emerald-500 | Cards, Badges, Gráficos |
| DELAYED   | #f59e0b | amber-500 | Cards, Badges, Gráficos |
| FAILED    | #f43f5e | rose-500 | Cards, Badges, Gráficos |

| Prioridade | Hex     | Tailwind |
| ---------- | ------- | -------- |
| URGENT    | #f43f5e | rose-500 |
| HIGH      | #f59e0b | amber-500 |
| NORMAL    | #3b82f6 | blue-500 |
| LOW       | #64748b | slate-500 |

| Gráfico   | Hex     | Tailwind |
| --------- | ------- | -------- |
| Predicted | #64748b | slate-400 |
| Delivered | #10b981 | emerald-500 |

> Cores definidas diretamente no código (`DashboardTrends.tsx`) para compatibilidade com Recharts.

## Cálculos e Regras de Negócio

### delivered_at Inference

O campo `delivered_at` é **inferido** a partir da timeline:

1. Busca-se o **último evento** onde `timeline.status === 'DELIVERED'`
2. Usa-se o `timestamp` desse evento como `delivered_at`
3. Se **não existir** evento DELIVERED na timeline, a entrega:
   - NÃO é contada como "Concluída"
   - NÃO entra em métricas temporais (tendências)
   - NÃO entra no cálculo de % entregas concluídas

```typescript
function inferDeliveredAt(delivery: DeliveryDto): string | null {
  const deliveredEvent = delivery.timeline
    ?.filter((event) => event.status === 'DELIVERED')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  return deliveredEvent?.timestamp ?? null;
}
```

### Atraso (delay_hours)

- **Cálculo**: `now - expected_delivery_at` (em horas)
- **Condição**: apenas entregas com `status != DELIVERED` E `expected_delivery_at < now`
- **Valor mínimo**: 0 (usar `Math.max(0, diff)`)

### Tentativas Médias (averageAttempts)

- **Cálculo**: `sum(delivery_attempts) / count(all deliveries)`
- **Inclui**: todas as entregas do período (entregas e não-entregas)

## Componentes (UI)

- Organisms:
  - DashboardKpis
  - DashboardRiskCards
  - DashboardActionTables
  - DashboardTrends
- Molecules:
  - MetricCard
  - DashboardPeriodFilter
  - MiniTable
- Reuso:
  - DeliveryDetailsModal (já existente em deliveries)

## Fontes / Derivações (a partir de deliveries)

Campos utilizados:

- status
- expected_delivery_at
- delivery_attempts
- priority
- tracking_code
- recipient.name
- assigned_driver (se disponível)
- timeline (para inferência de delivered_at)
