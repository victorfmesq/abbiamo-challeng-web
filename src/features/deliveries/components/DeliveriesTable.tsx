import { Table, Thead, Tbody, Tr, Th, Td, Badge, Card } from '@/shared/components';
import type { DeliveryDto, DeliveryStatus } from '@/features/deliveries/types';
import { formatIsoToLocale } from '@/shared/utils/date';

interface DeliveriesTableProps {
  deliveries: DeliveryDto[];
  onRowClick?: (delivery: DeliveryDto) => void;
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

export function DeliveriesTable({ deliveries, onRowClick }: DeliveriesTableProps) {
  if (deliveries.length === 0) {
    return (
      <Card className='flex items-center justify-center py-12'>
        <p className='text-slate-400'>Nenhuma entrega encontrada</p>
      </Card>
    );
  }

  return (
    <Card className='overflow-hidden'>
      <Table>
        <Thead>
            <Tr>
              <Th>Código</Th>
              <Th>Destinatário</Th>
              <Th>Status</Th>
              <Th>Data</Th>
            </Tr>
          </Thead>
          <Tbody>
            {deliveries.map((delivery) => {
              const status = statusConfig[delivery.status];
              return (
                <Tr
                  key={delivery.id}
                  onClick={() => onRowClick?.(delivery)}
                  className={onRowClick ? 'cursor-pointer' : ''}
                >
                  <Td className='font-mono text-sm'>{delivery.tracking_code}</Td>
                  <Td>{delivery.recipient.name}</Td>
                  <Td>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </Td>
                  <Td className='text-slate-400'>{formatIsoToLocale(delivery.created_at)}</Td>
                </Tr>
              );
            })}
          </Tbody>
      </Table>
    </Card>
  );
}
