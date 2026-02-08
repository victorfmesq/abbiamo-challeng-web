import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '@/shared/components/DataTable';
import type {
  DataTableColumn,
  DataTableAction,
  DataTableActionsConfig,
} from '@/shared/components/DataTable';

interface TestRow {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  amount: number;
}

describe('DataTable', () => {
  const mockData: TestRow[] = [
    { id: '1', name: 'John Doe', status: 'active', amount: 100 },
    { id: '2', name: 'Jane Smith', status: 'inactive', amount: 200 },
    { id: '3', name: 'Bob Wilson', status: 'active', amount: 300 },
  ];

  const columns: DataTableColumn<TestRow>[] = [
    { key: 'name', header: 'Name', render: (row) => <span data-testid='name'>{row.name}</span> },
    { key: 'status', header: 'Status', render: (row) => row.status },
    { key: 'amount', header: 'Amount', render: (row) => `$${row.amount}` },
  ];

  describe('Rendering', () => {
    it('renders table with correct structure', () => {
      render(<DataTable data={mockData} columns={columns} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
    });

    it('renders all data rows', () => {
      render(<DataTable data={mockData} columns={columns} />);

      expect(screen.getAllByText('John Doe')).toHaveLength(1);
      expect(screen.getAllByText('Jane Smith')).toHaveLength(1);
      expect(screen.getAllByText('Bob Wilson')).toHaveLength(1);
    });

    it('renders empty message when no data', () => {
      render(<DataTable data={[]} columns={columns} emptyMessage='No records' />);

      expect(screen.getByText('No records')).toBeInTheDocument();
    });

    it('uses default empty message when not provided', () => {
      render(<DataTable data={[]} columns={columns} />);

      expect(screen.getByText('Nenhum registro encontrado')).toBeInTheDocument();
    });
  });

  describe('Custom columns', () => {
    it('applies custom cell class names', () => {
      const columnsWithClasses: DataTableColumn<TestRow>[] = [
        { key: 'name', header: 'Name', cellClassName: 'custom-cell' },
        { key: 'status', header: 'Status' },
      ];

      render(<DataTable data={[mockData[0]]} columns={columnsWithClasses} />);

      const cell = screen.getByText('John Doe').closest('td');
      expect(cell).toHaveClass('custom-cell');
    });

    it('applies custom header class names', () => {
      const columnsWithHeaderClasses: DataTableColumn<TestRow>[] = [
        { key: 'name', header: 'Name', headerClassName: 'custom-header' },
        { key: 'status', header: 'Status' },
      ];

      render(<DataTable data={mockData} columns={columnsWithHeaderClasses} />);

      expect(screen.getByText('Name')).toHaveClass('custom-header');
    });

    it('applies custom column widths', () => {
      const columnsWithWidth: DataTableColumn<TestRow>[] = [
        { key: 'name', header: 'Name', width: '200px' },
        { key: 'status', header: 'Status', width: '100px' },
      ];

      render(<DataTable data={mockData} columns={columnsWithWidth} />);

      const headers = screen.getAllByRole('columnheader');
      expect(headers[0]).toHaveStyle({ width: '200px' });
      expect(headers[1]).toHaveStyle({ width: '100px' });
    });
  });

  describe('Row click', () => {
    it('calls onRowClick when row is clicked', () => {
      const onRowClick = vi.fn();
      render(<DataTable data={mockData} columns={columns} onRowClick={onRowClick} />);

      const row = screen.getByText('John Doe').closest('tr');
      fireEvent.click(row!);

      expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
    });

    it('does not call onRowClick when row is clicked if not provided', () => {
      const onRowClick = vi.fn();
      render(<DataTable data={mockData} columns={columns} />);

      const row = screen.getByText('John Doe').closest('tr');
      fireEvent.click(row!);

      expect(onRowClick).not.toHaveBeenCalled();
    });
  });

  describe('Selection', () => {
    it('renders checkboxes when onToggleSelect is provided', () => {
      render(<DataTable data={mockData} columns={columns} onToggleSelect={vi.fn()} />);

      expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    });

    it('does not render checkboxes when onToggleSelect is not provided', () => {
      render(<DataTable data={mockData} columns={columns} />);

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('calls onToggleSelect when checkbox is clicked', () => {
      const onToggleSelect = vi.fn();
      render(
        <DataTable
          data={mockData}
          columns={columns}
          onToggleSelect={onToggleSelect}
          selectedIds={new Set(['1'])}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);

      expect(onToggleSelect).toHaveBeenCalledWith('2');
    });

    it('checks selected rows based on selectedIds', () => {
      render(
        <DataTable
          data={mockData}
          columns={columns}
          onToggleSelect={vi.fn()}
          selectedIds={new Set(['1', '3'])}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).toBeChecked();
    });
  });

  describe('Actions column', () => {
    const actions: DataTableAction<TestRow>[] = [
      {
        key: 'edit',
        variant: 'ghost',
        label: 'Edit',
        onClick: vi.fn(),
        ariaLabel: 'Edit row',
      },
      {
        key: 'delete',
        variant: 'destructive',
        label: 'Delete',
        onClick: vi.fn(),
        ariaLabel: 'Delete row',
      },
    ];

    const actionsConfig: DataTableActionsConfig<TestRow> = {
      header: 'Actions',
      actions,
    };

    it('renders actions column when configured', () => {
      render(<DataTable data={mockData} columns={columns} actions={actionsConfig} />);

      expect(screen.getByText('Actions')).toBeInTheDocument();
      expect(screen.getAllByText('Edit')).toHaveLength(3);
      expect(screen.getAllByText('Delete')).toHaveLength(3);
    });

    it('calls action onClick when button is clicked', () => {
      render(<DataTable data={mockData} columns={columns} actions={actionsConfig} />);

      const editButtons = screen.getAllByLabelText('Edit row');
      fireEvent.click(editButtons[0]);

      expect(actions[0].onClick).toHaveBeenCalledWith(mockData[0]);
    });

    it('applies custom action button variant', () => {
      render(<DataTable data={mockData} columns={columns} actions={actionsConfig} />);

      const editButton = screen.getAllByText('Edit')[0].closest('button');
      const deleteButton = screen.getAllByText('Delete')[0].closest('button');

      expect(editButton).toHaveClass('bg-transparent');
      expect(deleteButton).toHaveClass('bg-rose-500');
    });

    it('applies custom action size', () => {
      const actionsWithSize: DataTableAction<TestRow>[] = [
        {
          key: 'view',
          variant: 'primary',
          size: 'lg',
          label: 'View',
          onClick: vi.fn(),
          ariaLabel: 'View row',
        },
      ];

      render(
        <DataTable data={mockData} columns={columns} actions={{ actions: actionsWithSize }} />
      );

      const viewButton = screen.getAllByText('View')[0].closest('button');
      expect(viewButton).toHaveClass('px-6');
      expect(viewButton).toHaveClass('py-3');
    });

    it('applies disabled state based on isDisabled', () => {
      const actionsWithDisabled: DataTableAction<TestRow>[] = [
        {
          key: 'edit',
          variant: 'ghost',
          label: 'Edit',
          isDisabled: (row) => row.status === 'inactive',
          onClick: vi.fn(),
          ariaLabel: 'Edit row',
        },
      ];

      render(
        <DataTable data={mockData} columns={columns} actions={{ actions: actionsWithDisabled }} />
      );

      const editButtons = screen.getAllByLabelText('Edit row');
      expect(editButtons[0]).not.toBeDisabled();
      expect(editButtons[1]).toBeDisabled();
    });

    it('stops propagation when action button is clicked', () => {
      const onRowClick = vi.fn();
      render(
        <DataTable
          data={mockData}
          columns={columns}
          actions={actionsConfig}
          onRowClick={onRowClick}
        />
      );

      const editButton = screen.getAllByLabelText('Edit row')[0];
      fireEvent.click(editButton);

      expect(onRowClick).not.toHaveBeenCalled();
    });

    it('applies custom actions cell class name', () => {
      render(
        <DataTable
          data={mockData}
          columns={columns}
          actions={{ actions, cellClassName: 'actions-cell' }}
        />
      );

      const actionCell = screen.getAllByRole('button', { name: 'Edit row' })[0].closest('td');
      expect(actionCell).toHaveClass('actions-cell');
    });

    it('applies custom actions header class name', () => {
      render(
        <DataTable
          data={mockData}
          columns={columns}
          actions={{ actions, header: 'Custom Header', headerClassName: 'actions-header' }}
        />
      );

      expect(screen.getByText('Custom Header')).toHaveClass('actions-header');
    });
  });
});
