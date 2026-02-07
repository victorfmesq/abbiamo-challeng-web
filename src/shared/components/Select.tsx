import type { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  errorMessage?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, errorMessage, className = '', ...props }, ref) => {
    return (
      <div className='w-full'>
        <select
          ref={ref}
          className={`
            w-full rounded-lg border bg-slate-900 px-3 py-2 pr-10 text-sm text-slate-100 appearance-none
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700'}
            ${className}
          `}
          {...props}
        />
        {errorMessage && <p className='mt-1 text-sm text-rose-500'>{errorMessage}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
