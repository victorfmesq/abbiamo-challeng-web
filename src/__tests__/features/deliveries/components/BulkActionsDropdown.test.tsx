import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BulkActionsDropdown } from '@/features/deliveries/components/BulkActionsDropdown';

describe('BulkActionsDropdown', () => {
  const defaultProps = {
    selectedIds: ['1', '2', '3'],
    onClearSelection: vi.fn(),
    onOpenReschedule: vi.fn(),
    onOpenAssignDriver: vi.fn(),
    onOpenPriority: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Render', () => {
    it('renders dropdown button', () => {
      render(<BulkActionsDropdown {...defaultProps} />);

      // Verifica que o botão principal existe
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('opens dropdown when button is clicked', () => {
      render(<BulkActionsDropdown {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const mainButton = buttons[0];
      fireEvent.click(mainButton);

      expect(screen.getByText('Reagendar')).toBeInTheDocument();
      expect(screen.getByText('Atribuir motorista')).toBeInTheDocument();
      expect(screen.getByText('Atualizar prioridade')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('calls onOpenReschedule when reschedule action is clicked', () => {
      render(<BulkActionsDropdown {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const mainButton = buttons[0];
      fireEvent.click(mainButton);

      const rescheduleButton = screen.getByText('Reagendar');
      fireEvent.click(rescheduleButton);

      expect(defaultProps.onOpenReschedule).toHaveBeenCalledWith(['1', '2', '3']);
    });

    it('calls onOpenAssignDriver when assign driver action is clicked', () => {
      render(<BulkActionsDropdown {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const mainButton = buttons[0];
      fireEvent.click(mainButton);

      const assignButton = screen.getByText('Atribuir motorista');
      fireEvent.click(assignButton);

      expect(defaultProps.onOpenAssignDriver).toHaveBeenCalledWith(['1', '2', '3']);
    });

    it('calls onOpenPriority when priority action is clicked', () => {
      render(<BulkActionsDropdown {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const mainButton = buttons[0];
      fireEvent.click(mainButton);

      const priorityButton = screen.getByText('Atualizar prioridade');
      fireEvent.click(priorityButton);

      expect(defaultProps.onOpenPriority).toHaveBeenCalledWith(['1', '2', '3']);
    });
  });

  describe('Clear Selection', () => {
    it('calls onClearSelection when clear button is clicked', () => {
      render(<BulkActionsDropdown {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const clearButton = buttons[1];
      fireEvent.click(clearButton);

      expect(defaultProps.onClearSelection).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has aria-expanded attribute', () => {
      render(<BulkActionsDropdown {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const mainButton = buttons[0];
      expect(mainButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes dropdown when clicking outside', () => {
      render(<BulkActionsDropdown {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const mainButton = buttons[0];
      fireEvent.click(mainButton);

      expect(screen.getByText('Reagendar')).toBeInTheDocument();

      // Simular clique fora
      fireEvent.mouseDown(document.body);

      // Verificar que o dropdown fechou
      expect(screen.queryByText('Reagendar')).not.toBeInTheDocument();
    });

    it('closes dropdown with Escape key', () => {
      render(<BulkActionsDropdown {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const mainButton = buttons[0];
      fireEvent.click(mainButton);

      expect(screen.getByText('Reagendar')).toBeInTheDocument();

      fireEvent.keyDown(document.body, { key: 'Escape' });

      expect(screen.queryByText('Reagendar')).not.toBeInTheDocument();
    });
  });
});
