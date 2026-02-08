import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RescheduleDeliveriesModal } from '@/features/deliveries/components/RescheduleDeliveriesModal';
import { AssignDriverModal } from '@/features/deliveries/components/AssignDriverModal';
import { UpdatePriorityModal } from '@/features/deliveries/components/UpdatePriorityModal';
import { DeliveryDetailsModal } from '@/features/deliveries/components/DeliveryDetailsModal';
import type { DeliveryDto, DeliveryEventDto } from '@/features/deliveries/types';
import { useDelivery } from '@/features/deliveries/hooks/useDelivery';

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

vi.mock('@/features/deliveries/hooks/useDelivery', () => ({
  useDelivery: vi.fn(),
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

// Complete delivery data with timeline for DeliveryDetailsModal tests
const mockCompleteDelivery: DeliveryDto = {
  id: '1',
  tracking_code: 'TRK001',
  status: 'IN_ROUTE',
  priority: 'HIGH',
  assigned_driver: 'João Silva',
  recipient: {
    name: 'Maria Souza',
    phone: '(11) 98765-4321',
    document: '123.456.789-00',
    address: {
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Apartamento 50',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zip_code: '01310-100',
    },
  },
  created_at: '2024-01-15T10:00:00Z',
  expected_delivery_at: '2024-01-16T18:00:00Z',
  delivery_attempts: 2,
  timeline: [
    {
      id: 't1',
      status: 'PENDING',
      timestamp: '2024-01-15T10:00:00Z',
      actor: 'Sistema',
      notes: 'Pedido criado',
    },
    {
      id: 't2',
      status: 'DISPATCHED',
      timestamp: '2024-01-15T14:00:00Z',
      actor: 'João Silva',
      notes: 'Pedido despachado para entrega',
    },
    {
      id: 't3',
      status: 'IN_ROUTE',
      timestamp: '2024-01-16T08:00:00Z',
      actor: 'Maria Souza',
      notes: 'Saiu para entrega',
    },
  ] as DeliveryEventDto[],
};

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

describe('DeliveryDetailsModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    deliveryId: '1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Opening and Closing', () => {
    it('renders modal with correct title when open', () => {
      vi.mocked(useDelivery).mockReturnValue({
        data: mockCompleteDelivery,
        isLoading: false,
        isError: false,
        error: null,
      } as any);

      render(<DeliveryDetailsModal {...defaultProps} />);
      expect(screen.getByText('Detalhes da Entrega')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      vi.mocked(useDelivery).mockReturnValue({
        data: mockCompleteDelivery,
        isLoading: false,
        isError: false,
        error: null,
      } as any);

      render(<DeliveryDetailsModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Detalhes da Entrega')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      vi.mocked(useDelivery).mockReturnValue({
        data: mockCompleteDelivery,
        isLoading: false,
        isError: false,
        error: null,
      } as any);

      render(<DeliveryDetailsModal {...defaultProps} />);
      // Use aria-label to target the header close button
      const closeButton = screen.getByRole('button', { name: /fechar modal/i });
      fireEvent.click(closeButton);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onClose when footer button is clicked', () => {
      vi.mocked(useDelivery).mockReturnValue({
        data: mockCompleteDelivery,
        isLoading: false,
        isError: false,
        error: null,
      } as any);

      render(<DeliveryDetailsModal {...defaultProps} />);
      // Footer button contains only "Fechar" text
      const footerButton = screen.getByRole('button', { name: 'Fechar' });
      fireEvent.click(footerButton);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('shows loading state when isLoading is true', () => {
      vi.mocked(useDelivery).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      } as any);

      render(<DeliveryDetailsModal {...defaultProps} />);
      expect(screen.getByText('Carregando detalhes...')).toBeInTheDocument();
    });

    it('does not show delivery content while loading', () => {
      vi.mocked(useDelivery).mockReturnValue({
        data: mockCompleteDelivery,
        isLoading: true,
        isError: false,
        error: null,
      } as any);

      render(<DeliveryDetailsModal {...defaultProps} />);
      expect(screen.getByText('Carregando detalhes...')).toBeInTheDocument();
      expect(screen.queryByText('TRK001')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('shows error state when isError is true', () => {
      vi.mocked(useDelivery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Erro ao carregar'),
      } as any);

      render(<DeliveryDetailsModal {...defaultProps} />);
      // Error state displays the error message
      expect(screen.getByText('Erro ao carregar')).toBeInTheDocument();
    });

    it('displays custom error message', () => {
      vi.mocked(useDelivery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Custom error message'),
      } as any);

      render(<DeliveryDetailsModal {...defaultProps} />);
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });
  });

  describe('Render with Data', () => {
    beforeEach(() => {
      vi.mocked(useDelivery).mockReturnValue({
        data: mockCompleteDelivery,
        isLoading: false,
        isError: false,
        error: null,
      } as any);
    });

    it('displays tracking code', () => {
      render(<DeliveryDetailsModal {...defaultProps} />);
      expect(screen.getByText('TRK001')).toBeInTheDocument();
    });

    it('displays status badge', () => {
      render(<DeliveryDetailsModal {...defaultProps} />);
      // Check status badge specifically - appears in the header section
      const badges = screen.getAllByText('Em rota');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('displays priority badge', () => {
      render(<DeliveryDetailsModal {...defaultProps} />);
      expect(screen.getByText('Alta')).toBeInTheDocument();
    });

    it('displays assigned driver when present', () => {
      render(<DeliveryDetailsModal {...defaultProps} />);
      // Use exact text match with selector to differentiate from timeline actor
      const driverSection = screen.getByText(/Motorista:/);
      expect(driverSection).toBeInTheDocument();
      expect(driverSection.parentElement?.textContent).toContain('João Silva');
    });

    it('displays recipient name', () => {
      render(<DeliveryDetailsModal {...defaultProps} />);
      // Recipient name is in the Destinatário section with a specific class
      const recipientSection = screen.getByText('Destinatário').parentElement?.parentElement;
      expect(recipientSection?.textContent).toContain('Maria Souza');
    });

    it('displays recipient phone', () => {
      render(<DeliveryDetailsModal {...defaultProps} />);
      expect(screen.getByText('(11) 98765-4321')).toBeInTheDocument();
    });

    it('displays recipient document', () => {
      render(<DeliveryDetailsModal {...defaultProps} />);
      expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
    });

    it('displays recipient address', () => {
      render(<DeliveryDetailsModal {...defaultProps} />);
      expect(screen.getByText('Avenida Paulista, 1000')).toBeInTheDocument();
      expect(screen.getByText('Apartamento 50')).toBeInTheDocument();
      expect(screen.getByText('Bela Vista, São Paulo - SP')).toBeInTheDocument();
      expect(screen.getByText('01310-100')).toBeInTheDocument();
    });

    it('displays delivery attempts', () => {
      render(<DeliveryDetailsModal {...defaultProps} />);
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('displays expected delivery date', () => {
      render(<DeliveryDetailsModal {...defaultProps} />);
      // Use exact match for the first occurrence (Info section)
      const dateElement = screen.getByText(
        (content) => content.includes('16/01/2024') && content.includes('15:00:00')
      );
      expect(dateElement).toBeInTheDocument();
    });

    it('displays timeline section', () => {
      render(<DeliveryDetailsModal {...defaultProps} />);
      expect(screen.getByText('Histórico')).toBeInTheDocument();
    });

    it('displays all timeline events', () => {
      render(<DeliveryDetailsModal {...defaultProps} />);
      // Timeline events have their own status badges
      // Use more specific selectors for timeline section
      const timelineSection = screen.getByText('Histórico').parentElement;
      expect(timelineSection?.textContent).toContain('Pendente');
      expect(timelineSection?.textContent).toContain('Despachada');
      expect(timelineSection?.textContent).toContain('Em rota');
    });

    it('displays timeline event actors', () => {
      render(<DeliveryDetailsModal {...defaultProps} />);
      // Each timeline event has the actor name
      const actors = screen.getAllByText((content) => {
        return (
          content.includes('Sistema') ||
          content.includes('João Silva') ||
          content.includes('Maria Souza')
        );
      });
      expect(actors.length).toBeGreaterThanOrEqual(3);
    });

    it('displays timeline event notes', () => {
      render(<DeliveryDetailsModal {...defaultProps} />);
      expect(screen.getByText('Pedido criado')).toBeInTheDocument();
    });
  });

  describe('useDelivery Hook Integration', () => {
    it('calls useDelivery with correct deliveryId', () => {
      vi.mocked(useDelivery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      } as any);

      render(<DeliveryDetailsModal {...defaultProps} deliveryId='test-id-123' />);
      expect(vi.mocked(useDelivery)).toHaveBeenCalledWith('test-id-123');
    });

    it('checks that empty deliveryId does not display data', () => {
      vi.mocked(useDelivery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      } as any);

      // When deliveryId is empty, the hook is called but with empty string
      // The component handles this by not displaying data
      render(<DeliveryDetailsModal {...defaultProps} deliveryId='' />);

      // The hook is called with empty string, but no data should be displayed
      expect(vi.mocked(useDelivery)).toHaveBeenCalledWith('');
      expect(screen.queryByText('TRK001')).not.toBeInTheDocument();
    });

    it('re-fetches when deliveryId changes', () => {
      vi.mocked(useDelivery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      } as any);

      const { rerender } = render(<DeliveryDetailsModal {...defaultProps} deliveryId='1' />);
      expect(vi.mocked(useDelivery)).toHaveBeenCalledWith('1');

      vi.clearAllMocks();
      rerender(<DeliveryDetailsModal {...defaultProps} deliveryId='2' />);
      expect(vi.mocked(useDelivery)).toHaveBeenCalledWith('2');
    });
  });

  describe('State Cleanup', () => {
    it('cleans up delivery data when modal closes', () => {
      vi.mocked(useDelivery).mockReturnValue({
        data: mockCompleteDelivery,
        isLoading: false,
        isError: false,
        error: null,
      } as any);

      const { rerender } = render(<DeliveryDetailsModal {...defaultProps} />);
      // Check that tracking code is displayed
      expect(screen.getByText('TRK001')).toBeInTheDocument();

      rerender(<DeliveryDetailsModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('TRK001')).not.toBeInTheDocument();
    });
  });
});
