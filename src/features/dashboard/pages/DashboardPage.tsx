import { useState } from 'react';
import { Button, ReloadButton } from '@/shared/components';
import { DeliveryDetailsModal } from '@/features/deliveries/components/DeliveryDetailsModal';
import {
  DashboardPeriodFilter,
  DashboardKpis,
  DashboardRiskCards,
  DashboardActionTables,
  DashboardTrends,
} from '../components';
import { useDashboardData } from '../hooks/useDashboardData';
import type { DashboardPeriod, DashboardData } from '../types';

const defaultKpis = {
  total: 0,
  inRoute: 0,
  delivered: 0,
  overdue: 0,
};

const defaultRiskMetrics = {
  overduePercentage: 0,
  averageDelayHours: 0,
  averageAttempts: 0,
};

const defaultTrendData: DashboardData['trendData'] = [];
const defaultStatusDistribution: DashboardData['statusDistribution'] = [];
const defaultPriorityDistribution: DashboardData['priorityDistribution'] = [];
const defaultOverdueDeliveries: DashboardData['overdueDeliveries'] = [];
const defaultUrgentInRouteDeliveries: DashboardData['urgentInRouteDeliveries'] = [];
const defaultFailedDeliveries: DashboardData['failedDeliveries'] = [];

export function DashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriod>('today');
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const { data, isLoading, error, refetch } = useDashboardData({ period });

  const kpis = data?.kpis ?? defaultKpis;
  const riskMetrics = data?.riskMetrics ?? defaultRiskMetrics;
  const trendData = data?.trendData ?? defaultTrendData;
  const statusDistribution = data?.statusDistribution ?? defaultStatusDistribution;
  const priorityDistribution = data?.priorityDistribution ?? defaultPriorityDistribution;
  const overdueDeliveries = data?.overdueDeliveries ?? defaultOverdueDeliveries;
  const urgentInRouteDeliveries = data?.urgentInRouteDeliveries ?? defaultUrgentInRouteDeliveries;
  const failedDeliveries = data?.failedDeliveries ?? defaultFailedDeliveries;

  const handleViewDetails = (id: string) => {
    setSelectedDeliveryId(id);
    setDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setDetailsModalOpen(false);
    setSelectedDeliveryId(null);
  };

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-0 flex-1 gap-4'>
        <p className='text-rose-400'>Erro ao carregar dashboard</p>
        <Button onClick={() => refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className='flex overflow-y-auto flex-col min-h-0 flex-1 gap-6 px-6 pb-6'>
      <div className='sticky top-0 z-30 -mx-6 px-6 py-4 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 shadow-sm -mt-6 mb-4'>
        <div className='flex items-center justify-between gap-4'>
          <DashboardPeriodFilter value={period} onChange={setPeriod} />
          <ReloadButton onClick={() => refetch()} />
        </div>
      </div>

      {/* KPIs */}
      <DashboardKpis kpis={kpis} isLoading={isLoading} />

      {/* Risk Cards */}
      <DashboardRiskCards riskMetrics={riskMetrics} isLoading={isLoading} />

      {/* Action Tables */}
      <DashboardActionTables
        overdueDeliveries={overdueDeliveries}
        urgentInRouteDeliveries={urgentInRouteDeliveries}
        failedDeliveries={failedDeliveries}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
      />

      {/* Trends */}
      <DashboardTrends
        trendData={trendData}
        statusDistribution={statusDistribution}
        priorityDistribution={priorityDistribution}
        isLoading={isLoading}
      />

      {/* Details Modal */}
      {selectedDeliveryId && (
        <DeliveryDetailsModal
          isOpen={detailsModalOpen}
          onClose={handleCloseModal}
          deliveryId={selectedDeliveryId}
        />
      )}
    </div>
  );
}
