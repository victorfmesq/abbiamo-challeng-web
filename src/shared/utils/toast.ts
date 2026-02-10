import toast from 'react-hot-toast';
import { HttpError } from '@/services/httpError';

type ToastOptions = { id?: string };

export function toastSuccess(message: string, opts?: ToastOptions) {
  return toast.success(message, { id: opts?.id });
}

export function toastLoading(message: string, opts: { id: string }) {
  return toast.loading(message, { id: opts.id });
}

export function toastError(error: unknown, fallbackMessage: string, opts?: ToastOptions) {
  if (error instanceof HttpError && error.message) {
    return toast.error(error.message, { id: opts?.id });
  }

  if (error instanceof Error && error.message) {
    return toast.error(error.message, { id: opts?.id });
  }

  return toast.error(fallbackMessage, { id: opts?.id });
}

export function toastDismiss(id: string) {
  return toast.dismiss(id);
}
