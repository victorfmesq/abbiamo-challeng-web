import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { DeliveriesFilters } from '../domain/deliveriesFilters';
import { fetchDeliveries } from '../services/deliveriesService';
import { toastError } from '@/shared/utils/toast';

export function deliveriesKeys() {
  return {
    all: ['deliveries'] as const,
    list: (filters: DeliveriesFilters) => ['deliveries', 'list', filters] as const,
  };
}

export function useDeliveries(filters: DeliveriesFilters) {
  const query = useQuery({
    queryKey: deliveriesKeys().list(filters),
    queryFn: () => fetchDeliveries(filters),
  });

  useEffect(() => {
    if (query.isError) {
      toastError(query.error, 'Falha ao carregar entregas.', { id: 'query:deliveries:list:error' });
    }
  }, [query.isError, query.error]);

  return query;
}
