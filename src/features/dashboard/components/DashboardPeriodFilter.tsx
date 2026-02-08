import { Select } from '@/shared/components';
import type { DashboardPeriod } from '../types';

export interface DashboardPeriodFilterProps {
  /** Currently selected period */
  value: DashboardPeriod;
  /** Callback when period changes */
  onChange: (period: DashboardPeriod) => void;
}

const periodLabels: Record<DashboardPeriod, string> = {
  today: 'Hoje',
  '7d': '7 dias',
  '14d': '14 dias',
  '30d': '30 dias',
};

export function DashboardPeriodFilter({ value, onChange }: DashboardPeriodFilterProps) {
  return (
    <div className='flex flex-col gap-1.5'>
      <label htmlFor='dashboard-period-filter' className='text-sm font-medium text-slate-300'>
        Período
      </label>
      <Select
        id='dashboard-period-filter'
        value={value}
        onChange={(e) => {
          const newValue = e.target.value as DashboardPeriod;
          if (['today', '7d', '14d', '30d'].includes(newValue)) {
            onChange(newValue);
          }
        }}
        aria-label='Select dashboard period'
        className='w-full min-w-[140px] sm:w-auto'
      >
        {(['today', '7d', '14d', '30d'] as DashboardPeriod[]).map((period) => (
          <option key={period} value={period}>
            {periodLabels[period]}
          </option>
        ))}
      </Select>
    </div>
  );
}
