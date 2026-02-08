import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RowActionsMenu } from '@/features/deliveries/components/RowActionsMenu';

describe('RowActionsMenu', () => {
  const defaultProps = {
    deliveryId: 'test-delivery-id',
    onOpenReschedule: vi.fn(),
    onOpenAssignDriver: vi.fn(),
    onOpenPriority: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Render', () => {
    it('renders kebab button', () => {
      render(<RowActionsMenu {...defaultProps} />);

      expect(screen.getByRole('button', { name: /ações/i })).toBeInTheDocument();
    });

    it('does not show menu initially', () => {
      render(<RowActionsMenu {...defaultProps} />);

      expect(screen.queryByText('Reagendar')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('opens menu when kebab button is clicked', () => {
      render(<RowActionsMenu {...defaultProps} />);

      const kebabButton = screen.getByRole('button', { name: /ações/i });
      fireEvent.click(kebabButton);

      expect(screen.getByText('Reagendar')).toBeInTheDocument();
      expect(screen.getByText('Atribuir motorista')).toBeInTheDocument();
      expect(screen.getByText('Atualizar prioridade')).toBeInTheDocument();
    });

    it('closes menu with Escape key', () => {
      render(<RowActionsMenu {...defaultProps} />);

      const kebabButton = screen.getByRole('button', { name: /ações/i });
      fireEvent.click(kebabButton);

      expect(screen.getByText('Reagendar')).toBeInTheDocument();

      fireEvent.keyDown(document.body, { key: 'Escape' });

      expect(screen.queryByText('Reagendar')).not.toBeInTheDocument();
    });

    it('calls onOpenReschedule with deliveryId when reschedule is clicked', () => {
      render(<RowActionsMenu {...defaultProps} />);

      const kebabButton = screen.getByRole('button', { name: /ações/i });
      fireEvent.click(kebabButton);

      const rescheduleButton = screen.getByText('Reagendar');
      fireEvent.click(rescheduleButton);

      expect(defaultProps.onOpenReschedule).toHaveBeenCalledWith(['test-delivery-id']);
    });

    it('calls onOpenAssignDriver with deliveryId when assign driver is clicked', () => {
      render(<RowActionsMenu {...defaultProps} />);

      const kebabButton = screen.getByRole('button', { name: /ações/i });
      fireEvent.click(kebabButton);

      const assignButton = screen.getByText('Atribuir motorista');
      fireEvent.click(assignButton);

      expect(defaultProps.onOpenAssignDriver).toHaveBeenCalledWith(['test-delivery-id']);
    });

    it('calls onOpenPriority with deliveryId when priority is clicked', () => {
      render(<RowActionsMenu {...defaultProps} />);

      const kebabButton = screen.getByRole('button', { name: /ações/i });
      fireEvent.click(kebabButton);

      const priorityButton = screen.getByText('Atualizar prioridade');
      fireEvent.click(priorityButton);

      expect(defaultProps.onOpenPriority).toHaveBeenCalledWith(['test-delivery-id']);
    });
  });

  describe('Accessibility', () => {
    it('has aria-expanded attribute', () => {
      render(<RowActionsMenu {...defaultProps} />);

      const button = screen.getByRole('button', { name: /ações/i });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('has aria-haspopup attribute', () => {
      render(<RowActionsMenu {...defaultProps} />);

      const button = screen.getByRole('button', { name: /ações/i });
      expect(button).toHaveAttribute('aria-haspopup', 'menu');
    });
  });
});
