import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../services/dashboardService';
import type { DashboardData, DashboardPeriod } from '../types';
import { toastError } from '@/shared/utils/toast';

// ============================================================================
// Query Keys
// ============================================================================

export function dashboardKeys() {
  return {
    all: ['dashboard'] as const,
    data: (period: DashboardPeriod) => ['dashboard', 'data', period] as const,
  };
}

// ============================================================================
// Data Transformation Helpers
// ============================================================================

/**
 * Calculate delivery rate percentage
 */
export function calculateDeliveryRate(data: DashboardData): number {
  if (data.kpis.total === 0) return 0;
  return (data.kpis.delivered / data.kpis.total) * 100;
}

/**
 * Check if there are urgent items requiring attention
 */
export function hasUrgentItems(data: DashboardData): boolean {
  return (
    data.overdueDeliveries.length > 0 ||
    data.urgentInRouteDeliveries.length > 0 ||
    data.failedDeliveries.length > 0
  );
}

/**
 * Get the most critical overdue delivery
 */
export function getMostCriticalOverdue(data: DashboardData) {
  if (data.overdueDeliveries.length === 0) return null;
  return data.overdueDeliveries[0];
}

// ============================================================================
// Hook
// ============================================================================

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

  // ============================================================================
  // Data Transformation Helpers exposed via hook
  // ============================================================================

  const deliveryRate = query.data ? calculateDeliveryRate(query.data) : 0;
  const urgentItems = query.data ? hasUrgentItems(query.data) : false;
  const mostCriticalOverdue = query.data ? getMostCriticalOverdue(query.data) : null;

  // ============================================================================
  // Refetch Helper
  // ============================================================================

  const refetch = async () => {
    return query.refetch();
  };

  useEffect(() => {
    if (query.isError) {
      toastError(query.error, 'Falha ao carregar dashboard.', { id: 'query:dashboard:error' });
    }
  }, [query.isError, query.error]);

  return {
    // React Query state
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    isFetching: query.isFetching,

    // Data helpers
    deliveryRate,
    urgentItems,
    mostCriticalOverdue,

    // Actions
    refetch,
  };
}
