import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkUpdatePriority } from '../services/deliveriesService';
import type { BulkUpdatePriorityDto } from '../types';
import { deliveriesKeys } from './useDeliveries';

export function useBulkUpdatePriority() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: BulkUpdatePriorityDto) => bulkUpdatePriority(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deliveriesKeys().all });
    },
  });
}
