import { useState, useEffect, useMemo } from 'react';
import { Modal, ModalFooter } from '@/shared/components';
import { Input } from '@/shared/components/Input';
import { useBulkReschedule } from '../hooks/useBulkReschedule';
import type { DeliveryDto } from '../types';

interface RescheduleDeliveriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryIds: string[];
  deliveries?: DeliveryDto[];
  onSuccess?: () => void;
}

export function RescheduleDeliveriesModal({
  isOpen,
  onClose,
  deliveryIds,
  deliveries = [],
  onSuccess,
}: RescheduleDeliveriesModalProps) {
  const [newDate, setNewDate] = useState('');
  const [errors, setErrors] = useState<{ date?: string }>({});

  const mutation = useBulkReschedule();

  // Get minimum date (now)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const deliveryIdsKey = useMemo(() => deliveryIds.join(','), [deliveryIds]);

  // Reset form when modal opens - using deliveryIds as dependency
  // to reset form each time the modal opens with new ids
  useEffect(() => {
    if (isOpen) {
      // Use setTimeout to avoid synchronous state updates in effects
      const timer = setTimeout(() => {
        setNewDate('');
        setErrors({});
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, deliveryIdsKey]);

  const validate = () => {
    const newErrors: { date?: string } = {};

    if (!newDate) {
      newErrors.date = 'A nova data é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    mutation.mutate(
      {
        deliveryIds,
        newExpectedDate: newDate,
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
      title='Reagendar entregas'
      size='md'
      footer={
        <ModalFooter
          onCancel={onClose}
          onConfirm={handleSubmit}
          isLoading={mutation.isPending}
          confirmLabel='Reagendar'
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
            Você está reagendando <strong>{deliveryIds.length}</strong> entrega
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
                  <span className='text-slate-500'>{delivery.recipient.name}</span>
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

        {/* New Date Input */}
        <div className='space-y-1'>
          <label htmlFor='newDate' className='block text-sm font-medium text-slate-300'>
            Nova data de entrega <span className='text-rose-400'>*</span>
          </label>
          <Input
            id='newDate'
            type='datetime-local'
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            min={getMinDateTime()}
            error={!!errors.date}
            errorMessage={errors.date}
            placeholder='Selecione a nova data'
          />
        </div>

        {/* Error message */}
        {mutation.isError && (
          <div className='p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg'>
            <p className='text-sm text-rose-400'>Erro ao reagendar entregas. Tente novamente.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
