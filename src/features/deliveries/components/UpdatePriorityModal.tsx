import { useState, useEffect, useMemo } from 'react';
import { Modal, ModalFooter } from '@/shared/components';
import { useBulkUpdatePriority } from '../hooks/useBulkUpdatePriority';
import type { DeliveryDto, DeliveryPriority } from '../types';

interface UpdatePriorityModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryIds: string[];
  deliveries?: DeliveryDto[];
  onSuccess?: () => void;
}

const priorityOptions: Array<{
  value: DeliveryPriority;
  label: string;
  description: string;
  color: string;
}> = [
  {
    value: 'LOW',
    label: 'Baixa',
    description: 'Entrega sem urgência, prazo estendido',
    color: 'emerald',
  },
  {
    value: 'NORMAL',
    label: 'Normal',
    description: 'Prioridade padrão',
    color: 'blue',
  },
  {
    value: 'HIGH',
    label: 'Alta',
    description: 'Entrega prioritária',
    color: 'orange',
  },
  {
    value: 'URGENT',
    label: 'Urgente',
    description: 'Entrega urgente, atenção máxima',
    color: 'rose',
  },
];

export function UpdatePriorityModal({
  isOpen,
  onClose,
  deliveryIds,
  deliveries = [],
  onSuccess,
}: UpdatePriorityModalProps) {
  const [priority, setPriority] = useState<DeliveryPriority | ''>('');
  const [errors, setErrors] = useState<{ priority?: string }>({});

  const mutation = useBulkUpdatePriority();

  const deliveryIdsKey = useMemo(() => deliveryIds.join(','), [deliveryIds]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setPriority('');
        setErrors({});
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, deliveryIdsKey]);

  const validate = () => {
    const newErrors: { priority?: string } = {};

    if (!priority) {
      newErrors.priority = 'Selecione uma prioridade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !priority) return;

    mutation.mutate(
      {
        deliveryIds,
        priority,
      },
      {
        onSuccess: () => {
          onClose();
          onSuccess?.();
        },
      }
    );
  };

  const previewDeliveries = deliveries.slice(0, 5);
  const remainingCount = deliveryIds.length - previewDeliveries.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Atualizar prioridade'
      size='md'
      footer={
        <ModalFooter
          onCancel={onClose}
          onConfirm={handleSubmit}
          isLoading={mutation.isPending}
          confirmLabel='Atualizar'
        />
      }
    >
      <div className='space-y-4'>
        {/* Context info */}
        <div className='flex items-center gap-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg'>
          <svg
            className='h-5 w-5 text-indigo-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span className='text-sm text-indigo-200'>
            Você está atualizando prioridade de <strong>{deliveryIds.length}</strong> entrega
            {deliveryIds.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Preview */}
        {deliveries.length > 0 && (
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-slate-300'>Entregas afetadas</label>
            <div className='max-h-32 overflow-auto space-y-1 p-2 bg-slate-800/50 rounded-lg border border-slate-700'>
              {previewDeliveries.map((delivery) => (
                <div key={delivery.id} className='flex items-center justify-between text-sm'>
                  <span className='font-mono text-slate-300'>{delivery.tracking_code}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      delivery.priority === 'LOW'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : delivery.priority === 'NORMAL'
                          ? 'bg-blue-500/20 text-blue-400'
                          : delivery.priority === 'HIGH'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {delivery.priority === 'LOW'
                      ? 'Baixa'
                      : delivery.priority === 'NORMAL'
                        ? 'Normal'
                        : delivery.priority === 'HIGH'
                          ? 'Alta'
                          : 'Urgente'}
                  </span>
                </div>
              ))}
              {remainingCount > 0 && (
                <p className='text-sm text-slate-400 pt-1'>
                  +{remainingCount} outra{remainingCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Priority Selection */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-slate-300'>
            Nova prioridade <span className='text-rose-400'>*</span>
          </label>
          <div className='grid grid-cols-1 gap-2'>
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => setPriority(option.value)}
                className={`
                  flex items-start gap-3 p-3 rounded-lg border transition-all
                  ${
                    priority === option.value
                      ? `bg-${option.color}-500/20 border-${option.color}-500`
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }
                `}
              >
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    priority === option.value
                      ? `border-${option.color}-500 bg-${option.color}-500`
                      : 'border-slate-600'
                  }`}
                >
                  {priority === option.value && (
                    <svg
                      className='h-3 w-3 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={3}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  )}
                </div>
                <div className='text-left'>
                  <span
                    className={`block font-medium ${
                      priority === option.value ? `text-${option.color}-400` : 'text-slate-200'
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className='block text-xs text-slate-400'>{option.description}</span>
                </div>
              </button>
            ))}
          </div>
          {errors.priority && <p className='text-sm text-rose-500 mt-1'>{errors.priority}</p>}
        </div>

        {/* Error message */}
        {mutation.isError && (
          <div className='p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg'>
            <p className='text-sm text-rose-400'>Erro ao atualizar prioridade. Tente novamente.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
