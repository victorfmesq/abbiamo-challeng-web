import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/shared/components';
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
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-slate-100'>Entregas</h1>
        <Button onClick={() => refetch()}>Atualizar</Button>
      </div>

      <Card className='p-4'>
        <DeliveriesFilterBar filters={filters} onFiltersChange={handleFiltersChange} />
      </Card>

      {isLoading ? (
        <Card className='flex items-center justify-center py-12'>
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
        </Card>
      ) : (
        <DeliveriesTable deliveries={data?.data || []} onRowClick={handleRowClick} />
      )}

      {data && data.total > 0 && (
        <div className='flex items-center justify-between text-sm text-slate-400'>
          <span>
            Mostrando {data.data.length} de {data.total} entregas
          </span>
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              disabled={filters.page === 1}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
            >
              Anterior
            </Button>
            <Button
              variant='ghost'
              disabled={filters.page === data.totalPages}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
            >
              Proximo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
