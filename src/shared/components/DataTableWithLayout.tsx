import { type ReactNode, type ReactElement } from 'react';
import { Card } from './Card';
import { Checkbox } from './Checkbox';
import { Badge } from './Badge';
import { TablePagination } from './TablePagination';
import { DataTable, type DataTableColumn, type DataTableActionsConfig } from './DataTable';

/**
 * Pagination metadata from API responses
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Props for the toolbar section
 */
export interface DataTableToolbarProps {
  /** Current select all checkbox state */
  selectAllState: 'none' | 'partial' | 'full';
  /** Callback when select all checkbox is toggled */
  onToggleSelectAll: () => void;
  /** Number of selected items */
  selectedCount: number;
  /** Custom render for bulk actions (right side of toolbar) */
  bulkActions?: ReactNode;
  /** Custom class name for the toolbar */
  className?: string;
}

/**
 * Props for the pagination footer
 */
export interface DataTablePaginationProps {
  /** Pagination metadata */
  pagination?: PaginationMeta;
  /** Whether the table is currently loading */
  isLoading?: boolean;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when limit changes */
  onLimitChange: (limit: number) => void;
  /** Custom class name for the footer */
  className?: string;
}

/**
 * Toolbar component with select all and bulk actions
 */
export function DataTableToolbar({
  selectAllState,
  onToggleSelectAll,
  selectedCount,
  bulkActions,
  className = '',
}: DataTableToolbarProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2 border-b border-slate-700 shrink-0 h-12 ${className}`}
    >
      <div className='flex items-center gap-3 h-6'>
        <Checkbox state={selectAllState} onChange={onToggleSelectAll} label='Selecionar tudo' />
        {selectedCount > 0 && <Badge variant='info'>{selectedCount}</Badge>}
      </div>
      {bulkActions}
    </div>
  );
}

/**
 * Pagination footer component
 */
export function DataTableFooter({
  pagination,
  isLoading = false,
  onPageChange,
  onLimitChange,
}: DataTablePaginationProps) {
  if (!pagination || pagination.total <= 0) {
    return null;
  }

  return (
    <TablePagination
      page={pagination.page}
      totalPages={pagination.totalPages}
      total={pagination.total}
      limit={pagination.limit}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      isLoading={isLoading}
    />
  );
}

/**
 * Loading state component
 */
export function DataTableLoading({ message = 'Carregando...' }: { message?: string }) {
  return (
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
        <span>{message}</span>
      </div>
    </div>
  );
}

/**
 * Error state component
 */
export function DataTableError({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <Card className='flex flex-col items-center justify-center gap-4 py-12'>
      <p className='text-rose-400'>Erro ao carregar dados</p>
      <p className='text-slate-400 text-sm'>{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className='px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors'
        >
          Tentar novamente
        </button>
      )}
    </Card>
  );
}

/**
 * Generic data table with full layout (toolbar + table + footer)
 *
 * @example
 * ```tsx
 * const columns: DataTableColumn<DeliveryDto>[] = [
 *   { key: 'tracking_code', header: 'Código', render: (row) => <span className="font-mono">{row.tracking_code}</span> },
 *   { key: 'recipient', header: 'Destinatário', render: (row) => row.recipient.name },
 *   { key: 'status', header: 'Status', render: (row) => <Badge variant={statusConfig[row.status].variant}>{statusConfig[row.status].label}</Badge> },
 *   { key: 'date', header: 'Data', render: (row) => formatIsoToLocale(row.created_at) },
 * ];
 *
 * const actions: DataTableAction<DeliveryDto>[] = [
 *   { key: 'view', variant: 'ghost', label: 'Ver', icon: <EyeIcon />, onClick: (row) => navigate(`/deliveries/${row.id}`), ariaLabel: 'Ver detalhes' },
 * ];
 *
 * <DataTableWithLayout
 *   data={data?.data || []}
 *   columns={columns}
 *   actions={{ header: 'Ações', actions }}
 *   selectedIds={selectedIds}
 *   onToggleSelect={handleToggleSelect}
 *   onRowClick={handleRowClick}
 *   selectAllState={selectAllState}
 *   onToggleSelectAll={handleToggleSelectAll}
 *   selectedCount={selectedIds.size}
 *   pagination={data?.meta}
 *   isLoading={isLoading}
 * />
 * ```
 */
export interface DataTableWithLayoutProps<T> {
  /** Array of data rows to display */
  data: T[];
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Actions column configuration (optional) */
  actions?: DataTableActionsConfig<T>;
  /** Currently selected row IDs */
  selectedIds?: Set<string>;
  /** Callback when a row is clicked */
  onRowClick?: (row: T) => void;
  /** Callback when a row's selection checkbox is toggled */
  onToggleSelect?: (id: string) => void;
  /** Unique ID field for selection tracking */
  idField?: keyof T;
  /** Message to show when data is empty */
  emptyMessage?: string;

  /** Select all checkbox state */
  selectAllState?: 'none' | 'partial' | 'full';
  /** Callback when select all checkbox is toggled */
  onToggleSelectAll?: () => void;
  /** Number of selected items */
  selectedCount?: number;
  /** Custom bulk actions to render in toolbar */
  bulkActions?: ReactNode;

  /** Pagination metadata */
  pagination?: PaginationMeta;
  /** Whether the table is currently loading */
  isLoading?: boolean;
  /** Error message (if any) */
  error?: string | null;
  /** Callback when retry is clicked */
  onRetry?: () => void;

  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback when limit changes */
  onLimitChange?: (limit: number) => void;

  /** Custom loading message */
  loadingMessage?: string;
  /** Custom class name for the container */
  containerClassName?: string;
  /** Custom table content (overrides default table rendering) */
  children?: ReactElement;
}

export function DataTableWithLayout<T>({
  data,
  columns,
  actions,
  selectedIds = new Set(),
  onRowClick,
  onToggleSelect,
  idField = 'id' as keyof T,
  emptyMessage = 'Nenhum registro encontrado',

  selectAllState = 'none',
  onToggleSelectAll,
  selectedCount = 0,
  bulkActions,

  pagination,
  isLoading = false,
  error = null,
  onRetry,

  onPageChange,
  onLimitChange,

  loadingMessage = 'Carregando...',
  containerClassName = '',
  children,
}: DataTableWithLayoutProps<T>) {
  const hasSelection = onToggleSelect !== undefined;

  if (error) {
    return (
      <Card className={`flex flex-col min-h-0 overflow-hidden ${containerClassName}`}>
        <DataTableError error={error} onRetry={onRetry} />
      </Card>
    );
  }

  return (
    <Card className={`flex flex-col min-h-0 overflow-hidden ${containerClassName}`}>
      {isLoading ? (
        <DataTableLoading message={loadingMessage} />
      ) : (
        <div className='flex flex-col flex-1 min-h-0'>
          {/* Toolbar with Select All and bulk actions */}
          {hasSelection && (
            <DataTableToolbar
              selectAllState={selectAllState}
              onToggleSelectAll={onToggleSelectAll ?? (() => {})}
              selectedCount={selectedCount}
              bulkActions={bulkActions}
            />
          )}

          {/* Table with internal scroll */}
          <div className='overflow-auto min-h-0 flex-1'>
            {children ? (
              children
            ) : (
              <DataTable
                data={data}
                columns={columns}
                actions={actions}
                selectedIds={selectedIds}
                onRowClick={onRowClick}
                onToggleSelect={onToggleSelect}
                idField={idField}
                emptyMessage={emptyMessage}
              />
            )}
          </div>

          {/* Pagination Footer */}
          {pagination && (onPageChange || onLimitChange) && (
            <DataTableFooter
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={onPageChange ?? (() => {})}
              onLimitChange={onLimitChange ?? (() => {})}
            />
          )}
        </div>
      )}
    </Card>
  );
}
