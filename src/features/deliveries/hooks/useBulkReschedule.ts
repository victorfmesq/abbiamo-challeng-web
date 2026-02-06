import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkReschedule } from '../services/deliveriesService';
import type { BulkRescheduleDto } from '../types';
import { deliveriesKeys } from './useDeliveries';

export function useBulkReschedule() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: BulkRescheduleDto) => bulkReschedule(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deliveriesKeys().all });
    },
  });
}
