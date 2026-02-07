import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`
        rounded-xl border border-slate-700 bg-slate-900 shadow-sm
        ${hover ? 'transition-colors hover:bg-slate-800' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border-b border-slate-700 px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border-t border-slate-700 px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
