import { useQuery } from '@tanstack/react-query';
import type { DriverStatus } from '../types';
import { fetchDrivers } from '../services/driversService';

export function useDrivers(status?: DriverStatus) {
  return useQuery({
    queryKey: ['drivers', 'list', status ?? 'all'] as const,
    queryFn: () => fetchDrivers(status),
  });
}
