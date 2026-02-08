import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeliveriesTable } from '@/features/deliveries/components/DeliveriesTable';
import type { DeliveryDto } from '@/features/deliveries/types';

const mockDeliveries: DeliveryDto[] = [
  {
    id: '1',
    tracking_code: 'TRK001',
    status: 'PENDING',
    priority: 'NORMAL',
    recipient: {
      name: 'John Doe',
      phone: '123456789',
      document: '12345678900',
      address: {
        street: '123 Main St',
        number: '1',
        neighborhood: 'Downtown',
        city: 'Test City',
        state: 'TS',
        zip_code: '12345',
      },
    },
    created_at: '2024-01-15T10:00:00Z',
    expected_delivery_at: '2024-01-16T10:00:00Z',
    delivery_attempts: 0,
    timeline: [],
  },
  {
    id: '2',
    tracking_code: 'TRK002',
    status: 'IN_ROUTE',
    priority: 'NORMAL',
    recipient: {
      name: 'Jane Doe',
      phone: '987654321',
      document: '98765432100',
      address: {
        street: '456 Oak Ave',
        number: '2',
        neighborhood: 'Uptown',
        city: 'Another City',
        state: 'AC',
        zip_code: '67890',
      },
    },
    created_at: '2024-01-16T11:00:00Z',
    expected_delivery_at: '2024-01-17T11:00:00Z',
    delivery_attempts: 1,
    timeline: [],
  },
  {
    id: '3',
    tracking_code: 'TRK003',
    status: 'DELIVERED',
    priority: 'NORMAL',
    recipient: {
      name: 'Bob Smith',
      phone: '555555555',
      document: '55555555500',
      address: {
        street: '789 Pine Rd',
        number: '3',
        neighborhood: 'Suburb',
        city: 'Third City',
        state: 'TC',
        zip_code: '11111',
      },
    },
    created_at: '2024-01-17T12:00:00Z',
    expected_delivery_at: '2024-01-18T12:00:00Z',
    delivery_attempts: 2,
    timeline: [],
  },
];

describe('DeliveriesTable', () => {
  const defaultProps = {
    deliveries: mockDeliveries,
    selectedIds: new Set<string>(),
    onToggleSelect: vi.fn(),
    onOpenReschedule: vi.fn(),
    onOpenAssignDriver: vi.fn(),
    onOpenPriority: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Render', () => {
    it('renders table with correct columns', () => {
      render(<DeliveriesTable {...defaultProps} />);

      expect(screen.getByText('Código')).toBeInTheDocument();
      expect(screen.getByText('Destinatário')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Previsão')).toBeInTheDocument();
    });

    it('renders all delivery rows', () => {
      render(<DeliveriesTable {...defaultProps} />);

      expect(screen.getByText('TRK001')).toBeInTheDocument();
      expect(screen.getByText('TRK002')).toBeInTheDocument();
      expect(screen.getByText('TRK003')).toBeInTheDocument();
    });

    it('renders checkbox for each row', () => {
      render(<DeliveriesTable {...defaultProps} />);

      // 3 row checkboxes (no checkbox in thead)
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
    });
  });

  describe('Row Checkbox Visual State', () => {
    it('shows unchecked checkbox when row is not selected', () => {
      render(<DeliveriesTable {...defaultProps} />);

      const checkboxes = screen.getAllByRole('checkbox');
      // All should be unchecked
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });

    it('shows checked checkbox for selected rows', () => {
      const selectedIds = new Set(['1', '3']);
      render(<DeliveriesTable {...defaultProps} selectedIds={selectedIds} />);

      const checkboxes = screen.getAllByRole('checkbox');
      // Row 1 checkbox should be checked
      expect(checkboxes[0]).toBeChecked();
      // Row 2 checkbox should be unchecked
      expect(checkboxes[1]).not.toBeChecked();
      // Row 3 checkbox should be checked
      expect(checkboxes[2]).toBeChecked();
    });
  });

  describe('Row Checkbox Interaction', () => {
    it('calls onToggleSelect when row checkbox is clicked', () => {
      const onToggleSelect = vi.fn();
      render(<DeliveriesTable {...defaultProps} onToggleSelect={onToggleSelect} />);

      const rowCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(rowCheckbox);

      expect(onToggleSelect).toHaveBeenCalledWith('1');
    });

    it('does not call onRowClick when checkbox is clicked', () => {
      const onRowClick = vi.fn();
      render(<DeliveriesTable {...defaultProps} onRowClick={onRowClick} />);

      const rowCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(rowCheckbox);

      expect(onRowClick).not.toHaveBeenCalled();
    });
  });

  describe('Empty State', () => {
    it('shows empty message when no deliveries', () => {
      render(<DeliveriesTable {...defaultProps} deliveries={[]} />);

      expect(screen.getByText('Nenhuma entrega encontrada')).toBeInTheDocument();
    });

    it('does not render table when no deliveries', () => {
      render(<DeliveriesTable {...defaultProps} deliveries={[]} />);

      expect(screen.queryByText('Código')).not.toBeInTheDocument();
    });
  });

  describe('Row Click', () => {
    it('calls onRowClick when row is clicked', () => {
      const onRowClick = vi.fn();
      render(<DeliveriesTable {...defaultProps} onRowClick={onRowClick} />);

      const row = screen.getByText('TRK001').closest('tr');
      fireEvent.click(row!);

      expect(onRowClick).toHaveBeenCalledWith(mockDeliveries[0]);
    });
  });

  describe('Status Badges', () => {
    it('renders correct badge for PENDING status', () => {
      render(<DeliveriesTable {...defaultProps} />);

      expect(screen.getByText('Pendente')).toBeInTheDocument();
    });

    it('renders correct badge for IN_ROUTE status', () => {
      render(<DeliveriesTable {...defaultProps} />);

      expect(screen.getByText('Em rota')).toBeInTheDocument();
    });

    it('renders correct badge for DELIVERED status', () => {
      render(<DeliveriesTable {...defaultProps} />);

      expect(screen.getByText('Entregue')).toBeInTheDocument();
    });
  });
});
