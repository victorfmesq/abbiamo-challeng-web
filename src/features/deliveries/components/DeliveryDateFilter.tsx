import type { ChangeEvent } from 'react';
import { useCallback, useState } from 'react';
import { Input, Select } from '@/shared/components';

export interface DeliveryDateFilterValue {
  dateFrom?: string;
  dateTo?: string;
  quickFilter?: 'today' | 'tomorrow' | 'thisWeek' | null;
}

export interface DeliveryDateFilterProps {
  value: DeliveryDateFilterValue;
  onChange: (value: DeliveryDateFilterValue) => void;
  className?: string;
}

type SelectQuickFilter = Exclude<DeliveryDateFilterValue['quickFilter'], null>;

interface QuickFilterOption {
  label: string;
  value: SelectQuickFilter;
}

const QUICK_FILTER_OPTIONS: QuickFilterOption[] = [
  { label: 'Hoje', value: 'today' },
  { label: 'Amanhã', value: 'tomorrow' },
  { label: 'Esta semana', value: 'thisWeek' },
];

const CUSTOM_VALUE = 'custom';

export function DeliveryDateFilter({ value, onChange, className = '' }: DeliveryDateFilterProps) {
  const { dateFrom, dateTo, quickFilter } = value;

  // Track if "Personalizado" was explicitly selected (even with empty dates)
  const [customSelected, setCustomSelected] = useState(false);

  const isCustomMode = customSelected || (!quickFilter && (dateFrom || dateTo));
  const selectValue = quickFilter || (isCustomMode ? CUSTOM_VALUE : '');

  const handleQuickFilterSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = e.target.value;

      if (selectedValue === CUSTOM_VALUE) {
        setCustomSelected(true);
        const newValue: DeliveryDateFilterValue = {
          quickFilter: null,
          dateFrom: dateFrom || '',
          dateTo: dateTo || '',
        };
        onChange(newValue);
        return;
      }

      // When selecting a quick filter, reset customSelected
      setCustomSelected(false);

      const newValue: DeliveryDateFilterValue = {
        quickFilter: selectedValue as SelectQuickFilter,
        dateFrom: undefined,
        dateTo: undefined,
      };
      onChange(newValue);
    },
    [dateFrom, dateTo, onChange]
  );

  const handleDateFromChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue: DeliveryDateFilterValue = {
        dateFrom: e.target.value || undefined,
        dateTo,
        quickFilter: null,
      };
      onChange(newValue);
    },
    [dateTo, onChange]
  );

  const handleDateToChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue: DeliveryDateFilterValue = {
        dateFrom,
        dateTo: e.target.value || undefined,
        quickFilter: null,
      };
      onChange(newValue);
    },
    [dateFrom, onChange]
  );

  const handleClear = useCallback(() => {
    onChange({
      dateFrom: undefined,
      dateTo: undefined,
      quickFilter: null,
    });

    setCustomSelected(false);
  }, [onChange]);

  return (
    <div className={`flex gap-3 ${className}`}>
      {!isCustomMode ? (
        <div className='flex flex-col gap-1'>
          <Select
            id='dateFilterSelect'
            value={selectValue}
            onChange={handleQuickFilterSelect}
            className='w-full sm:w-48'
            aria-label='Data'
          >
            <option value=''>Data</option>
            {QUICK_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            <option value={CUSTOM_VALUE}>Personalizado</option>
          </Select>
        </div>
      ) : (
        <div className='flex flex-row gap-4 justify-center items-center sm:items-end'>
          <div className='flex items-center justify-center gap-1 sm:w-40 '>
            <label htmlFor='dateFrom' className='flex text-sm text-slate-400'>
              De
            </label>
            <Input
              id='dateFrom'
              type='date'
              value={dateFrom || ''}
              onChange={handleDateFromChange}
              className='[&::-webkit-calendar-picker-indicator]:invert'
            />
          </div>

          <div className='flex items-center justify-center gap-1 sm:w-40 '>
            <label htmlFor='dateTo' className='text-sm text-slate-400'>
              Até
            </label>
            <Input
              id='dateTo'
              type='date'
              value={dateTo || ''}
              onChange={handleDateToChange}
              className='[&::-webkit-calendar-picker-indicator]:invert'
            />
          </div>

          <button
            type='button'
            onClick={handleClear}
            className='flex size-full justify-center items-center text-sm text-slate-400 hover:text-slate-200 hover:cursor-pointer focus:outline-none rounded'
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}
