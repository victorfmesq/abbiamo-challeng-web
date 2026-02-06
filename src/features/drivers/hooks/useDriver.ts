import { useQuery } from '@tanstack/react-query';
import { fetchDriver } from '../services/driversService';

export function useDriver(id: string) {
  return useQuery({
    queryKey: ['drivers', 'detail', id] as const,
    queryFn: () => fetchDriver(id),
    enabled: Boolean(id),
  });
}
