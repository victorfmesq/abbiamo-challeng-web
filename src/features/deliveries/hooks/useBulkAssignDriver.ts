import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkAssignDriver } from '../services/deliveriesService';
import type { BulkAssignDriverDto } from '../types';
import { deliveriesKeys } from './useDeliveries';

export function useBulkAssignDriver() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: BulkAssignDriverDto) => bulkAssignDriver(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deliveriesKeys().all });
    },
  });
}
