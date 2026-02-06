import { useQuery } from '@tanstack/react-query';
import { fetchDeliveryStats } from '../services/deliveriesService';

export function useDeliveryStats() {
  return useQuery({
    queryKey: ['deliveries', 'stats'] as const,
    queryFn: fetchDeliveryStats,
  });
}
