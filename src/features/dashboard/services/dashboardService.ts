import api from '@/services/httpClient';
import type { DashboardData, DashboardPeriod } from '../types';
import type { DeliveryDto } from '@/features/deliveries/types';

// ============================================================================
// Date Utilities
// ============================================================================

/**
 * Calculate date range based on dashboard period
 */
function getDateRangeForPeriod(period: DashboardPeriod): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const dateTo = now.toISOString();

  let dateFrom: Date;

  switch (period) {
    case 'today':
      dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case '7d':
      dateFrom = new Date(now);
      dateFrom.setDate(dateFrom.getDate() - 7);
      break;
    case '14d':
      dateFrom = new Date(now);
      dateFrom.setDate(dateFrom.getDate() - 14);
      break;
    case '30d':
      dateFrom = new Date(now);
      dateFrom.setDate(dateFrom.getDate() - 30);
      break;
  }

  return {
    dateFrom: dateFrom.toISOString(),
    dateTo,
  };
}

// ============================================================================
// delivered_at Inference
// ============================================================================

/**
 * Infer delivered_at from timeline.
 *
 * CRITICAL: delivered_at is INFERRED from the timeline array.
 * We find the LAST event where timeline.status === 'DELIVERED'.
 *
 * If no DELIVERED event exists in the timeline, the delivery does NOT count
 * in temporal metrics (KPIs, trends, etc.).
 *
 * This is because the actual delivery completion time must be explicitly
 * recorded in the timeline for accurate metrics.
 *
 * @param delivery - The delivery object with timeline
 * @returns The inferred delivered_at timestamp or null if not delivered
 */
function inferDeliveredAt(delivery: DeliveryDto): string | null {
  const timeline = delivery.timeline ?? [];
  let latest: string | null = null;

  for (const e of timeline) {
    if (e.status !== 'DELIVERED') continue;
    if (latest === null || new Date(e.timestamp) > new Date(latest)) latest = e.timestamp;
  }
  return latest;
}

/**
 * Check if a delivery is overdue
 * @param delivery - The delivery object
 * @param deliveredAt - The inferred delivered_at timestamp
 * @returns true if delivery is overdue
 */
function isDeliveryOverdue(delivery: DeliveryDto, deliveredAt: string | null): boolean {
  // If delivered, it's not overdue
  if (deliveredAt !== null) {
    return false;
  }

  // Check if expected delivery time has passed
  const now = new Date();
  const expectedDelivery = new Date(delivery.expected_delivery_at);
  return expectedDelivery < now;
}

/**
 * Calculate delay hours for an overdue delivery
 * @param delivery - The delivery object
 * @returns Delay in hours (positive value for overdue)
 */
function calculateDelayHours(delivery: DeliveryDto): number {
  const now = new Date();
  const expectedDelivery = new Date(delivery.expected_delivery_at);
  const diffMs = now.getTime() - expectedDelivery.getTime();
  return Math.max(0, diffMs / (1000 * 60 * 60)); // Convert to hours
}

// ============================================================================
// Data Transformation
// ============================================================================

/**
 * Transform raw API deliveries into DashboardData
 * @param deliveries - Raw deliveries from API
 * @param period - Dashboard period filter
 * @returns Transformed DashboardData
 */
function transformToDashboardData(
  deliveries: DeliveryDto[],
  period: DashboardPeriod
): DashboardData {
  // Calculate delivered_at for each delivery
  const deliveriesWithDeliveredAt = deliveries.map((delivery) => ({
    ...delivery,
    deliveredAt: inferDeliveredAt(delivery),
  }));

  // Filter and categorize deliveries
  const allDeliveries = deliveriesWithDeliveredAt;
  const delivered = allDeliveries.filter((d) => d.deliveredAt !== null);
  const inRoute = allDeliveries.filter((d) => d.status === 'IN_ROUTE');
  const overdue = allDeliveries.filter((d) => isDeliveryOverdue(d, d.deliveredAt));

  // KPIs
  const kpis: DashboardData['kpis'] = {
    total: allDeliveries.length,
    inRoute: inRoute.length,
    delivered: delivered.length,
    overdue: overdue.length,
  };

  // Risk Metrics
  const riskMetrics: DashboardData['riskMetrics'] = {
    overduePercentage: kpis.total > 0 ? (kpis.overdue / kpis.total) * 100 : 0,
    averageDelayHours:
      overdue.length > 0
        ? overdue.reduce((sum, d) => sum + calculateDelayHours(d), 0) / overdue.length
        : 0,
    averageAttempts:
      allDeliveries.length > 0
        ? allDeliveries.reduce((sum, d) => sum + d.delivery_attempts, 0) / allDeliveries.length
        : 0,
  };

  // Overdue Deliveries (sorted by delay hours desc, then priority)
  const overdueDeliveries: DashboardData['overdueDeliveries'] = overdue
    .map((d) => ({
      id: d.id,
      tracking_code: d.tracking_code,
      recipient: { name: d.recipient.name },
      expected_delivery_at: d.expected_delivery_at,
      status: d.status,
      priority: d.priority,
      delay_hours: calculateDelayHours(d),
    }))
    .sort((a, b) => {
      // Sort by delay_hours desc, then by priority order, then by status
      const priorityOrder = { URGENT: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
      if (b.delay_hours !== a.delay_hours) return b.delay_hours - a.delay_hours;
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.status.localeCompare(b.status);
    })
    .slice(0, 8);

  // Urgent In-Route Deliveries (priority URGENT or HIGH, status IN_ROUTE)
  const urgentInRouteDeliveries: DashboardData['urgentInRouteDeliveries'] = inRoute
    .filter((d) => d.priority === 'URGENT' || d.priority === 'HIGH')
    .map((d) => ({
      id: d.id,
      tracking_code: d.tracking_code,
      recipient: { name: d.recipient.name },
      expected_delivery_at: d.expected_delivery_at,
      status: d.status,
      priority: d.priority as 'URGENT' | 'HIGH',
    }))
    .sort((a, b) => {
      const priorityOrder = { URGENT: 0, HIGH: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return (
        new Date(a.expected_delivery_at).getTime() - new Date(b.expected_delivery_at).getTime()
      );
    })
    .slice(0, 8);

  // Failed Deliveries (status FAILED or DELAYED)
  const failedDeliveries: DashboardData['failedDeliveries'] = allDeliveries
    .filter((d) => d.status === 'FAILED' || d.status === 'DELAYED')
    .map((d) => {
      // Get the last event from timeline for last_event_at
      // Note: [...d.timeline] creates a copy to avoid mutating original
      const lastEvent =
        d.timeline && d.timeline.length > 0
          ? [...d.timeline].sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )[0]
          : null;

      return {
        id: d.id,
        tracking_code: d.tracking_code,
        recipient: { name: d.recipient.name },
        expected_delivery_at: d.expected_delivery_at,
        status: d.status,
        last_event_at: lastEvent?.timestamp ?? d.expected_delivery_at,
      };
    })
    // Sort by last_event_at desc (most recent first)
    .sort((a, b) => new Date(b.last_event_at).getTime() - new Date(a.last_event_at).getTime())
    .slice(0, 8);

  // Trend Data (grouped by date)
  const trendData: DashboardData['trendData'] = calculateTrendData(allDeliveries, period);

  // Status Distribution
  const statusDistribution: DashboardData['statusDistribution'] =
    calculateStatusDistribution(allDeliveries);

  // Priority Distribution
  const priorityDistribution: DashboardData['priorityDistribution'] =
    calculatePriorityDistribution(allDeliveries);

  return {
    kpis,
    riskMetrics,
    overdueDeliveries,
    urgentInRouteDeliveries,
    failedDeliveries,
    trendData,
    statusDistribution,
    priorityDistribution,
  };
}

/**
 * Calculate trend data (predicted vs delivered by date)
 */
function calculateTrendData(
  deliveries: Array<DeliveryDto & { deliveredAt: string | null }>,
  period: DashboardPeriod
): DashboardData['trendData'] {
  const dateRange = getDateRangeForPeriod(period);
  const startDate = new Date(dateRange.dateFrom);
  const endDate = new Date(dateRange.dateTo);

  // Create a map of date -> { predicted: number, delivered: number }
  const trendMap = new Map<string, { predicted: number; delivered: number }>();

  // Initialize all dates in range
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    trendMap.set(dateStr, { predicted: 0, delivered: 0 });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Count predicted (by expected_delivery_at date)
  deliveries.forEach((d) => {
    const dateStr = d.expected_delivery_at.split('T')[0];
    const entry = trendMap.get(dateStr);
    if (entry) {
      entry.predicted += 1;
    }
  });

  // Count delivered (by delivered_at date)
  deliveries.forEach((d) => {
    if (d.deliveredAt) {
      const dateStr = d.deliveredAt.split('T')[0];
      const entry = trendMap.get(dateStr);
      if (entry) {
        entry.delivered += 1;
      }
    }
  });

  // Convert to array sorted by date
  return Array.from(trendMap.entries())
    .map(([date, data]) => ({
      date,
      predicted: data.predicted,
      delivered: data.delivered,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate status distribution
 */
function calculateStatusDistribution(
  deliveries: Array<DeliveryDto & { deliveredAt: string | null }>
): DashboardData['statusDistribution'] {
  const statusCounts = new Map<string, number>();

  deliveries.forEach((d) => {
    const count = statusCounts.get(d.status) ?? 0;
    statusCounts.set(d.status, count + 1);
  });

  const total = deliveries.length;

  return Array.from(statusCounts.entries()).map(([status, count]) => ({
    status: status as DashboardData['statusDistribution'][0]['status'],
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
  }));
}

/**
 * Calculate priority distribution
 */
function calculatePriorityDistribution(
  deliveries: Array<DeliveryDto & { deliveredAt: string | null }>
): DashboardData['priorityDistribution'] {
  const priorityCounts = new Map<string, number>();

  deliveries.forEach((d) => {
    const count = priorityCounts.get(d.priority) ?? 0;
    priorityCounts.set(d.priority, count + 1);
  });

  return Array.from(priorityCounts.entries()).map(([priority, count]) => ({
    priority: priority as DashboardData['priorityDistribution'][0]['priority'],
    count,
  }));
}

// ============================================================================
// API Service
// ============================================================================

/**
 * Fetch dashboard data with period filtering.
 *
 * All filtering is done server-side via API query parameters.
 * The delivered_at is inferred client-side from the timeline.
 *
 * @param period - Dashboard period filter (today, 7d, 14d, 30d)
 * @returns Promise resolving to DashboardData
 */
export const getDashboardData = async (period: DashboardPeriod): Promise<DashboardData> => {
  // Calculate date range based on period
  const { dateFrom, dateTo } = getDateRangeForPeriod(period);

  // Fetch all deliveries for the period (no pagination for dashboard)
  // Using a high limit to get all data for the dashboard
  const response = await api.request<{ data: DeliveryDto[] }>('/deliveries', {
    method: 'GET',
    query: {
      dateFrom,
      dateTo,
      limit: 1000, // High limit to get all data for dashboard
      status: 'all', // Get all statuses
    },
  });

  // Transform raw API data into DashboardData
  return transformToDashboardData(response.data, period);
};

// ============================================================================
// Query Params Helper
// ============================================================================

/**
 * Get query parameters for dashboard API calls
 */
export function getDashboardQueryParams(period: DashboardPeriod): Record<string, string | number> {
  const { dateFrom, dateTo } = getDateRangeForPeriod(period);
  return {
    dateFrom,
    dateTo,
    limit: 1000,
    status: 'all',
  };
}
