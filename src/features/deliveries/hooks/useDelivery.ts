import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDelivery } from '../services/deliveriesService';
import { toastError } from '@/shared/utils/toast';

export function useDelivery(id: string) {
  const query = useQuery({
    queryKey: ['deliveries', 'detail', id] as const,
    queryFn: () => fetchDelivery(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (query.isError) {
      toastError(query.error, 'Falha ao carregar detalhes da entrega.', {
        id: `query:deliveries:detail:${id}:error`,
      });
    }
  }, [query.isError, query.error, id]);

  return query;
}
