import type { DeliveryStatus } from '@/features/deliveries/types';

export type DeliveriesSortBy = 'tracking_code' | 'status' | 'expected_delivery_at' | 'created_at';
export type SortOrder = 'asc' | 'desc';

export type DeliveriesFilters = {
  page?: number;
  limit?: number;
  sortBy?: DeliveriesSortBy;
  sortOrder?: SortOrder;
  status?: DeliveryStatus | 'all';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

export function normalizeDeliveriesFilters(input: DeliveriesFilters): DeliveriesFilters {
  return {
    ...input,
    page: input.page && input.page > 0 ? input.page : 1,
    limit: input.limit && input.limit > 0 ? input.limit : 10,
    search: input.search?.trim() || undefined,
    status: input.status === 'all' ? undefined : input.status,
  };
}

export function toDeliveriesQueryParams(
  filters: DeliveriesFilters
): Record<string, string | number> {
  const f = normalizeDeliveriesFilters(filters);

  const params: Record<string, string | number> = {
    page: f.page ?? 1,
    limit: f.limit ?? 10,
  };

  if (f.sortBy) params.sortBy = f.sortBy;
  if (f.sortOrder) params.sortOrder = f.sortOrder;
  if (f.status) params.status = f.status;
  if (f.search) params.search = f.search;
  if (f.dateFrom) params.dateFrom = f.dateFrom;
  if (f.dateTo) params.dateTo = f.dateTo;

  return params;
}
