import type { ChangeEvent } from 'react';
import type { ReactNode } from 'react';
import { Button } from './Button';
import { Select } from './Select';
import { Card } from './Card';
import { formatPaginationRange } from '@/shared/utils/pagination';

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  isLoading?: boolean;
  className?: string;
}

const PAGE_LIMITS = [10, 20, 50] as const;

export function TablePagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  isLoading = false,
  className = '',
}: TablePaginationProps) {
  if (total === 0) {
    return null;
  }

  const rangeText = formatPaginationRange(page, limit, total);

  const handleLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    onLimitChange(newLimit);
  };

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <div
      className={`flex flex-col gap-4  border-slate-700 bg-slate-900/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      {/* Mobile: Stacked layout, Desktop: Inline layout */}
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
        <span className='text-sm text-slate-400'>
          Página <span className='text-slate-100'>{page}</span> de{' '}
          <span className='text-slate-100'>{totalPages}</span>
        </span>
        <span className='text-sm text-slate-400'>({rangeText})</span>
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        {/* Limit Selector */}
        <div className='flex items-center gap-2'>
          <label htmlFor='pagination-limit' className='text-sm text-slate-400'>
            Por página:
          </label>
          <Select
            id='pagination-limit'
            value={limit}
            onChange={handleLimitChange}
            disabled={isLoading}
            className='w-20'
          >
            {PAGE_LIMITS.map((pageLimit) => (
              <option key={pageLimit} value={pageLimit}>
                {pageLimit}
              </option>
            ))}
          </Select>
        </div>

        {/* Navigation Buttons */}
        <div className='flex gap-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handlePrevious}
            disabled={page === 1 || isLoading}
            aria-label='Página anterior'
          >
            Anterior
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleNext}
            disabled={page === totalPages || isLoading}
            aria-label='Próxima página'
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}

export interface TableWithPaginationProps {
  children: ReactNode;
  pagination: Omit<TablePaginationProps, 'className'>;
  className?: string;
}

export function TableWithPagination({
  children,
  pagination,
  className = '',
}: TableWithPaginationProps) {
  return (
    <Card className={`flex flex-col overflow-hidden ${className}`}>
      <div className='flex-1 overflow-auto'>{children}</div>
      <TablePagination {...pagination} />
    </Card>
  );
}
