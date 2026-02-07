import type { HTMLAttributes } from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  danger: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export function Badge({ variant = 'info', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
