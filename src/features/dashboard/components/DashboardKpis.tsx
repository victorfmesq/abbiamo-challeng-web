import { Package, Truck, CircleCheck, AlertTriangle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { DashboardKpisSkeleton } from '@/shared/components/DashboardSkeletons';

export interface DashboardKpisProps {
  kpis: {
    total: number;
    inRoute: number;
    delivered: number;
    overdue: number;
  };
  isLoading?: boolean;
}

export function DashboardKpis({ kpis, isLoading }: DashboardKpisProps) {
  if (isLoading) {
    return <DashboardKpisSkeleton />;
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      <MetricCard
        title='Total'
        value={kpis.total}
        icon={<Package className='w-5 h-5' />}
        variant='default'
      />

      <MetricCard
        title='Em rota'
        value={kpis.inRoute}
        icon={<Truck className='w-5 h-5' />}
        variant='default'
      />

      <MetricCard
        title='Concluídas'
        value={kpis.delivered}
        icon={<CircleCheck className='w-5 h-5' />}
        variant='success'
      />

      <MetricCard
        title='Atrasadas'
        value={kpis.overdue}
        icon={<AlertTriangle className='w-5 h-5' />}
        variant='danger'
        hint='Ação imediata necessária'
      />
    </div>
  );
}
