import { AlertCircle, Clock, RotateCw } from 'lucide-react';
import { DashboardRiskCardsSkeleton } from '@/shared/components/DashboardSkeletons';
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

export function DashboardRiskCards({ riskMetrics, isLoading = false }: DashboardRiskCardsProps) {
  if (isLoading) {
    return <DashboardRiskCardsSkeleton />;
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
