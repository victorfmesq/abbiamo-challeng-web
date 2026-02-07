import { useState, type ChangeEvent } from 'react';
import { Input, Button } from '@/shared/components';
import type { DeliveryStatus } from '@/features/deliveries/types';
import type { DeliveriesFilters } from '@/features/deliveries/domain/deliveriesFilters';

interface DeliveriesFilterBarProps {
  filters: DeliveriesFilters;
  onFiltersChange: (filters: DeliveriesFilters) => void;
}

const statusOptions: { value: DeliveryStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos os status' },
  { value: 'PENDING', label: 'Pendente' },
  { value: 'DISPATCHED', label: 'Despachado' },
  { value: 'IN_ROUTE', label: 'Em rota' },
  { value: 'DELIVERED', label: 'Entregue' },
  { value: 'DELAYED', label: 'Atrasado' },
  { value: 'FAILED', label: 'Falhou' },
];

export function DeliveriesFilterBar({ filters, onFiltersChange }: DeliveriesFilterBarProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState<DeliveryStatus | 'all'>(filters.status || 'all');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFiltersChange({ ...filters, search: value || undefined, page: 1 });
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as DeliveryStatus | 'all';
    setStatus(value);
    onFiltersChange({ ...filters, status: value === 'all' ? undefined : value, page: 1 });
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('all');
    onFiltersChange({ page: 1, limit: filters.limit });
  };

  const hasActiveFilters = search || status !== 'all';

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex flex-1 gap-3'>
        <div className='w-full sm:w-64'>
          <Input
            placeholder='Buscar por código ou destinatário...'
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        {/* TODO: Extract to shared Select component */}
        <select
          value={status}
          onChange={handleStatusChange}
          className='rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500'
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {hasActiveFilters && (
        <Button variant='ghost' onClick={handleClearFilters}>
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
