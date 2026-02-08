import type { ReactNode } from 'react';
import type { BadgeVariant } from './Badge';
import { Badge } from './Badge';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { Table, Thead, Tbody, Tr, Th, Td } from './Table';

/**
 * Configuration for a single column in the DataTable
 */
export interface DataTableColumn<T> {
  /** Unique identifier for the column */
  key: string;
  /** Header label for the column */
  header: string;
  /** CSS class for the column cell */
  cellClassName?: string;
  /** CSS class for the header */
  headerClassName?: string;
  /** Render function for cell content */
  render?: (row: T, index: number) => ReactNode;
  /** Custom width for the column */
  width?: string;
}

/**
 * Configuration for an action button in the actions column
 */
export interface DataTableAction<T> {
  /** Unique identifier for the action */
  key: string;
  /** Button variant */
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Button label (visible text) */
  label: string;
  /** Icon component to display */
  icon?: ReactNode;
  /** Whether the action is disabled for this row */
  isDisabled?: (row: T) => boolean;
  /** Callback when the action is clicked */
  onClick: (row: T) => void;
  /** Accessibility label */
  ariaLabel: string;
}

/**
 * Configuration for the actions column
 */
export interface DataTableActionsConfig<T> {
  /** Header label for the actions column */
  header?: string;
  /** List of actions to render */
  actions: DataTableAction<T>[];
  /** CSS class for the actions cell */
  cellClassName?: string;
  /** CSS class for the actions header */
  headerClassName?: string;
  /** Width of the actions column */
  width?: string;
}

/**
 * Generic data table component
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
 *   { key: 'edit', variant: 'ghost', label: 'Editar', icon: <PencilIcon />, onClick: (row) => openEditModal(row), ariaLabel: 'Editar entrega' },
 * ];
 *
 * <DataTable columns={columns} data={deliveries} actions={actions} />
 * ```
 */
export interface DataTableProps<T> {
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
  /** Additional CSS class for the table */
  className?: string;
}

/**
 * Helper function to get the ID from a row object
 */
function getRowId<T>(row: T, idField: keyof T): string {
  const id = row[idField];
  return typeof id === 'string' || typeof id === 'number' ? String(id) : '';
}

/**
 * Helper function to render a cell value
 */
function renderCell<T>(row: T, column: DataTableColumn<T>): ReactNode {
  if (column.render) {
    return column.render(row, 0);
  }
  const value = row[column.key as keyof T];
  return value as ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  actions,
  selectedIds = new Set(),
  onRowClick,
  onToggleSelect,
  idField = 'id' as keyof T,
  emptyMessage = 'Nenhum registro encontrado',
  className = '',
}: DataTableProps<T>) {
  const hasSelection = onToggleSelect !== undefined;
  const hasActions = actions !== undefined && actions.actions.length > 0;

  if (data.length === 0) {
    return (
      <div className='flex items-center justify-center py-12'>
        <p className='text-slate-400'>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <Table className={className}>
      <Thead>
        <Tr>
          {hasSelection && <Th className='w-12' />}
          {columns.map((column) => (
            <Th
              key={column.key}
              className={column.headerClassName}
              style={column.width ? { width: column.width } : undefined}
            >
              {column.header}
            </Th>
          ))}
          {hasActions && (
            <Th
              className={actions.headerClassName}
              style={actions.width ? { width: actions.width } : undefined}
            >
              {actions.header || 'Ações'}
            </Th>
          )}
        </Tr>
      </Thead>
      <Tbody>
        {data.map((row, index) => {
          const rowId = getRowId(row, idField);
          const isSelected = selectedIds.has(rowId);

          return (
            <Tr
              key={rowId || index}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer' : ''}
            >
              {hasSelection && (
                <Td onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    state={isSelected ? 'full' : 'none'}
                    onChange={() => onToggleSelect!(rowId)}
                    aria-label={`Selecionar registro ${rowId}`}
                  />
                </Td>
              )}
              {columns.map((column) => (
                <Td
                  key={column.key}
                  className={column.cellClassName}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {renderCell(row, column)}
                </Td>
              ))}
              {hasActions && (
                <Td
                  className={actions.cellClassName}
                  style={actions.width ? { width: actions.width } : undefined}
                >
                  <div className='flex items-center gap-1'>
                    {actions.actions.map((action) => {
                      const isDisabled = action.isDisabled?.(row) ?? false;
                      return (
                        <Button
                          key={action.key}
                          variant={action.variant}
                          size={action.size ?? 'sm'}
                          disabled={isDisabled}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                          aria-label={action.ariaLabel}
                        >
                          {action.icon}
                          {action.label}
                        </Button>
                      );
                    })}
                  </div>
                </Td>
              )}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

/**
 * Status badge configuration helper
 */
export interface StatusBadgeConfig {
  variant: BadgeVariant;
  label: string;
}

/**
 * Helper function to create status badge configurations
 */
export function createStatusBadgeConfig<T extends string>(
  config: Record<T, { variant: BadgeVariant; label: string }>
): Record<T, StatusBadgeConfig> {
  return config as Record<T, StatusBadgeConfig>;
}

/**
 * Helper function to render a status badge
 */
export function renderStatusBadge<T extends string>(
  status: T,
  config: Record<T, { variant: BadgeVariant; label: string }>
): ReactNode {
  const statusConfig = config[status];
  if (!statusConfig) {
    return null;
  }
  return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
}
