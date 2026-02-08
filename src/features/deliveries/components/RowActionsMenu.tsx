import { useState, useRef, useEffect } from 'react';
import type { DeliveryActionType } from './types';
import { actionLabels } from './deliveriesActions';

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

interface RowActionsMenuProps {
  deliveryId: string;
  onOpenReschedule: (ids: string[]) => void;
  onOpenAssignDriver: (ids: string[]) => void;
  onOpenPriority: (ids: string[]) => void;
}

export function RowActionsMenu({
  deliveryId,
  onOpenReschedule,
  onOpenAssignDriver,
  onOpenPriority,
}: RowActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleAction = (actionId: DeliveryActionType) => {
    const ids = [deliveryId];
    switch (actionId) {
      case 'reschedule':
        onOpenReschedule(ids);
        break;
      case 'assign-driver':
        onOpenAssignDriver(ids);
        break;
      case 'update-priority':
        onOpenPriority(ids);
        break;
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
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
    <div ref={menuRef} className='relative'>
      {/* Kebab button - visible only on hover */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 hover:cursor-pointer transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 ${isOpen ? 'bg-slate-700 text-slate-100 opacity-100' : ''}`}
        aria-label='Ações da entrega'
        aria-expanded={isOpen}
        aria-haspopup='menu'
        aria-controls={`row-actions-${deliveryId}`}
      >
        <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z' />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          id={`row-actions-${deliveryId}`}
          role='menu'
          className='absolute right-0 top-full mt-1 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150'
        >
          <div className='py-1'>
            <button
              onClick={() => handleAction('reschedule')}
              className='w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 hover:cursor-pointer transition-colors'
              role='menuitem'
            >
              <RescheduleIcon />
              {actionLabels.reschedule}
            </button>
            <button
              onClick={() => handleAction('assign-driver')}
              className='w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 hover:cursor-pointer transition-colors'
              role='menuitem'
            >
              <AssignDriverIcon />
              {actionLabels['assign-driver']}
            </button>
            <button
              onClick={() => handleAction('update-priority')}
              className='w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 hover:cursor-pointer transition-colors'
              role='menuitem'
            >
              <UpdatePriorityIcon />
              {actionLabels['update-priority']}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
