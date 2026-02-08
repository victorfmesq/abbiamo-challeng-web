import { useState, useEffect, useMemo } from 'react';
import { Modal, ModalFooter } from '@/shared/components';
import { Input } from '@/shared/components/Input';
import { useBulkAssignDriver } from '../hooks/useBulkAssignDriver';
import { useDrivers } from '@/features/drivers/hooks/useDrivers';
import type { DeliveryDto } from '../types';
import type { DriverDto } from '@/features/drivers/types';

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryIds: string[];
  deliveries?: DeliveryDto[];
  onSuccess?: () => void;
}

export function AssignDriverModal({
  isOpen,
  onClose,
  deliveryIds,
  deliveries = [],
  onSuccess,
}: AssignDriverModalProps) {
  const [driverId, setDriverId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<{ driver?: string }>({});

  const { data: driversData, isLoading: isLoadingDrivers } = useDrivers();
  const mutation = useBulkAssignDriver();

  // Filter drivers by search term
  const filteredDrivers =
    driversData?.data?.filter(
      (driver) =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.id.includes(searchTerm)
    ) || [];

  const deliveryIdsKey = useMemo(() => deliveryIds.join(','), [deliveryIds]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setDriverId('');
        setSearchTerm('');
        setErrors({});
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, deliveryIdsKey]);

  const validate = () => {
    const newErrors: { driver?: string } = {};

    if (!driverId) {
      newErrors.driver = 'Selecione um motorista';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    mutation.mutate(
      {
        deliveryIds,
        driverId,
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
      title='Atribuir motorista'
      size='md'
      footer={
        <ModalFooter
          onCancel={onClose}
          onConfirm={handleSubmit}
          isLoading={mutation.isPending}
          confirmLabel='Atribuir'
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
            Você está atribuindo motorista para <strong>{deliveryIds.length}</strong> entrega
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
                  {delivery.assigned_driver ? (
                    <span className='text-xs text-amber-400'>
                      Motorista: {delivery.assigned_driver}
                    </span>
                  ) : (
                    <span className='text-xs text-slate-500'>Sem motorista</span>
                  )}
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

        {/* Driver Search/Select */}
        <div className='space-y-1'>
          <label htmlFor='driverSearch' className='block text-sm font-medium text-slate-300'>
            Motorista <span className='text-rose-400'>*</span>
          </label>

          {/* Search input */}
          <Input
            id='driverSearch'
            type='text'
            placeholder='Buscar motorista por nome...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            error={!!errors.driver}
            errorMessage={errors.driver}
            autoComplete='off'
          />

          {/* Driver list */}
          <div className='max-h-48 overflow-auto space-y-1 mt-2 border border-slate-700 rounded-lg'>
            {isLoadingDrivers ? (
              <div className='p-4 text-center text-slate-400'>
                <svg className='h-5 w-5 animate-spin mx-auto' fill='none' viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                  />
                </svg>
                <span className='text-sm mt-2 block'>Carregando...</span>
              </div>
            ) : filteredDrivers.length === 0 ? (
              <div className='p-4 text-center text-slate-400'>
                <span className='text-sm'>Nenhum motorista encontrado</span>
              </div>
            ) : (
              filteredDrivers.map((driver) => (
                <button
                  key={driver.id}
                  type='button'
                  onClick={() => {
                    setDriverId(driver.id);
                    setSearchTerm(driver.name);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-slate-800 transition-colors ${
                    driverId === driver.id ? 'bg-indigo-500/20 border-l-2 border-indigo-500' : ''
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <div className='h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center'>
                      <span className='text-sm font-medium text-slate-300'>
                        {driver.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className='block text-slate-100'>{driver.name}</span>
                      <span className='block text-xs text-slate-500'>
                        {driver.vehicle?.model || 'Sem veículo'}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      driver.status === 'AVAILABLE'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : driver.status === 'BUSY'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {driver.status === 'AVAILABLE'
                      ? 'Disponível'
                      : driver.status === 'BUSY'
                        ? 'Ocupado'
                        : 'Offline'}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Error message */}
        {mutation.isError && (
          <div className='p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg'>
            <p className='text-sm text-rose-400'>Erro ao atribuir motorista. Tente novamente.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
