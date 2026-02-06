import { useQuery } from '@tanstack/react-query';
import { fetchDelivery } from '../services/deliveriesService';

export function useDelivery(id: string) {
  return useQuery({
    queryKey: ['deliveries', 'detail', id] as const,
    queryFn: () => fetchDelivery(id),
    enabled: Boolean(id),
  });
}
