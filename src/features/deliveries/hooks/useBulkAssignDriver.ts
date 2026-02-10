import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkAssignDriver } from '../services/deliveriesService';
import type { BulkAssignDriverDto } from '../types';
import { deliveriesKeys } from './useDeliveries';
import { toastDismiss, toastError, toastLoading, toastSuccess } from '@/shared/utils/toast';

const TOAST_ID = 'bulk:assign-driver';

export function useBulkAssignDriver() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: BulkAssignDriverDto) => bulkAssignDriver(dto),
    onMutate: () => {
      toastLoading('Atribuindo motorista...', { id: TOAST_ID });
    },
    onSuccess: () => {
      toastDismiss(TOAST_ID);
      toastSuccess('Motorista atribuído com sucesso.', { id: `${TOAST_ID}:success` });
      qc.invalidateQueries({ queryKey: deliveriesKeys().all });
    },
    onError: (err) => {
      toastDismiss(TOAST_ID);
      toastError(err, 'Falha ao atribuir motorista.', { id: `${TOAST_ID}:error` });
    },
  });
}
