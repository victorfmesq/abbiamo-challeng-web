import type { OverdueDelivery, UrgentInRouteDelivery, FailedDelivery } from '../types';

import { Table, Thead, Tbody, Tr, Th, Td } from '@/shared/components/Table';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { Card, CardHeader, CardContent } from '@/shared/components/Card';
import { formatIsoToLocale } from '@/shared/utils/date';

// ============================================================================
// Types
// ============================================================================

export interface DashboardActionTablesProps {
  overdueDeliveries: OverdueDelivery[];
  urgentInRouteDeliveries: UrgentInRouteDelivery[];
  failedDeliveries: FailedDelivery[];
  isLoading?: boolean;
  onViewDetails: (id: string) => void;
}

// ============================================================================
// Constants & Utilities
// ============================================================================

const MAX_ROWS = 8;

const priorityLabels: Record<string, string> = {
  LOW: 'Baixa',
  NORMAL: 'Normal',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};

const priorityVariants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  LOW: 'success',
  NORMAL: 'info',
  HIGH: 'warning',
  URGENT: 'danger',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  DISPATCHED: 'Despachada',
  IN_ROUTE: 'Em rota',
  DELIVERED: 'Entregue',
  DELAYED: 'Atrasada',
  FAILED: 'Falhou',
};

const statusVariants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  PENDING: 'info',
  DISPATCHED: 'info',
  IN_ROUTE: 'info',
  DELIVERED: 'success',
  DELAYED: 'warning',
  FAILED: 'danger',
} as const;

/**
 * Format delay duration for overdue deliveries
 * - Less than 1 hour: "XX min"
 * - Less than 24 hours: "Xh"
 * - More than 24 hours: "Xd Xh"
 */
function formatDelay(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min`;
  }
  if (hours < 24) {
    return `${Math.round(hours)}h`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  return `${days}d ${remainingHours}h`;
}

// ============================================================================
// Skeleton Component
// ============================================================================

function SkeletonRow() {
  return (
    <Tr>
      <Td>
        <div className='h-4 w-24 animate-pulse rounded bg-slate-700' />
      </Td>
      <Td>
        <div className='h-4 w-32 animate-pulse rounded bg-slate-700' />
      </Td>
      <Td>
        <div className='h-4 w-16 animate-pulse rounded bg-slate-700' />
      </Td>
      <Td>
        <div className='h-4 w-20 animate-pulse rounded bg-slate-700' />
      </Td>
      <Td>
        <div className='h-4 w-16 animate-pulse rounded bg-slate-700' />
      </Td>
      <Td className='w-20'>
        <div className='h-8 w-20 animate-pulse rounded bg-slate-700' />
      </Td>
    </Tr>
  );
}

// ============================================================================
// Empty State Component
// ============================================================================

function EmptyState({ message }: { message: string }) {
  return (
    <div className='flex flex-col items-center justify-center py-8 text-center'>
      <svg
        className='h-12 w-12 text-slate-600'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
      <p className='mt-3 text-sm text-slate-400'>{message}</p>
    </div>
  );
}

// ============================================================================
// Micro-Table Components
// ============================================================================

/**
 * Table 1: Overdue Deliveries (Most Critical)
 * Filter: expected_delivery_at < now && status != DELIVERED
 * Ordering: delay → priority → status
 */
function OverdueDeliveriesTable({
  deliveries,
  isLoading,
  onViewDetails,
}: {
  deliveries: OverdueDelivery[];
  isLoading?: boolean;
  onViewDetails: (id: string) => void;
}) {
  const displayDeliveries = deliveries.slice(0, MAX_ROWS);
  const isEmpty = !isLoading && deliveries.length === 0;

  return (
    <Card>
      <CardHeader>
        <h3 className='text-base font-semibold text-slate-100'>Entregas Atrasadas</h3>
        <p className='text-sm text-slate-400 mt-1'>Requerem ação imediata</p>
      </CardHeader>
      <CardContent className='p-0'>
        {isLoading ? (
          <div className='overflow-x-auto'>
            <Table>
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Destinatário</Th>
                  <Th>Atraso</Th>
                  <Th>Status</Th>
                  <Th>Prioridade</Th>
                  <Th className='w-24'>Ação</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </Tbody>
            </Table>
          </div>
        ) : isEmpty ? (
          <EmptyState message='Nenhuma entrega atrasada' />
        ) : (
          <div className='overflow-x-auto'>
            <Table>
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Destinatário</Th>
                  <Th>Atraso</Th>
                  <Th>Status</Th>
                  <Th>Prioridade</Th>
                  <Th className='w-24'>Ação</Th>
                </Tr>
              </Thead>
              <Tbody>
                {displayDeliveries.map((delivery) => (
                  <Tr key={delivery.id}>
                    <Td>
                      <button
                        onClick={() => onViewDetails(delivery.id)}
                        className='font-mono text-sm text-indigo-400 hover:text-indigo-300 hover:underline text-left'
                      >
                        {delivery.tracking_code}
                      </button>
                    </Td>
                    <Td className='text-slate-200'>{delivery.recipient.name}</Td>
                    <Td>
                      <Badge variant='danger'>{formatDelay(delivery.delay_hours)}</Badge>
                    </Td>
                    <Td>
                      <Badge variant={statusVariants[delivery.status] || 'info'}>
                        {statusLabels[delivery.status] || delivery.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge variant={priorityVariants[delivery.priority] || 'info'}>
                        {priorityLabels[delivery.priority] || delivery.priority}
                      </Badge>
                    </Td>
                    <Td>
                      <Button variant='ghost' size='sm' onClick={() => onViewDetails(delivery.id)}>
                        Ver detalhes
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Table 2: Urgent In-Route Deliveries
 * Filter: priority IN (URGENT, HIGH) AND status = IN_ROUTE
 */
function UrgentInRouteTable({
  deliveries,
  isLoading,
  onViewDetails,
}: {
  deliveries: UrgentInRouteDelivery[];
  isLoading?: boolean;
  onViewDetails: (id: string) => void;
}) {
  const displayDeliveries = deliveries.slice(0, MAX_ROWS);
  const isEmpty = !isLoading && deliveries.length === 0;

  return (
    <Card>
      <CardHeader>
        <h3 className='text-base font-semibold text-slate-100'>Urgentes em Rota</h3>
        <p className='text-sm text-slate-400 mt-1'>Acompanhar de perto</p>
      </CardHeader>
      <CardContent className='p-0'>
        {isLoading ? (
          <div className='overflow-x-auto'>
            <Table>
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Destinatário</Th>
                  <Th>Previsão</Th>
                  <Th>Prioridade</Th>
                  <Th className='w-24'>Ação</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </Tbody>
            </Table>
          </div>
        ) : isEmpty ? (
          <EmptyState message='Nenhuma entrega urgente em rota' />
        ) : (
          <div className='overflow-x-auto'>
            <Table>
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Destinatário</Th>
                  <Th>Previsão</Th>
                  <Th>Prioridade</Th>
                  <Th className='w-24'>Ação</Th>
                </Tr>
              </Thead>
              <Tbody>
                {displayDeliveries.map((delivery) => (
                  <Tr key={delivery.id}>
                    <Td>
                      <button
                        onClick={() => onViewDetails(delivery.id)}
                        className='font-mono text-sm text-indigo-400 hover:text-indigo-300 hover:underline text-left'
                      >
                        {delivery.tracking_code}
                      </button>
                    </Td>
                    <Td className='text-slate-200'>{delivery.recipient.name}</Td>
                    <Td className='text-slate-300'>
                      {formatIsoToLocale(delivery.expected_delivery_at)}
                    </Td>
                    <Td>
                      <Badge variant={priorityVariants[delivery.priority] || 'warning'}>
                        {priorityLabels[delivery.priority] || delivery.priority}
                      </Badge>
                    </Td>
                    <Td>
                      <Button variant='ghost' size='sm' onClick={() => onViewDetails(delivery.id)}>
                        Ver detalhes
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Table 3: Recent Failures
 * Filter: status = FAILED or DELAYED
 * Ordering: most recent event first
 */
function FailedDeliveriesTable({
  deliveries,
  isLoading,
  onViewDetails,
}: {
  deliveries: FailedDelivery[];
  isLoading?: boolean;
  onViewDetails: (id: string) => void;
}) {
  const displayDeliveries = deliveries.slice(0, MAX_ROWS);
  const isEmpty = !isLoading && deliveries.length === 0;

  return (
    <Card>
      <CardHeader>
        <h3 className='text-base font-semibold text-slate-100'>Falhas Recentes</h3>
        <p className='text-sm text-slate-400 mt-1'>Requerem suporte e operação</p>
      </CardHeader>
      <CardContent className='p-0'>
        {isLoading ? (
          <div className='overflow-x-auto'>
            <Table>
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Destinatário</Th>
                  <Th>Previsão</Th>
                  <Th>Status</Th>
                  <Th>Motivo</Th>
                  <Th className='w-24'>Ação</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </Tbody>
            </Table>
          </div>
        ) : isEmpty ? (
          <EmptyState message='Nenhuma falha recente' />
        ) : (
          <div className='overflow-x-auto'>
            <Table>
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Destinatário</Th>
                  <Th>Previsão</Th>
                  <Th>Status</Th>
                  <Th>Motivo</Th>
                  <Th className='w-24'>Ação</Th>
                </Tr>
              </Thead>
              <Tbody>
                {displayDeliveries.map((delivery) => (
                  <Tr key={delivery.id}>
                    <Td>
                      <button
                        onClick={() => onViewDetails(delivery.id)}
                        className='font-mono text-sm text-indigo-400 hover:text-indigo-300 hover:underline text-left'
                      >
                        {delivery.tracking_code}
                      </button>
                    </Td>
                    <Td className='text-slate-200'>{delivery.recipient.name}</Td>
                    <Td className='text-slate-300'>
                      {formatIsoToLocale(delivery.expected_delivery_at)}
                    </Td>
                    <Td>
                      <Badge variant={statusVariants[delivery.status] || 'warning'}>
                        {statusLabels[delivery.status] || delivery.status}
                      </Badge>
                    </Td>
                    <Td className='text-slate-400 max-w-xs truncate'>
                      {delivery.failure_reason || '-'}
                    </Td>
                    <Td>
                      <Button variant='ghost' size='sm' onClick={() => onViewDetails(delivery.id)}>
                        Ver detalhes
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function DashboardActionTables({
  overdueDeliveries,
  urgentInRouteDeliveries,
  failedDeliveries,
  isLoading,
  onViewDetails,
}: DashboardActionTablesProps) {
  return (
    <section className='space-y-6'>
      {/* Table 1: Overdue Deliveries */}
      <OverdueDeliveriesTable
        deliveries={overdueDeliveries}
        isLoading={isLoading}
        onViewDetails={onViewDetails}
      />

      {/* Table 2: Urgent In-Route */}
      <UrgentInRouteTable
        deliveries={urgentInRouteDeliveries}
        isLoading={isLoading}
        onViewDetails={onViewDetails}
      />

      {/* Table 3: Recent Failures */}
      <FailedDeliveriesTable
        deliveries={failedDeliveries}
        isLoading={isLoading}
        onViewDetails={onViewDetails}
      />
    </section>
  );
}
