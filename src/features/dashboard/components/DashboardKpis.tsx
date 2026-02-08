import { Package, Truck, CircleCheck, AlertTriangle } from 'lucide-react';
import { MetricCard } from './MetricCard';

export interface DashboardKpisProps {
  kpis: {
    total: number;
    inRoute: number;
    delivered: number;
    overdue: number;
  };
  isLoading?: boolean;
}

function SkeletonCard() {
  return <div className='animate-pulse bg-slate-800 h-28 rounded-lg' />;
}

export function DashboardKpis({ kpis, isLoading }: DashboardKpisProps) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      {/* Total - default variant */}
      <MetricCard
        title='Total'
        value={kpis.total}
        icon={<Package className='w-5 h-5' />}
        variant='default'
      />

      {/* Em rota - default variant */}
      <MetricCard
        title='Em rota'
        value={kpis.inRoute}
        icon={<Truck className='w-5 h-5' />}
        variant='default'
      />

      {/* Concluídas - success variant */}
      <MetricCard
        title='Concluídas'
        value={kpis.delivered}
        icon={<CircleCheck className='w-5 h-5' />}
        variant='success'
      />

      {/* Atrasadas - danger variant, PRIMARY (most prominent) */}
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
