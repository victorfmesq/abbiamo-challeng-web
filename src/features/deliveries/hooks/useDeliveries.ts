import { useQuery } from '@tanstack/react-query';
import type { DeliveriesFilters } from '../domain/deliveriesFilters';
import { fetchDeliveries } from '../services/deliveriesService';

export function deliveriesKeys() {
  return {
    all: ['deliveries'] as const,
    list: (filters: DeliveriesFilters) => ['deliveries', 'list', filters] as const,
  };
}

export function useDeliveries(filters: DeliveriesFilters) {
  return useQuery({
    queryKey: deliveriesKeys().list(filters),
    queryFn: () => fetchDeliveries(filters),
  });
}
