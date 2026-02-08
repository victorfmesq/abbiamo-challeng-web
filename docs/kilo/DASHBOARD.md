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
- Atrasadas (expected_delivery_at < now && status != DELIVERED)

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

### 4) Tendências e distribuições

Gráficos:

- Tendência: Previstas vs Concluídas (por dia)
  - Previstas: agrupado por dia de expected_delivery_at
  - Concluídas: agrupado por dia (status = DELIVERED)
  - Nota: se não existir "delivered_at", o agrupamento de concluídas pode ser por "expected_delivery_at"
- Distribuição por status (donut/barras)
- (Opcional) Distribuição por prioridade
- Fonte primária: timeline[].status === DELIVERED → timestamp
- delivered_at é inferido a partir do último evento DELIVERED
- Entregas sem evento DELIVERED não entram no cálculo temporal

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
