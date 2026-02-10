import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Button } from './Button';
import { useId } from 'react';

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Modal content */
  children: ReactNode;
  /** Footer content (right side) */
  footer?: ReactNode;
  /** Size of the modal */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show close button in header */
  showCloseButton?: boolean;
  /** Disable body scroll when modal is open */
  disableBodyScroll?: boolean;
  /** Optional test id for E2E selectors */
  dataTestId?: string;
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  disableBodyScroll = true,
  dataTestId,
}: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle body scroll and focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      if (disableBodyScroll) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, disableBodyScroll]);

  // Focus management and trap
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const currentDialog = dialogRef.current;

    // Focus the close button or first focusable element
    const focusableElements = currentDialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    } else {
      currentDialog.setAttribute('tabindex', '-1');
      currentDialog.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = Array.from(
        currentDialog.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) || []
      ) as HTMLElement[];

      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    currentDialog.addEventListener('keydown', handleKeyDown);
    return () => {
      currentDialog.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Handle escape key - only when modal is open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Restore focus on close
  useEffect(() => {
    if (!isOpen && previousActiveElement.current) {
      // Check if element is still connected to the DOM
      if (previousActiveElement.current.isConnected) {
        previousActiveElement.current.focus();
      }
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center'
      role='presentation'
      data-testid={dataTestId}
    >
      {/* Overlay */}
      <div
        className='fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity'
        onClick={handleOverlayClick}
        aria-hidden='true'
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        className={`
          relative w-full ${sizeStyles[size]} 
          bg-slate-900 rounded-xl shadow-2xl 
          border border-slate-700
          transform transition-all
          animate-in fade-in zoom-in-95 duration-200
          max-h-[90vh] flex flex-col
          outline-none
        `}
        tabIndex={-1}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-slate-700 shrink-0'>
          <h2 id={titleId} className='text-lg font-semibold text-slate-100'>
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className='p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors'
              aria-label='Fechar modal'
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
          )}
        </div>

        {/* Body */}
        <div className='flex-1 overflow-auto px-6 py-4'>{children}</div>

        {/* Footer */}
        {footer && (
          <div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700 shrink-0'>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Modal footer with default cancel/confirm buttons
 */
export interface ModalFooterProps {
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  confirmDisabled?: boolean;
  confirmVariant?: 'primary' | 'secondary' | 'destructive';
}

export function ModalFooter({
  onCancel,
  onConfirm,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isLoading = false,
  confirmDisabled = false,
  confirmVariant = 'primary',
}: ModalFooterProps) {
  return (
    <>
      {onCancel && (
        <Button variant='ghost' onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>
      )}
      {onConfirm && (
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          loading={isLoading}
          disabled={confirmDisabled}
        >
          {confirmLabel}
        </Button>
      )}
    </>
  );
}
