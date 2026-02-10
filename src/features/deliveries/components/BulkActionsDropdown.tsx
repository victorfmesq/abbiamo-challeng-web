import { useState, useRef, useEffect } from 'react';
import type { DeliveryActionType } from './types';
import { actionLabels, actionDescriptions } from './deliveriesActions';

/**
 * Icon components as functions (required for erasableSyntaxOnly config)
 */
function RescheduleIcon() {
  return (
    <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
      />
    </svg>
  );
}

function AssignDriverIcon() {
  return (
    <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      />
    </svg>
  );
}

function UpdatePriorityIcon() {
  return (
    <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
      />
    </svg>
  );
}

function ChevronDownIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${className}`}
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
    </svg>
  );
}

interface BulkActionsDropdownProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onOpenReschedule: (ids: string[]) => void;
  onOpenAssignDriver: (ids: string[]) => void;
  onOpenPriority: (ids: string[]) => void;
}

export function BulkActionsDropdown({
  selectedIds,
  onClearSelection,
  onOpenReschedule,
  onOpenAssignDriver,
  onOpenPriority,
}: BulkActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAction = (actionId: DeliveryActionType) => {
    switch (actionId) {
      case 'reschedule':
        onOpenReschedule(selectedIds);
        break;
      case 'assign-driver':
        onOpenAssignDriver(selectedIds);
        break;
      case 'update-priority':
        onOpenPriority(selectedIds);
        break;
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className='relative flex items-center gap-2'>
      {/* Botão principal do bulk actions */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer text-white rounded-lg shadow-lg transition-all duration-200'
        aria-label={`Abrir menu de ações para ${selectedIds.length} entregas selecionadas`}
        data-testid='bulk-actions-open'
        aria-expanded={isOpen}
        aria-haspopup='menu'
      >
        <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
          />
        </svg>
        <span className='font-medium'>{selectedIds.length} selecionados</span>
        <ChevronDownIcon className={isOpen ? 'rotate-180' : ''} />
      </button>

      {/* Botão de limpar seleção */}
      <button
        onClick={onClearSelection}
        className='p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 hover:cursor-pointer rounded-lg transition-colors'
        aria-label='Limpar seleção'
        title='Limpar seleção'
      >
        <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className='absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200'>
          <div className='p-2 border-b border-slate-700'>
            <p className='text-xs text-slate-400 uppercase tracking-wider font-semibold'>
              Ações disponíveis
            </p>
          </div>
          <div className='p-2'>
            <button
              onClick={() => handleAction('reschedule')}
              className='w-full flex items-center gap-3 px-3 py-2.5 text-left text-slate-200 hover:bg-slate-800 hover:cursor-pointer rounded-lg transition-colors'
              role='menuitem'
              data-testid='bulk-action-reschedule'
            >
              <RescheduleIcon />
              <div className='flex-1 min-w-0'>
                <p className='font-medium'>{actionLabels.reschedule}</p>
                <p className='text-xs text-slate-400 truncate'>{actionDescriptions.reschedule}</p>
              </div>
            </button>
            <button
              onClick={() => handleAction('assign-driver')}
              className='w-full flex items-center gap-3 px-3 py-2.5 text-left text-slate-200 hover:bg-slate-800 hover:cursor-pointer rounded-lg transition-colors'
              role='menuitem'
            >
              <AssignDriverIcon />
              <div className='flex-1 min-w-0'>
                <p className='font-medium'>{actionLabels['assign-driver']}</p>
                <p className='text-xs text-slate-400 truncate'>
                  {actionDescriptions['assign-driver']}
                </p>
              </div>
            </button>
            <button
              onClick={() => handleAction('update-priority')}
              className='w-full flex items-center gap-3 px-3 py-2.5 text-left text-slate-200 hover:bg-slate-800 hover:cursor-pointer rounded-lg transition-colors'
              role='menuitem'
              data-testid='bulk-action-update-priority'
            >
              <UpdatePriorityIcon />
              <div className='flex-1 min-w-0'>
                <p className='font-medium'>{actionLabels['update-priority']}</p>
                <p className='text-xs text-slate-400 truncate'>
                  {actionDescriptions['update-priority']}
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
