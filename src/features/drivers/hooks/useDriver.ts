import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDriver } from '../services/driversService';
import { toastError } from '@/shared/utils/toast';

export function useDriver(id: string) {
  const query = useQuery({
    queryKey: ['drivers', 'detail', id] as const,
    queryFn: () => fetchDriver(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (query.isError) {
      toastError(query.error, 'Falha ao carregar motorista.', {
        id: `query:drivers:detail:${id}:error`,
      });
    }
  }, [query.isError, query.error, id]);

  return query;
}
