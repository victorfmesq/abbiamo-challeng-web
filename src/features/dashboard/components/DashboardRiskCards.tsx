import { AlertCircle, Clock, RotateCw } from 'lucide-react';
import { Card } from '@/shared/components';
import { MetricCard } from './MetricCard';

export interface DashboardRiskCardsProps {
  riskMetrics: {
    overduePercentage: number;
    averageDelayHours: number;
    averageAttempts: number;
  };
  isLoading?: boolean;
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatHours(value: number): string {
  return `${value.toFixed(1)}h`;
}

function formatAttempts(value: number): string {
  return value.toFixed(1);
}

function RiskCardSkeleton() {
  return (
    <Card className='animate-pulse bg-slate-900 border-slate-700 p-5'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex min-w-0 flex-col gap-1'>
            <div className='h-4 w-24 rounded bg-slate-700' />
            <div className='h-8 w-16 rounded bg-slate-700' />
          </div>
          <div className='h-8 w-8 rounded bg-slate-700' />
        </div>
        <div className='h-3 w-32 rounded bg-slate-700' />
      </div>
    </Card>
  );
}

export function DashboardRiskCards({ riskMetrics, isLoading = false }: DashboardRiskCardsProps) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <RiskCardSkeleton />
        <RiskCardSkeleton />
        <RiskCardSkeleton />
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
      <MetricCard
        title='% Atrasadas'
        value={formatPercentage(riskMetrics.overduePercentage)}
        hint='Porcentagem de entregas atrasadas'
        variant='warning'
        icon={<AlertCircle className='h-5 w-5' />}
      />

      <MetricCard
        title='Atraso Médio'
        value={formatHours(riskMetrics.averageDelayHours)}
        hint='Média de atraso das entregas atrasadas'
        variant='danger'
        icon={<Clock className='h-5 w-5' />}
      />

      <MetricCard
        title='Tentativas Médias'
        value={formatAttempts(riskMetrics.averageAttempts)}
        hint='Média de tentativas por entrega'
        variant='default'
        icon={<RotateCw className='h-5 w-5' />}
      />
    </div>
  );
}
