import type { ReactNode } from 'react';
import { Card } from '@/shared/components';

export interface MetricCardProps {
  /** The title label for the metric */
  title: string;
  /** The numeric or string value to display */
  value: number | string;
  /** Optional hint for additional context */
  hint?: string;
  /** Color variant for status indication */
  variant?: 'default' | 'warning' | 'danger' | 'success';
  /** Optional icon to display alongside the metric */
  icon?: ReactNode;
  /** Optional trend indicator showing direction and percentage */
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

const variantStyles = {
  default: {
    icon: 'text-slate-400',
    value: 'text-slate-100',
    hint: 'text-slate-400',
    border: 'border-slate-700',
  },
  warning: {
    icon: 'text-amber-500',
    value: 'text-amber-500',
    hint: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  danger: {
    icon: 'text-rose-500',
    value: 'text-rose-500',
    hint: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  success: {
    icon: 'text-emerald-500',
    value: 'text-emerald-500',
    hint: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
};

export function MetricCard({
  title,
  value,
  hint,
  variant = 'default',
  icon,
  trend,
}: MetricCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card
      className={`
        flex flex-col gap-3 p-5 transition-all
        ${styles.border}
        ${variant === 'danger' ? 'ring-1 ring-rose-500/20' : ''}
      `}
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex min-w-0 flex-col gap-1'>
          <span className='text-sm font-medium text-slate-400 truncate'>{title}</span>
          <div className='flex items-baseline gap-2'>
            <span
              className={`
                text-3xl font-bold tracking-tight
                ${styles.value}
              `}
            >
              {value}
            </span>
          </div>
        </div>
        {icon && <div className={`flex-shrink-0 ${styles.icon}`}>{icon}</div>}
      </div>

      {(hint || trend) && (
        <div className='flex flex-wrap items-center gap-3 mt-auto'>
          {hint && <span className={`text-xs ${styles.hint}`}>{hint}</span>}
          {trend && (
            <span
              className={`
                flex items-center gap-1 text-xs font-medium
                ${trend.direction === 'up' ? 'text-emerald-500' : 'text-rose-500'}
              `}
              aria-label={`Trend: ${trend.direction === 'up' ? 'up' : 'down'} ${trend.value}%`}
            >
              {trend.direction === 'up' ? (
                <svg
                  className='w-3.5 h-3.5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 10l7-7m0 0l7 7m-7-7v18'
                  />
                </svg>
              ) : (
                <svg
                  className='w-3.5 h-3.5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 14l-7 7m0 0l-7-7m7 7V3'
                  />
                </svg>
              )}
              {trend.value}%
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
