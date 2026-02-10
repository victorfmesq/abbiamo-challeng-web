import type { ReactNode } from 'react';
import type { BadgeVariant } from './Badge';
import { Badge } from './Badge';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { Table, Thead, Tbody, Tr, Th, Td } from './Table';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cellClassName?: string;
  headerClassName?: string;
  render?: (row: T, index: number) => ReactNode;
  width?: string;
}

export interface DataTableAction<T> {
  key: string;
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  label: string;
  icon?: ReactNode;
  isDisabled?: (row: T) => boolean;
  onClick: (row: T) => void;
  ariaLabel: string;
}

export interface DataTableActionsConfig<T> {
  header?: string;
  actions: DataTableAction<T>[];
  cellClassName?: string;
  headerClassName?: string;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableActionsConfig<T>;
  selectedIds?: Set<string>;
  onRowClick?: (row: T) => void;
  onToggleSelect?: (id: string) => void;
  idField?: keyof T;
  emptyMessage?: string;
  className?: string;
}

function getRowId<T>(row: T, idField: keyof T): string {
  const id = row[idField];
  return typeof id === 'string' || typeof id === 'number' ? String(id) : '';
}

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
              className={onRowClick ? 'cursor-pointer group' : 'group'}
            >
              {hasSelection && (
                <Td onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    state={isSelected ? 'full' : 'none'}
                    onChange={() => onToggleSelect!(rowId)}
                    aria-label={`Selecionar registro ${rowId}`}
                    dataTestId={`row-select-${rowId}`}
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

export interface StatusBadgeConfig {
  variant: BadgeVariant;
  label: string;
}

export function createStatusBadgeConfig<T extends string>(
  config: Record<T, { variant: BadgeVariant; label: string }>
): Record<T, StatusBadgeConfig> {
  return config as Record<T, StatusBadgeConfig>;
}

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
