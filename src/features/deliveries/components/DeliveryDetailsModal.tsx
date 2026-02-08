import { Modal } from '@/shared/components';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { useDelivery } from '../hooks/useDelivery';
import type { DeliveryStatus, DeliveryPriority } from '../types';

interface DeliveryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryId: string;
}

const statusLabels: Record<DeliveryStatus, string> = {
  PENDING: 'Pendente',
  DISPATCHED: 'Despachada',
  IN_ROUTE: 'Em rota',
  DELIVERED: 'Entregue',
  DELAYED: 'Atrasada',
  FAILED: 'Falhou',
};

const statusVariants: Record<DeliveryStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  PENDING: 'warning',
  DISPATCHED: 'info',
  IN_ROUTE: 'info',
  DELIVERED: 'success',
  DELAYED: 'warning',
  FAILED: 'danger',
};

const priorityLabels: Record<DeliveryPriority, string> = {
  LOW: 'Baixa',
  NORMAL: 'Normal',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};

const priorityVariants: Record<DeliveryPriority, 'success' | 'warning' | 'danger' | 'info'> = {
  LOW: 'success',
  NORMAL: 'info',
  HIGH: 'warning',
  URGENT: 'danger',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('pt-BR');
}

function LoadingState() {
  return (
    <div className='flex flex-col items-center justify-center py-12'>
      <svg className='h-8 w-8 animate-spin text-indigo-400' fill='none' viewBox='0 0 24 24'>
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
      <span className='text-sm text-slate-400 mt-3'>Carregando detalhes...</span>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className='flex flex-col items-center justify-center py-12'>
      <svg
        className='h-12 w-12 text-rose-400'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        />
      </svg>
      <span className='text-sm text-rose-400 mt-3'>{message}</span>
    </div>
  );
}

export function DeliveryDetailsModal({ isOpen, onClose, deliveryId }: DeliveryDetailsModalProps) {
  const { data: delivery, isLoading, isError, error } = useDelivery(deliveryId);

  const statusVariant = delivery ? statusVariants[delivery.status] : 'info';
  const priorityVariant = delivery ? priorityVariants[delivery.priority] : 'info';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Detalhes da Entrega'
      size='lg'
      footer={
        <Button variant='secondary' onClick={onClose}>
          Fechar
        </Button>
      }
    >
      {isLoading && <LoadingState />}

      {isError && (
        <ErrorState
          message={error instanceof Error ? error.message : 'Erro ao carregar detalhes'}
        />
      )}

      {delivery && !isLoading && !isError && (
        <div className='space-y-6'>
          {/* Header Section */}
          <div className='flex flex-col gap-3 pb-4 border-b border-slate-700'>
            <div className='flex items-center justify-between'>
              <span className='font-mono text-lg text-slate-100'>{delivery.tracking_code}</span>
              <div className='flex items-center gap-2'>
                <Badge variant={statusVariant}>{statusLabels[delivery.status]}</Badge>
                <Badge variant={priorityVariant}>{priorityLabels[delivery.priority]}</Badge>
              </div>
            </div>
            {delivery.assigned_driver && (
              <div className='flex items-center gap-2 text-sm'>
                <span className='text-slate-400'>Motorista:</span>
                <span className='text-slate-200'>{delivery.assigned_driver}</span>
              </div>
            )}
          </div>

          {/* Recipient Section */}
          <div className='space-y-3'>
            <h3 className='text-sm font-medium text-slate-300 uppercase tracking-wider'>
              Destinatário
            </h3>
            <div className='bg-slate-800/50 rounded-lg p-4 space-y-2 border border-slate-700'>
              <div className='flex items-start gap-2'>
                <svg
                  className='h-5 w-5 text-slate-400 mt-0.5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
                <div>
                  <p className='text-slate-100'>{delivery.recipient.name}</p>
                  <p className='text-sm text-slate-400'>{delivery.recipient.document}</p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <svg
                  className='h-5 w-5 text-slate-400 mt-0.5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                  />
                </svg>
                <p className='text-slate-200'>{delivery.recipient.phone}</p>
              </div>
              <div className='flex items-start gap-2'>
                <svg
                  className='h-5 w-5 text-slate-400 mt-0.5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
                <div>
                  <p className='text-slate-200'>
                    {delivery.recipient.address.street}, {delivery.recipient.address.number}
                  </p>
                  {delivery.recipient.address.complement && (
                    <p className='text-sm text-slate-400'>
                      {delivery.recipient.address.complement}
                    </p>
                  )}
                  <p className='text-sm text-slate-400'>
                    {delivery.recipient.address.neighborhood}, {delivery.recipient.address.city} -{' '}
                    {delivery.recipient.address.state}
                  </p>
                  <p className='text-sm text-slate-400'>{delivery.recipient.address.zip_code}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Attempts Section */}
          <div className='space-y-3'>
            <h3 className='text-sm font-medium text-slate-300 uppercase tracking-wider'>
              Informações de Entrega
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-slate-800/50 rounded-lg p-4 border border-slate-700'>
                <p className='text-sm text-slate-400'>Tentativas</p>
                <p className='text-lg text-slate-100 font-medium'>{delivery.delivery_attempts}</p>
              </div>
              <div className='bg-slate-800/50 rounded-lg p-4 border border-slate-700'>
                <p className='text-sm text-slate-400'>Previsão</p>
                <p className='text-sm text-slate-100'>
                  {formatDate(delivery.expected_delivery_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className='space-y-3'>
            <h3 className='text-sm font-medium text-slate-300 uppercase tracking-wider'>
              Histórico
            </h3>
            <div className='relative'>
              {/* Vertical line */}
              <div className='absolute left-3 top-0 bottom-0 w-0.5 bg-slate-700' />

              <div className='space-y-4'>
                {delivery.timeline.map((event) => (
                  <div key={event.id} className='relative flex gap-4 pl-10'>
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        event.status === 'DELIVERED'
                          ? 'bg-emerald-500/20 border-2 border-emerald-500'
                          : event.status === 'FAILED' || event.status === 'DELAYED'
                            ? 'bg-rose-500/20 border-2 border-rose-500'
                            : 'bg-slate-700 border-2 border-slate-600'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          event.status === 'DELIVERED'
                            ? 'bg-emerald-400'
                            : event.status === 'FAILED' || event.status === 'DELAYED'
                              ? 'bg-rose-400'
                              : 'bg-slate-400'
                        }`}
                      />
                    </div>

                    {/* Event content */}
                    <div className='flex-1 pb-4'>
                      <div className='flex items-center gap-2 mb-1'>
                        <Badge variant={statusVariants[event.status]} className='text-xs'>
                          {statusLabels[event.status]}
                        </Badge>
                        <span className='text-xs text-slate-500'>
                          {formatDate(event.timestamp)}
                        </span>
                      </div>
                      <p className='text-sm text-slate-200'>
                        <span className='text-slate-400'>por </span>
                        {event.actor}
                      </p>
                      {event.notes && (
                        <p className='text-sm text-slate-400 mt-1 italic'>{event.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
