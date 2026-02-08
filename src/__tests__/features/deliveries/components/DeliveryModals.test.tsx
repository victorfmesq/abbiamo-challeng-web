import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RescheduleDeliveriesModal } from '@/features/deliveries/components/RescheduleDeliveriesModal';
import { AssignDriverModal } from '@/features/deliveries/components/AssignDriverModal';
import { UpdatePriorityModal } from '@/features/deliveries/components/UpdatePriorityModal';
import type { DeliveryDto } from '@/features/deliveries/types';

// Mock the mutations
vi.mock('@/features/deliveries/hooks/useBulkReschedule', () => ({
  useBulkReschedule: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
  }),
}));

vi.mock('@/features/deliveries/hooks/useBulkAssignDriver', () => ({
  useBulkAssignDriver: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
  }),
}));

vi.mock('@/features/deliveries/hooks/useBulkUpdatePriority', () => ({
  useBulkUpdatePriority: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
  }),
}));

vi.mock('@/features/drivers/hooks/useDrivers', () => ({
  useDrivers: () => ({
    data: { data: [] },
    isLoading: false,
  }),
}));

const mockDeliveries: DeliveryDto[] = [
  {
    id: '1',
    tracking_code: 'TRK001',
    status: 'PENDING',
    priority: 'NORMAL',
    recipient: {
      name: 'John Doe',
      phone: '123',
      document: '123',
      address: {
        street: 'St',
        number: '1',
        neighborhood: 'N',
        city: 'C',
        state: 'S',
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
    priority: 'HIGH',
    recipient: {
      name: 'Jane Doe',
      phone: '456',
      document: '456',
      address: {
        street: 'Av',
        number: '2',
        neighborhood: 'N2',
        city: 'C2',
        state: 'S2',
        zip_code: '67890',
      },
    },
    created_at: '2024-01-16T11:00:00Z',
    expected_delivery_at: '2024-01-17T11:00:00Z',
    delivery_attempts: 1,
    timeline: [],
  },
];

describe('RescheduleDeliveriesModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    deliveryIds: ['1', '2'],
    deliveries: mockDeliveries,
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with correct title', () => {
    render(<RescheduleDeliveriesModal {...defaultProps} />);
    expect(screen.getByText('Reagendar entregas')).toBeInTheDocument();
  });

  it('shows delivery preview', () => {
    render(<RescheduleDeliveriesModal {...defaultProps} />);
    expect(screen.getByText('TRK001')).toBeInTheDocument();
    expect(screen.getByText('TRK002')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<RescheduleDeliveriesModal {...defaultProps} />);
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});

describe('AssignDriverModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    deliveryIds: ['1', '2'],
    deliveries: mockDeliveries,
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with correct title', () => {
    render(<AssignDriverModal {...defaultProps} />);
    expect(screen.getByText('Atribuir motorista')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<AssignDriverModal {...defaultProps} />);
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});

describe('UpdatePriorityModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    deliveryIds: ['1', '2'],
    deliveries: mockDeliveries,
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with correct title', () => {
    render(<UpdatePriorityModal {...defaultProps} />);
    expect(screen.getByText('Atualizar prioridade')).toBeInTheDocument();
  });

  it('renders priority modal content', () => {
    render(<UpdatePriorityModal {...defaultProps} />);
    expect(screen.getByText('Atualizar prioridade')).toBeInTheDocument();
    // Modal renders the modal structure
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<UpdatePriorityModal {...defaultProps} />);
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
