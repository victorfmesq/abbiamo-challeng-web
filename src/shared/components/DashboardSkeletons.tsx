import type { ReactNode } from 'react';

import { Tr, Td } from '@/shared/components/Table';

interface DashboardKpisSkeletonProps {
  count?: number;
}

export function DashboardKpisSkeleton({ count = 4 }: DashboardKpisSkeletonProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className='animate-pulse bg-slate-800 h-28 rounded-lg' />
      ))}
    </div>
  );
}

export function DashboardTrendsSkeleton() {
  return (
    <div className='space-y-6 animate-pulse'>
      <div className='h-[300px] bg-slate-800 rounded-xl' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='h-[250px] bg-slate-800 rounded-xl' />
        <div className='h-[250px] bg-slate-800 rounded-xl' />
      </div>
    </div>
  );
}

export function DashboardRiskCardsSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className='animate-pulse bg-slate-900 border border-slate-700 rounded-lg p-5'
        >
          <div className='flex flex-col gap-3'>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex min-w-0 flex-col gap-1'>
                <div className='h-4 w-24 rounded bg-slate-700' />
                <div className='h-8 w-16 rounded bg-slate-700' />
              </div>
              <div className='h-8 w-8 rounded bg-slate-700' />
            </div>
            <div className='h-3 w-32 rounded bg-slate-700' />
          </div>
        </div>
      ))}
    </div>
  );
}

export interface DashboardTableSkeletonColumn {
  widthClassName: string;
}

export interface DashboardActionTableSkeletonRowsProps {
  rows?: number;
  columns: DashboardTableSkeletonColumn[];
  actionColumnClassName?: string;
  cellClassName?: string;
  containerClassName?: string;
  rowWrapper?: (row: ReactNode, index: number) => ReactNode;
}

export function DashboardActionTableSkeletonRows({
  rows = 4,
  columns,
  actionColumnClassName,
  cellClassName = 'h-4 animate-pulse rounded bg-slate-700',
  containerClassName,
  rowWrapper,
}: DashboardActionTableSkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => {
        const row = (
          <Tr key={rowIndex} className={containerClassName}>
            {columns.map((column, columnIndex) => (
              <Td key={`${rowIndex}-${columnIndex}`}>
                <div className={`${cellClassName} ${column.widthClassName}`} />
              </Td>
            ))}
            {actionColumnClassName && (
              <Td className={actionColumnClassName}>
                <div className='h-8 w-20 animate-pulse rounded bg-slate-700' />
              </Td>
            )}
          </Tr>
        );

        return rowWrapper ? rowWrapper(row, rowIndex) : row;
      })}
    </>
  );
}
