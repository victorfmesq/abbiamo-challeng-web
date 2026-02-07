import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';

export type TableProps = HTMLAttributes<HTMLTableElement>;

export function Table({ className = '', children, ...props }: TableProps) {
  return (
    <div className='overflow-x-auto rounded-xl border border-slate-700 bg-slate-900'>
      <table className={`w-full text-sm ${className}`} {...props}>
        {children}
      </table>
    </div>
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
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 ${className}`}
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
