import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';

export type TableProps = HTMLAttributes<HTMLTableElement>;

export function Table({ className = '', children, ...props }: TableProps) {
  return (
    <table className={`w-full min-w-full text-sm ${className}`} {...props}>
      {children}
    </table>
  );
}

export function Thead({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-slate-800/50 ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function Tbody({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-slate-700 ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export interface TrProps extends HTMLAttributes<HTMLTableRowElement> {
  hover?: boolean;
}

export function Tr({ hover = true, className = '', ...props }: TrProps) {
  return (
    <tr
      className={`${hover ? 'transition-colors hover:bg-slate-800' : ''} ${className}`}
      {...props}
    />
  );
}

export function Th({ className = '', children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`sticky top-0 z-10 bg-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function Td({ className = '', children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 text-slate-100 ${className}`} {...props}>
      {children}
    </td>
  );
}
