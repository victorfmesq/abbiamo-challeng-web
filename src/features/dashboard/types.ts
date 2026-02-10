import type { DeliveryPriority, DeliveryStatus } from '@/features/deliveries/types';

export type DashboardPeriod = 'today' | '7d' | '14d' | '30d';

export interface DashboardKpis {
  total: number;
  inRoute: number;
  delivered: number;
  overdue: number;
}

export interface DashboardRiskMetrics {
  overduePercentage: number;
  averageDelayHours: number;
  averageAttempts: number;
}

export interface OverdueDelivery {
  id: string;
  tracking_code: string;
  recipient: { name: string };
  expected_delivery_at: string;
  status: DeliveryStatus;
  priority: DeliveryPriority;

  delay_hours: number;
}

export interface UrgentInRouteDelivery {
  id: string;
  tracking_code: string;
  recipient: { name: string };
  expected_delivery_at: string;
  status: DeliveryStatus;
  priority: 'URGENT' | 'HIGH';
}

export interface FailedDelivery {
  id: string;
  tracking_code: string;
  recipient: { name: string };
  expected_delivery_at: string;
  status: DeliveryStatus;
  failure_reason?: string;

  last_event_at: string;
}

export interface TrendDataPoint {
  date: string;
  predicted: number;
  delivered: number;
}

export interface StatusDistribution {
  status: DeliveryStatus;
  count: number;
  percentage: number;
}

export interface PriorityDistribution {
  priority: DeliveryPriority;
  count: number;
}

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
