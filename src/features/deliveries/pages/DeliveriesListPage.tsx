import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, TablePagination } from '@/shared/components';
import { DeliveriesFilterBar } from '../components/DeliveriesFilterBar';
import { DeliveriesTable } from '../components/DeliveriesTable';
import { useDeliveries } from '../hooks/useDeliveries';
import type { DeliveriesFilters } from '../domain/deliveriesFilters';
import type { DeliveryDto } from '../types';

const defaultFilters: DeliveriesFilters = {
  page: 1,
  limit: 10,
};

export function DeliveriesListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DeliveriesFilters>(defaultFilters);
  const { data, isLoading, isError, error, refetch } = useDeliveries(filters);

  const handleFiltersChange = (newFilters: DeliveriesFilters) => {
    setFilters(newFilters);
  };

  const handleRowClick = (delivery: DeliveryDto) => {
    navigate(`/deliveries/${delivery.id}`);
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    // Reset to first page when limit changes
    setFilters({ ...filters, limit: newLimit, page: 1 });
  };

  if (isError) {
    return (
      <Card className='flex flex-col items-center justify-center gap-4 py-12'>
        <p className='text-rose-400'>Erro ao carregar entregas</p>
        <p className='text-slate-400 text-sm'>
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </p>
        <Button onClick={() => refetch()}>Tentar novamente</Button>
      </Card>
    );
  }

  return (
    <div className='flex flex-col flex-1 min-h-0 gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold text-slate-100'>Entregas</h1>
        <Button onClick={() => refetch()}>Atualizar</Button>
      </div>

      {/* Filters - Stack on mobile, inline on desktop */}
      <Card className='p-4 shrink-0'>
        <DeliveriesFilterBar filters={filters} onFiltersChange={handleFiltersChange} />
      </Card>

      {/* Table Container - Controlled height with flex layout */}
      <div className='flex flex-col flex-1 min-h-0'>
        <Card className='flex flex-col min-h-0 overflow-hidden'>
          {isLoading ? (
            <div className='flex flex-1 items-center justify-center py-12'>
              <div className='flex items-center gap-2 text-slate-400'>
                <svg
                  className='h-5 w-5 animate-spin'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
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
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                <span>Carregando...</span>
              </div>
            </div>
          ) : (
            <div className='flex flex-col flex-1 min-h-0'>
              {/* Table with internal scroll */}
              <div className='overflow-auto min-h-0 flex-1'>
                <DeliveriesTable deliveries={data?.data || []} onRowClick={handleRowClick} />
              </div>

              {/* Pagination Footer */}
              {data && data.meta.total > 0 && (
                <TablePagination
                  page={data.meta.page}
                  totalPages={data.meta.totalPages}
                  total={data.meta.total}
                  limit={data.meta.limit}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                  isLoading={isLoading}
                />
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
