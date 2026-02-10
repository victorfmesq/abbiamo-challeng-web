import { useState, useEffect, type ChangeEvent } from 'react';
import { Input, Button, Select } from '@/shared/components';
import type { DeliveryStatus } from '@/features/deliveries/types';
import type { DeliveriesFilters } from '../domain/deliveriesFilters';
import { DeliveryDateFilter, type DeliveryDateFilterValue } from './DeliveryDateFilter';

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

const SEARCH_DEBOUNCE_MS = 1000;

function formatLocalDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function quickFilterToDateRange(
  quickFilter: 'today' | 'tomorrow' | 'thisWeek' | null
): { dateFrom: string; dateTo: string } | null {
  if (!quickFilter) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());

  const thisWeekEnd = new Date(today);
  thisWeekEnd.setDate(today.getDate() + (6 - today.getDay()));

  switch (quickFilter) {
    case 'today':
      return { dateFrom: formatLocalDate(today), dateTo: formatLocalDate(today) };
    case 'tomorrow':
      return { dateFrom: formatLocalDate(tomorrow), dateTo: formatLocalDate(tomorrow) };
    case 'thisWeek':
      return { dateFrom: formatLocalDate(thisWeekStart), dateTo: formatLocalDate(thisWeekEnd) };
    default:
      return null;
  }
}

export function DeliveriesFilterBar({ filters, onFiltersChange }: DeliveriesFilterBarProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState<DeliveryStatus | 'all'>(filters.status || 'all');
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [dateFilter, setDateFilter] = useState<DeliveryDateFilterValue>({
    dateFrom: filters.dateFrom || '',
    dateTo: filters.dateTo || '',
    quickFilter: undefined,
  });

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      onFiltersChange({ ...filters, search: value || undefined, page: 1 });
    }, SEARCH_DEBOUNCE_MS);

    setSearchTimeout(timeout);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as DeliveryStatus | 'all';
    setStatus(value);
    onFiltersChange({ ...filters, status: value === 'all' ? undefined : value, page: 1 });
  };

  const handleDateFilterChange = (value: DeliveryDateFilterValue) => {
    setDateFilter(value);

    const dateRange = value.quickFilter ? quickFilterToDateRange(value.quickFilter) : undefined;

    onFiltersChange({
      ...filters,
      dateFrom: dateRange?.dateFrom || value.dateFrom || undefined,
      dateTo: dateRange?.dateTo || value.dateTo || undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('all');
    setDateFilter({ dateFrom: '', dateTo: '', quickFilter: undefined });
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }
    onFiltersChange({ page: 1, limit: filters.limit });
  };

  const hasActiveFilters =
    search ||
    status !== 'all' ||
    dateFilter.dateFrom ||
    dateFilter.dateTo ||
    dateFilter.quickFilter;

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex flex-1 gap-3'>
        <div className='w-full sm:w-64'>
          <Input
            placeholder='Buscar por código ou destinatário...'
            value={search}
            onChange={handleSearchChange}
            aria-label='Buscar entregas'
          />
        </div>
        <div className='w-full sm:w-56'>
          <Select value={status} onChange={handleStatusChange} aria-label='Status'>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div className='w-full sm:w-56'>
          <DeliveryDateFilter value={dateFilter} onChange={handleDateFilterChange} />
        </div>
      </div>
      {hasActiveFilters && (
        <Button variant='ghost' onClick={handleClearFilters}>
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
