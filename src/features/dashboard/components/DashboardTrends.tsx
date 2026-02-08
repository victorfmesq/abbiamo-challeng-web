import type { PieLabelRenderProps } from 'recharts';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Line,
  Bar,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent } from '@/shared/components/Card';

// ========================================
// Color Palette
// Uses Tailwind color values aligned with DESIGN_SYSTEM.md
// ========================================

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#3b82f6', // blue-500 / info
  IN_ROUTE: '#3b82f6', // blue-500 / info
  DELIVERED: '#10b981', // emerald-500 / success
  DELAYED: '#f59e0b', // amber-500 / warning
  FAILED: '#f43f5e', // rose-500 / danger
};

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: '#f43f5e', // rose-500
  HIGH: '#f59e0b', // amber-500
  NORMAL: '#3b82f6', // blue-500
  LOW: '#64748b', // slate-500
};

const CHART_COLORS = {
  predicted: '#64748b', // slate-400
  delivered: '#10b981', // emerald-500
};

export interface TrendDataPoint {
  date: string;
  predicted: number;
  delivered: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface PriorityDistribution {
  priority: string;
  count: number;
}

export interface DashboardTrendsProps {
  trendData: TrendDataPoint[];
  statusDistribution: StatusDistribution[];
  priorityDistribution?: PriorityDistribution[];
  isLoading?: boolean;
}

function LoadingSkeleton() {
  return (
    <div className='space-y-6 animate-pulse'>
      {/* Trend Chart Skeleton */}
      <div className='h-[300px] bg-slate-800 rounded-xl' />
      {/* Distribution Charts Skeleton */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='h-[250px] bg-slate-800 rounded-xl' />
        <div className='h-[250px] bg-slate-800 rounded-xl' />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4'>
        <svg
          className='w-8 h-8 text-slate-500'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
      </div>
      <h3 className='text-lg font-medium text-slate-300 mb-2'>
        Sem dados para o período selecionado
      </h3>
      <p className='text-slate-500 text-sm'>Tente selecionar um período diferente</p>
    </div>
  );
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pendente',
    IN_ROUTE: 'Em Rota',
    DELIVERED: 'Entregue',
    DELAYED: 'Atrasada',
    FAILED: 'Falhou',
  };
  return labels[status] || status;
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    URGENT: 'Urgente',
    HIGH: 'Alta',
    NORMAL: 'Normal',
    LOW: 'Baixa',
  };
  return labels[priority] || priority;
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className='bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-3'>
        <p className='text-slate-300 font-medium mb-2'>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className='text-sm' style={{ color: '#64748b' }}>
            {getStatusLabel(entry.name)}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function DashboardTrends({
  trendData,
  statusDistribution,
  priorityDistribution,
  isLoading = false,
}: DashboardTrendsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  const hasTrendData = trendData && trendData.length > 0;
  const hasStatusData = statusDistribution && statusDistribution.length > 0;
  const hasPriorityData = priorityDistribution && priorityDistribution.length > 0;

  if (!hasTrendData && !hasStatusData && !hasPriorityData) {
    return (
      <Card>
        <CardContent>
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Trend Chart - Full Width */}
      {hasTrendData && (
        <Card>
          <CardContent>
            <h3 className='text-lg font-semibold text-slate-100 mb-4'>
              Tendência: Previstas vs Concluídas
            </h3>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                <XAxis dataKey='date' stroke='#94a3b8' />
                <YAxis stroke='#94a3b8' />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='predicted'
                  stroke={CHART_COLORS.predicted}
                  strokeWidth={2}
                  name='Previstas'
                  dot={false}
                />
                <Line
                  type='monotone'
                  dataKey='delivered'
                  stroke={CHART_COLORS.delivered}
                  strokeWidth={2}
                  name='Concluídas'
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Distribution Charts - 2 Column Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Status Distribution */}
        {hasStatusData && (
          <Card>
            <CardContent>
              <h3 className='text-lg font-semibold text-slate-100 mb-4'>Distribuição por Status</h3>
              <ResponsiveContainer width='100%' height={250}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey='count'
                    nameKey='status'
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={80}
                    label={({
                      payload,
                      percent,
                    }: PieLabelRenderProps & { payload?: StatusDistribution }) =>
                      `${getStatusLabel(payload?.status ?? '')}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(value) => getStatusLabel(value as string)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Priority Distribution - Optional */}
        {hasPriorityData && (
          <Card>
            <CardContent>
              <h3 className='text-lg font-semibold text-slate-100 mb-4'>
                Distribuição por Prioridade
              </h3>
              <ResponsiveContainer width='100%' height={250}>
                <BarChart data={priorityDistribution} style={{ color: '#64748b ' }} className=''>
                  <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                  <XAxis
                    dataKey='priority'
                    stroke='#94a3b8'
                    tickFormatter={(value) => getPriorityLabel(value)}
                  />
                  <YAxis stroke='#94a3b8' />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => getPriorityLabel(value as string)}
                    color='#64748b'
                  />
                  <Bar dataKey='count' name='Quantidade' radius={[4, 4, 0, 0]}>
                    {priorityDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PRIORITY_COLORS[entry.priority] || '#64748b'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
