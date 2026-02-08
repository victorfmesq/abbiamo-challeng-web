import { Table, Thead, Tbody, Tr, Th, Td, Badge, Checkbox } from '@/shared/components';
import type { DeliveryDto, DeliveryStatus } from '@/features/deliveries/types';
import { formatIsoToLocale } from '@/shared/utils/date';
import { RowActionsMenu } from './RowActionsMenu';

interface DeliveriesTableProps {
  deliveries: DeliveryDto[];
  selectedIds: Set<string>;
  onRowClick?: (delivery: DeliveryDto) => void;
  onToggleSelect: (id: string) => void;
  onOpenReschedule: (ids: string[]) => void;
  onOpenAssignDriver: (ids: string[]) => void;
  onOpenPriority: (ids: string[]) => void;
}

const statusConfig: Record<
  DeliveryStatus,
  { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }
> = {
  PENDING: { variant: 'info', label: 'Pendente' },
  DISPATCHED: { variant: 'info', label: 'Despachado' },
  IN_ROUTE: { variant: 'info', label: 'Em rota' },
  DELIVERED: { variant: 'success', label: 'Entregue' },
  DELAYED: { variant: 'warning', label: 'Atrasado' },
  FAILED: { variant: 'danger', label: 'Falhou' },
};

export function DeliveriesTable({
  deliveries,
  selectedIds,
  onRowClick,
  onToggleSelect,
  onOpenReschedule,
  onOpenAssignDriver,
  onOpenPriority,
}: DeliveriesTableProps) {
  if (deliveries.length === 0) {
    return (
      <div className='flex items-center justify-center py-12'>
        <p className='text-slate-400'>Nenhuma entrega encontrada</p>
      </div>
    );
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th className='w-12'></Th>
          <Th>Código</Th>
          <Th>Destinatário</Th>
          <Th>Status</Th>
          <Th>Previsão</Th>
          <Th className='w-12'></Th>
        </Tr>
      </Thead>
      <Tbody>
        {deliveries.map((delivery) => {
          const status = statusConfig[delivery.status];
          const isSelected = selectedIds.has(delivery.id);
          return (
            <Tr
              key={delivery.id}
              onClick={() => onRowClick?.(delivery)}
              className={onRowClick ? 'cursor-pointer group' : 'group'}
            >
              <Td onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  state={isSelected ? 'full' : 'none'}
                  onChange={() => onToggleSelect(delivery.id)}
                  aria-label={`Selecionar entrega ${delivery.tracking_code}`}
                />
              </Td>
              <Td className='font-mono text-sm'>{delivery.tracking_code}</Td>
              <Td>{delivery.recipient.name}</Td>
              <Td>
                <Badge variant={status.variant}>{status.label}</Badge>
              </Td>
              <Td className='text-slate-400'>{formatIsoToLocale(delivery.expected_delivery_at)}</Td>
              <Td onClick={(e) => e.stopPropagation()}>
                <RowActionsMenu
                  deliveryId={delivery.id}
                  onOpenReschedule={onOpenReschedule}
                  onOpenAssignDriver={onOpenAssignDriver}
                  onOpenPriority={onOpenPriority}
                />
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
