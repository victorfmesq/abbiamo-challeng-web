import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDeliveryStats } from '../services/deliveriesService';
import { toastError } from '@/shared/utils/toast';

export function useDeliveryStats() {
  const query = useQuery({
    queryKey: ['deliveries', 'stats'] as const,
    queryFn: fetchDeliveryStats,
  });

  useEffect(() => {
    if (query.isError) {
      toastError(query.error, 'Falha ao carregar estatísticas de entregas.', {
        id: 'query:deliveries:stats:error',
      });
    }
  }, [query.isError, query.error]);

  return query;
}
