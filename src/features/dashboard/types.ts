import type { DeliveryPriority, DeliveryStatus } from '@/features/deliveries/types';

// ============================================================================
// Period Filter
// ============================================================================

export type DashboardPeriod = 'today' | '7d' | '14d' | '30d';

// ============================================================================
// Main KPIs
// ============================================================================

export interface DashboardKpis {
  total: number;
  inRoute: number;
  delivered: number;
  overdue: number;
}

// ============================================================================
// Risk Metrics
// ============================================================================

export interface DashboardRiskMetrics {
  overduePercentage: number;
  averageDelayHours: number;
  averageAttempts: number;
}

// ============================================================================
// Action Tables
// ============================================================================

/**
 * Overdue delivery - requires immediate action
 * Calculated: expected_delivery_at < now AND deliveredAt === null (inferred via timeline)
 */
export interface OverdueDelivery {
  id: string;
  tracking_code: string;
  recipient: { name: string };
  expected_delivery_at: string;
  status: DeliveryStatus;
  priority: DeliveryPriority;
  /**
   * Calculated field: now - expected_delivery_at (in hours)
   */
  delay_hours: number;
}

/**
 * Urgent in-route delivery - needs attention while en route
 * Filter: priority IN (URGENT, HIGH) AND status = IN_ROUTE
 */
export interface UrgentInRouteDelivery {
  id: string;
  tracking_code: string;
  recipient: { name: string };
  expected_delivery_at: string;
  status: DeliveryStatus;
  priority: 'URGENT' | 'HIGH';
}

/**
 * Failed/delayed delivery - requires follow-up
 */
export interface FailedDelivery {
  id: string;
  tracking_code: string;
  recipient: { name: string };
  expected_delivery_at: string;
  status: DeliveryStatus;
  failure_reason?: string;
  /**
   * From timeline - timestamp of the last event
   */
  last_event_at: string;
}

// ============================================================================
// Charts and Analytics
// ============================================================================

/**
 * Trend data point for predicted vs delivered deliveries
 */
export interface TrendDataPoint {
  date: string;
  predicted: number;
  delivered: number;
}

/**
 * Distribution of deliveries by status
 */
export interface StatusDistribution {
  status: DeliveryStatus;
  count: number;
  percentage: number;
}

/**
 * Distribution of deliveries by priority
 */
export interface PriorityDistribution {
  priority: DeliveryPriority;
  count: number;
}

// ============================================================================
// Complete Dashboard Data
// ============================================================================

export interface DashboardData {
  kpis: DashboardKpis;
  riskMetrics: DashboardRiskMetrics;
  overdueDeliveries: OverdueDelivery[];
  urgentInRouteDeliveries: UrgentInRouteDelivery[];
  failedDeliveries: FailedDelivery[];
  trendData: TrendDataPoint[];
  statusDistribution: StatusDistribution[];
  priorityDistribution: PriorityDistribution[];
}
