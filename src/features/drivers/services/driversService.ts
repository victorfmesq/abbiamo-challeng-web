import api from '@/services/httpClient';
import type { DriverDto, DriversListResponseDto, DriverStatus } from '../types';

export function fetchDrivers(status?: DriverStatus) {
  return api.request<DriversListResponseDto>('/drivers', {
    method: 'GET',
    query: status ? { status } : undefined,
  });
}

export function fetchDriver(id: string) {
  return api.request<DriverDto>(`/drivers/${id}`, { method: 'GET' });
}
