import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../services/dashboardService';
import type { DashboardData, DashboardPeriod } from '../types';
import { toastError } from '@/shared/utils/toast';

export function dashboardKeys() {
  return {
    all: ['dashboard'] as const,
    data: (period: DashboardPeriod) => ['dashboard', 'data', period] as const,
  };
}

export function calculateDeliveryRate(data: DashboardData): number {
  if (data.kpis.total === 0) return 0;
  return (data.kpis.delivered / data.kpis.total) * 100;
}

export function hasUrgentItems(data: DashboardData): boolean {
  return (
    data.overdueDeliveries.length > 0 ||
    data.urgentInRouteDeliveries.length > 0 ||
    data.failedDeliveries.length > 0
  );
}

export function getMostCriticalOverdue(data: DashboardData) {
  if (data.overdueDeliveries.length === 0) return null;
  return data.overdueDeliveries[0];
}

export interface UseDashboardDataOptions {
  period: DashboardPeriod;
}

export function useDashboardData({ period }: UseDashboardDataOptions) {
  const query = useQuery({
    queryKey: dashboardKeys().data(period),
    queryFn: () => getDashboardData(period),
    staleTime: 60_000, // Dashboard data is fresh for 1 minute
    gcTime: 5 * 60_000, // Keep in cache for 5 minutes
  });

  const deliveryRate = query.data ? calculateDeliveryRate(query.data) : 0;
  const urgentItems = query.data ? hasUrgentItems(query.data) : false;
  const mostCriticalOverdue = query.data ? getMostCriticalOverdue(query.data) : null;

  const refetch = async () => {
    return query.refetch();
  };

  useEffect(() => {
    if (query.isError) {
      toastError(query.error, 'Falha ao carregar dashboard.', { id: 'query:dashboard:error' });
    }
  }, [query.isError, query.error]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    isFetching: query.isFetching,

    deliveryRate,
    urgentItems,
    mostCriticalOverdue,

    refetch,
  };
}
