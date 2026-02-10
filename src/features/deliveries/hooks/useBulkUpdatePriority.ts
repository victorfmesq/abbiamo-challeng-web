import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkUpdatePriority } from '../services/deliveriesService';
import type { BulkUpdatePriorityDto } from '../types';
import { deliveriesKeys } from './useDeliveries';
import { toastDismiss, toastError, toastLoading, toastSuccess } from '@/shared/utils/toast';

const TOAST_ID = 'bulk:update-priority';

export function useBulkUpdatePriority() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: BulkUpdatePriorityDto) => bulkUpdatePriority(dto),
    onMutate: () => {
      toastLoading('Atualizando prioridade...', { id: TOAST_ID });
    },
    onSuccess: () => {
      toastDismiss(TOAST_ID);
      toastSuccess('Prioridade atualizada com sucesso.', { id: `${TOAST_ID}:success` });
      qc.invalidateQueries({ queryKey: deliveriesKeys().all });
    },
    onError: (err) => {
      toastDismiss(TOAST_ID);
      toastError(err, 'Falha ao atualizar prioridade.', { id: `${TOAST_ID}:error` });
    },
  });
}
