import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { DriverStatus } from '../types';
import { fetchDrivers } from '../services/driversService';
import { toastError } from '@/shared/utils/toast';

export function useDrivers(status?: DriverStatus) {
  const query = useQuery({
    queryKey: ['drivers', 'list', status ?? 'all'] as const,
    queryFn: () => fetchDrivers(status),
  });

  useEffect(() => {
    if (query.isError) {
      toastError(query.error, 'Falha ao carregar motoristas.', {
        id: `query:drivers:list:${status ?? 'all'}:error`,
      });
    }
  }, [query.isError, query.error, status]);

  return query;
}
