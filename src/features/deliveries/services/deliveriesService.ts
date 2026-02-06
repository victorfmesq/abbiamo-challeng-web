import api from '@/services/httpClient';
import type {
  BulkAssignDriverDto,
  BulkOperationResponseDto,
  BulkRescheduleDto,
  BulkUpdatePriorityDto,
  DeliveryDto,
  DeliveryStatsDto,
  PaginatedDeliveriesResponseDto,
} from '../types';
import type { DeliveriesFilters } from '../domain/deliveriesFilters';
import { toDeliveriesQueryParams } from '../domain/deliveriesFilters';

export function fetchDeliveries(filters: DeliveriesFilters) {
  return api.request<PaginatedDeliveriesResponseDto>('/deliveries', {
    method: 'GET',
    query: toDeliveriesQueryParams(filters),
  });
}

export function fetchDelivery(id: string) {
  return api.request<DeliveryDto>(`/deliveries/${id}`, { method: 'GET' });
}

export function fetchDeliveryStats() {
  return api.request<DeliveryStatsDto>('/deliveries/stats', { method: 'GET' });
}

export function bulkReschedule(dto: BulkRescheduleDto) {
  return api.request<BulkOperationResponseDto>('/deliveries/bulk/reschedule', {
    method: 'PATCH',
    body: dto,
  });
}

export function bulkAssignDriver(dto: BulkAssignDriverDto) {
  return api.request<BulkOperationResponseDto>('/deliveries/bulk/assign-driver', {
    method: 'PATCH',
    body: dto,
  });
}

export function bulkUpdatePriority(dto: BulkUpdatePriorityDto) {
  return api.request<BulkOperationResponseDto>('/deliveries/bulk/priority', {
    method: 'PATCH',
    body: dto,
  });
}
