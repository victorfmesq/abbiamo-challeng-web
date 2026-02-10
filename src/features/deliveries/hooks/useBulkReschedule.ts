import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkReschedule } from '../services/deliveriesService';
import type { BulkRescheduleDto } from '../types';
import { deliveriesKeys } from './useDeliveries';
import { toastDismiss, toastError, toastLoading, toastSuccess } from '@/shared/utils/toast';

const TOAST_ID = 'bulk:reschedule';

export function useBulkReschedule() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: BulkRescheduleDto) => bulkReschedule(dto),
    onMutate: () => {
      toastLoading('Reagendando entregas...', { id: TOAST_ID });
    },
    onSuccess: () => {
      toastDismiss(TOAST_ID);
      toastSuccess('Entregas reagendadas com sucesso.', { id: `${TOAST_ID}:success` });
      qc.invalidateQueries({ queryKey: deliveriesKeys().all });
    },
    onError: (err) => {
      toastDismiss(TOAST_ID);
      toastError(err, 'Falha ao reagendar entregas.', { id: `${TOAST_ID}:error` });
    },
  });
}
