import { useState, useMemo } from 'react';
import {
  Button,
  Badge,
  DataTableWithLayout,
  type DataTableColumn,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
} from '@/shared/components';
import { DeliveryDetailsModal } from '../components/DeliveryDetailsModal';
import { DeliveriesFilterBar } from '../components/DeliveriesFilterBar';
import { BulkActionsDropdown } from '../components/BulkActionsDropdown';
import { RescheduleDeliveriesModal } from '../components/RescheduleDeliveriesModal';
import { AssignDriverModal } from '../components/AssignDriverModal';
import { UpdatePriorityModal } from '../components/UpdatePriorityModal';
import { RowActionsMenu } from '../components/RowActionsMenu';
import { useDeliveries } from '../hooks/useDeliveries';
import type { DeliveriesFilters } from '../domain/deliveriesFilters';
import type { DeliveryDto, DeliveryStatus } from '@/features/deliveries/types';
import { formatIsoToLocale } from '@/shared/utils/date';

const defaultFilters: DeliveriesFilters = {
  page: 1,
  limit: 10,
};

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

const columns: DataTableColumn<DeliveryDto>[] = [
  { key: 'tracking_code', header: 'Código', cellClassName: 'font-mono text-sm' },
  { key: 'recipient', header: 'Destinatário', render: (row) => row.recipient.name },
  {
    key: 'status',
    header: 'Status',
    render: (row) => {
      const status = statusConfig[row.status];
      return <Badge variant={status.variant}>{status.label}</Badge>;
    },
  },
  {
    key: 'date',
    header: 'Data',
    cellClassName: 'text-slate-400',
    render: (row) => formatIsoToLocale(row.created_at),
  },
];

export function DeliveriesListPage() {
  const [filters, setFilters] = useState<DeliveriesFilters>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal states
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [assignDriverModalOpen, setAssignDriverModalOpen] = useState(false);
  const [priorityModalOpen, setPriorityModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [actionDeliveryIds, setActionDeliveryIds] = useState<string[]>([]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useDeliveries(filters);

  const handleFiltersChange = (newFilters: DeliveriesFilters) => {
    setFilters(newFilters);
  };

  const handleRowClick = (delivery: DeliveryDto) => {
    setSelectedDeliveryId(delivery.id);
    setDetailsModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    // Reset to first page when limit changes
    setFilters({ ...filters, limit: newLimit, page: 1 });
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    const currentPageIds = data?.data.map((d) => d.id) || [];
    const allSelected =
      currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.has(id));

    if (allSelected) {
      // Deselect ALL items (clear entire state)
      setSelectedIds(new Set());
    } else {
      // Select all items from current page
      setSelectedIds((prev) => {
        const next = new Set(prev);
        currentPageIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const selectAllState = useMemo(() => {
    const currentPageIds = data?.data.map((d) => d.id) || [];

    if (currentPageIds.length === 0) return 'none' as const;

    const allSelected = currentPageIds.every((id) => selectedIds.has(id));
    const someSelected = currentPageIds.some((id) => selectedIds.has(id));

    if (allSelected) return 'full' as const;
    if (someSelected) return 'partial' as const;

    return 'none' as const;
  }, [data?.data, selectedIds]);

  // Bulk action handlers
  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleOpenReschedule = (ids: string[]) => {
    setActionDeliveryIds(ids);
    setRescheduleModalOpen(true);
  };

  const handleOpenAssignDriver = (ids: string[]) => {
    setActionDeliveryIds(ids);
    setAssignDriverModalOpen(true);
  };

  const handleOpenPriority = (ids: string[]) => {
    setActionDeliveryIds(ids);
    setPriorityModalOpen(true);
  };

  // Get deliveries for preview in modals
  const getDeliveriesForPreview = (ids: string[]): DeliveryDto[] => {
    return data?.data.filter((d) => ids.includes(d.id)) || [];
  };

  // Render table row
  const renderRow = (delivery: DeliveryDto) => {
    const status = statusConfig[delivery.status];
    const isSelected = selectedIds.has(delivery.id);

    return (
      <Tr
        key={delivery.id}
        onClick={() => handleRowClick(delivery)}
        className={'cursor-pointer group hover:bg-slate-800/50'}
      >
        <Td onClick={(e) => e.stopPropagation()}>
          <Checkbox
            state={isSelected ? 'full' : 'none'}
            onChange={() => handleToggleSelect(delivery.id)}
            aria-label={`Selecionar entrega ${delivery.tracking_code}`}
          />
        </Td>
        <Td className='font-mono text-sm'>{delivery.tracking_code}</Td>
        <Td>{delivery.recipient.name}</Td>
        <Td>
          <Badge variant={status.variant}>{status.label}</Badge>
        </Td>
        <Td className='text-slate-400'>{formatIsoToLocale(delivery.created_at)}</Td>
        <Td onClick={(e) => e.stopPropagation()}>
          <RowActionsMenu
            deliveryId={delivery.id}
            onOpenReschedule={handleOpenReschedule}
            onOpenAssignDriver={handleOpenAssignDriver}
            onOpenPriority={handleOpenPriority}
          />
        </Td>
      </Tr>
    );
  };

  return (
    <div className='flex flex-col flex-1 min-h-0 gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold text-slate-100'>Entregas</h1>

        <Button onClick={() => refetch()}>Atualizar</Button>
      </div>

      {/* Filters - Stack on mobile, inline on desktop */}
      <div className='p-4 shrink-0 bg-slate-900 rounded-xl border border-slate-700'>
        <DeliveriesFilterBar filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      {/* Table Container - Controlled height with flex layout */}
      <div className='flex flex-col flex-1 min-h-0'>
        <DataTableWithLayout
          data={data?.data || []}
          columns={columns}
          selectedIds={selectedIds}
          onRowClick={handleRowClick}
          onToggleSelect={handleToggleSelect}
          selectAllState={selectAllState}
          onToggleSelectAll={handleToggleSelectAll}
          selectedCount={selectedIds.size}
          pagination={
            data?.meta
              ? {
                  page: data.meta.page,
                  limit: data.meta.limit,
                  total: data.meta.total,
                  totalPages: data.meta.totalPages,
                }
              : undefined
          }
          isLoading={isLoading}
          error={isError ? (error instanceof Error ? error.message : 'Erro desconhecido') : null}
          onRetry={() => refetch()}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          bulkActions={
            selectedIds.size > 0 && (
              <BulkActionsDropdown
                selectedIds={Array.from(selectedIds)}
                onClearSelection={handleClearSelection}
                onOpenReschedule={handleOpenReschedule}
                onOpenAssignDriver={handleOpenAssignDriver}
                onOpenPriority={handleOpenPriority}
              />
            )
          }
        >
          {/* Custom table content with row actions column */}
          <Table>
            <Thead>
              <Tr>
                <Th className='w-12'></Th>
                <Th>Código</Th>
                <Th>Destinatário</Th>
                <Th>Status</Th>
                <Th>Data</Th>
                <Th className='w-12'></Th>
              </Tr>
            </Thead>
            <Tbody>{data?.data.map(renderRow)}</Tbody>
          </Table>
        </DataTableWithLayout>
      </div>

      {/* Modals */}
      <RescheduleDeliveriesModal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        deliveryIds={actionDeliveryIds}
        deliveries={getDeliveriesForPreview(actionDeliveryIds)}
        onSuccess={() => setSelectedIds(new Set())}
      />

      <AssignDriverModal
        isOpen={assignDriverModalOpen}
        onClose={() => setAssignDriverModalOpen(false)}
        deliveryIds={actionDeliveryIds}
        deliveries={getDeliveriesForPreview(actionDeliveryIds)}
        onSuccess={() => setSelectedIds(new Set())}
      />

      <UpdatePriorityModal
        isOpen={priorityModalOpen}
        onClose={() => setPriorityModalOpen(false)}
        deliveryIds={actionDeliveryIds}
        deliveries={getDeliveriesForPreview(actionDeliveryIds)}
        onSuccess={() => setSelectedIds(new Set())}
      />

      {selectedDeliveryId && (
        <DeliveryDetailsModal
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedDeliveryId(null);
          }}
          deliveryId={selectedDeliveryId}
        />
      )}
    </div>
  );
}
