import { useEffect, useRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export type CheckboxState = 'none' | 'partial' | 'full';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  state?: CheckboxState;
  label?: string;
  indeterminate?: boolean;
}

const baseStyles = `
  h-5 w-5 rounded border-2 cursor-pointer transition-all duration-200
  flex items-center justify-center flex-shrink-0
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950
`;

const stateStyles: Record<CheckboxState, string> = {
  none: `
    border-slate-600 bg-slate-900
    hover:border-slate-500
  `,
  partial: `
    border-indigo-500 bg-indigo-500
    [&:hover]:bg-indigo-400
  `,
  full: `
    border-indigo-500 bg-indigo-500
    [&:hover]:bg-indigo-400
  `,
};

const iconStyles: Record<CheckboxState, string> = {
  none: 'invisible',
  partial: 'visible text-white',
  full: 'visible text-white',
};

export function Checkbox({
  state = 'none',
  label,
  indeterminate,
  className = '',
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);

  const displayState = indeterminate ? 'partial' : state;

  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
      <div className={`relative ${baseStyles} ${stateStyles[displayState]}`}>
        <input
          ref={inputRef}
          type='checkbox'
          checked={state === 'full'}
          className='sr-only'
          {...props}
        />
        <svg
          className={`h-3 w-3 absolute inset-0 m-auto ${iconStyles[displayState]}`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={3}
        >
          {displayState === 'full' && (
            <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
          )}
          {displayState === 'partial' && (
            <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
          )}
        </svg>
      </div>
      {label && <span className='text-sm text-slate-100'>{label}</span>}
    </label>
  );
}
