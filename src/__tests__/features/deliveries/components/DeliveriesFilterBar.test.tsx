import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeliveriesFilterBar } from '@/features/deliveries/components/DeliveriesFilterBar';
import type { DeliveriesFilters } from '@/features/deliveries/domain/deliveriesFilters';

describe('DeliveriesFilterBar', () => {
  const defaultFilters: DeliveriesFilters = { page: 1, limit: 10 };
  let onFiltersChangeMock: (filters: DeliveriesFilters) => void;

  beforeEach(() => {
    onFiltersChangeMock = vi.fn() as (filters: DeliveriesFilters) => void;
  });

  describe('Render', () => {
    it('renders search input', () => {
      render(
        <DeliveriesFilterBar filters={defaultFilters} onFiltersChange={onFiltersChangeMock} />
      );
      expect(
        screen.getByPlaceholderText('Buscar por código ou destinatário...')
      ).toBeInTheDocument();
    });

    it('renders status select with options', () => {
      render(
        <DeliveriesFilterBar filters={defaultFilters} onFiltersChange={onFiltersChangeMock} />
      );
      expect(screen.getByRole('option', { name: 'Todos os status' })).toBeInTheDocument();
    });

    it('renders date filter with select dropdown', () => {
      render(
        <DeliveriesFilterBar filters={defaultFilters} onFiltersChange={onFiltersChangeMock} />
      );
      expect(screen.getByRole('combobox', { name: 'Data' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Hoje' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Amanhã' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Esta semana' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Personalizado' })).toBeInTheDocument();
    });

    it('does not render date range inputs initially', () => {
      render(
        <DeliveriesFilterBar filters={defaultFilters} onFiltersChange={onFiltersChangeMock} />
      );
      expect(screen.queryByLabelText('De')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Até')).not.toBeInTheDocument();
    });
  });

  describe('Date Selection via Select', () => {
    it('updates filters with date range when selecting "Hoje" from dropdown', () => {
      render(
        <DeliveriesFilterBar filters={defaultFilters} onFiltersChange={onFiltersChangeMock} />
      );

      const select = screen.getByRole('combobox', { name: 'Data' });
      fireEvent.change(select, { target: { value: 'today' } });

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      expect(onFiltersChangeMock).toHaveBeenCalledWith(
        expect.objectContaining({
          dateFrom: today,
          dateTo: today,
          page: 1,
        })
      );
    });

    it('updates filters with date range when selecting "Amanhã" from dropdown', () => {
      render(
        <DeliveriesFilterBar filters={defaultFilters} onFiltersChange={onFiltersChangeMock} />
      );

      const select = screen.getByRole('combobox', { name: 'Data' });
      fireEvent.change(select, { target: { value: 'tomorrow' } });

      // Get tomorrow's date in YYYY-MM-DD format
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      expect(onFiltersChangeMock).toHaveBeenCalledWith(
        expect.objectContaining({
          dateFrom: tomorrowStr,
          dateTo: tomorrowStr,
          page: 1,
        })
      );
    });

    it('updates filters with date range when selecting "Esta semana" from dropdown', () => {
      render(
        <DeliveriesFilterBar filters={defaultFilters} onFiltersChange={onFiltersChangeMock} />
      );

      const select = screen.getByRole('combobox', { name: 'Data' });
      fireEvent.change(select, { target: { value: 'thisWeek' } });

      // Get this week's start (Monday) and end (Sunday) dates
      const today = new Date();
      const dayOfWeek = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - dayOfWeek);
      const sunday = new Date(today);
      sunday.setDate(today.getDate() + (6 - dayOfWeek));
      const mondayStr = monday.toISOString().split('T')[0];
      const sundayStr = sunday.toISOString().split('T')[0];

      expect(onFiltersChangeMock).toHaveBeenCalledWith(
        expect.objectContaining({
          dateFrom: mondayStr,
          dateTo: sundayStr,
          page: 1,
        })
      );
    });
  });

  describe('Custom Date Range', () => {
    it('shows date range inputs when selecting "Personalizado"', () => {
      render(
        <DeliveriesFilterBar filters={defaultFilters} onFiltersChange={onFiltersChangeMock} />
      );

      const select = screen.getByRole('combobox', { name: 'Data' });
      fireEvent.change(select, { target: { value: 'custom' } });

      // The onChange should be called for the parent filter with custom mode
      expect(onFiltersChangeMock).toHaveBeenCalledWith(
        expect.objectContaining({
          dateFrom: undefined,
          dateTo: undefined,
          page: 1,
        })
      );

      // Date inputs should now be visible
      expect(screen.getByLabelText('De')).toBeInTheDocument();
      expect(screen.getByLabelText('Até')).toBeInTheDocument();
    });

    it('updates filters when dateFrom is selected in custom mode', () => {
      const filtersWithCustom: DeliveriesFilters = {
        page: 1,
        limit: 10,
        dateFrom: '2024-01-15',
        dateTo: '2024-01-20',
      };
      render(
        <DeliveriesFilterBar filters={filtersWithCustom} onFiltersChange={onFiltersChangeMock} />
      );

      // Verify we're in custom mode with date inputs visible
      const dateFromInput = screen.getByLabelText('De');
      expect(dateFromInput).toBeInTheDocument();

      fireEvent.change(dateFromInput, { target: { value: '2024-02-01' } });

      expect(onFiltersChangeMock).toHaveBeenCalledWith(
        expect.objectContaining({
          dateFrom: '2024-02-01',
          dateTo: '2024-01-20',
          page: 1,
        })
      );
    });

    it('updates filters when dateTo is selected in custom mode', () => {
      const filtersWithCustom: DeliveriesFilters = {
        page: 1,
        limit: 10,
        dateFrom: '2024-01-15',
        dateTo: '2024-01-20',
      };
      render(
        <DeliveriesFilterBar filters={filtersWithCustom} onFiltersChange={onFiltersChangeMock} />
      );

      const dateToInput = screen.getByLabelText('Até');
      expect(dateToInput).toBeInTheDocument();

      fireEvent.change(dateToInput, { target: { value: '2024-02-01' } });

      expect(onFiltersChangeMock).toHaveBeenCalledWith(
        expect.objectContaining({
          dateFrom: '2024-01-15',
          dateTo: '2024-02-01',
          page: 1,
        })
      );
    });

    it('shows clear button when custom date range is active', () => {
      const filtersWithCustom: DeliveriesFilters = {
        page: 1,
        limit: 10,
        dateFrom: '2024-01-15',
        dateTo: '2024-01-20',
      };
      render(
        <DeliveriesFilterBar filters={filtersWithCustom} onFiltersChange={onFiltersChangeMock} />
      );

      expect(screen.getByRole('button', { name: 'X' })).toBeInTheDocument();
    });

    it('clears custom date filter when clear link is clicked', async () => {
      const filtersWithDate: DeliveriesFilters = {
        page: 1,
        limit: 10,
        dateFrom: '2024-01-15',
        dateTo: '2024-01-20',
      };
      render(
        <DeliveriesFilterBar filters={filtersWithDate} onFiltersChange={onFiltersChangeMock} />
      );

      // Verify we're in custom mode (date inputs should be visible)
      expect(screen.getByLabelText('De')).toBeInTheDocument();

      const clearButton = screen.getByRole('button', { name: 'X' });
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(onFiltersChangeMock).toHaveBeenCalledWith(
          expect.objectContaining({
            dateFrom: undefined,
            dateTo: undefined,
            page: 1,
          })
        );
      });
    });
  });

  describe('Clear All Filters', () => {
    it('does not show clear filters button when no filters are active', () => {
      render(
        <DeliveriesFilterBar filters={defaultFilters} onFiltersChange={onFiltersChangeMock} />
      );
      expect(screen.queryByText('Limpar filtros')).not.toBeInTheDocument();
    });

    it('shows clear filters button when date filter is active', () => {
      const filtersWithCustom: DeliveriesFilters = {
        page: 1,
        limit: 10,
        dateFrom: '2024-01-15',
        dateTo: '2024-01-20',
      };
      render(
        <DeliveriesFilterBar filters={filtersWithCustom} onFiltersChange={onFiltersChangeMock} />
      );

      expect(screen.getByText('Limpar filtros')).toBeInTheDocument();
    });

    it('clears all filters when clear filters button is clicked', async () => {
      const filtersWithAll: DeliveriesFilters = {
        page: 5,
        limit: 10,
        search: 'test',
        status: 'PENDING',
        dateFrom: '2024-01-15',
        dateTo: '2024-01-20',
      };
      render(
        <DeliveriesFilterBar filters={filtersWithAll} onFiltersChange={onFiltersChangeMock} />
      );

      const clearFiltersButton = screen.getByText('Limpar filtros');
      fireEvent.click(clearFiltersButton);

      // Verify page resets
      await waitFor(() => {
        expect(onFiltersChangeMock).toHaveBeenCalledWith(
          expect.objectContaining({ page: 1, limit: 10 })
        );
      });
    });
  });

  describe('Page Reset', () => {
    it('resets to page 1 when quick filter is selected', () => {
      const filtersWithPage: DeliveriesFilters = {
        page: 3,
        limit: 10,
      };
      render(
        <DeliveriesFilterBar filters={filtersWithPage} onFiltersChange={onFiltersChangeMock} />
      );

      const select = screen.getByRole('combobox', { name: 'Data' });
      fireEvent.change(select, { target: { value: 'today' } });

      expect(onFiltersChangeMock).toHaveBeenCalledWith(expect.objectContaining({ page: 1 }));
    });
  });

  describe('Initial Values', () => {
    it('shows date inputs when initial filter has dateFrom', () => {
      const filtersWithDateFrom: DeliveriesFilters = {
        page: 1,
        limit: 10,
        dateFrom: '2024-01-15',
      };
      render(
        <DeliveriesFilterBar filters={filtersWithDateFrom} onFiltersChange={onFiltersChangeMock} />
      );

      const dateFromInput = screen.getByLabelText('De') as HTMLInputElement;
      expect(dateFromInput.value).toBe('2024-01-15');
    });

    it('shows date inputs when initial filter has dateTo', () => {
      const filtersWithDateTo: DeliveriesFilters = {
        page: 1,
        limit: 10,
        dateTo: '2024-01-20',
      };
      render(
        <DeliveriesFilterBar filters={filtersWithDateTo} onFiltersChange={onFiltersChangeMock} />
      );

      const dateToInput = screen.getByLabelText('Até') as HTMLInputElement;
      expect(dateToInput.value).toBe('2024-01-20');
    });

    it('shows clear button when initial filter has custom date range', () => {
      const filtersWithDateRange: DeliveriesFilters = {
        page: 1,
        limit: 10,
        dateFrom: '2024-01-15',
        dateTo: '2024-01-20',
      };
      render(
        <DeliveriesFilterBar filters={filtersWithDateRange} onFiltersChange={onFiltersChangeMock} />
      );

      expect(screen.getByRole('button', { name: 'X' })).toBeInTheDocument();
    });

    it('shows date inputs when initial filter has dateFrom (custom mode)', () => {
      const filtersWithDateFrom: DeliveriesFilters = {
        page: 1,
        limit: 10,
        dateFrom: '2024-01-15',
      };
      render(
        <DeliveriesFilterBar filters={filtersWithDateFrom} onFiltersChange={onFiltersChangeMock} />
      );

      // Date inputs should be visible when dateFrom is set
      expect(screen.getByLabelText('De')).toBeInTheDocument();
    });
  });
});
