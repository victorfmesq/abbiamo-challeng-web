import type { DeliveryActionType } from './types';

/**
 * Priority options for UpdatePriorityModal
 */
export const priorityOptions = [
  { value: 'LOW', label: 'Baixa', description: 'Entrega sem urgência, prazo estendido' },
  { value: 'NORMAL', label: 'Normal', description: 'Prioridade padrão' },
  { value: 'HIGH', label: 'Alta', description: 'Entrega prioritária' },
  { value: 'URGENT', label: 'Urgente', description: 'Entrega urgente, atenção máxima' },
] as const;

/**
 * Tailwind-safe priority color classes
 */
export const priorityColors = {
  LOW: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500',
  },
  NORMAL: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500',
  },
  HIGH: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-500',
  },
  URGENT: {
    bg: 'bg-rose-500/20',
    text: 'text-rose-400',
    border: 'border-rose-500',
  },
} as const;

/**
 * Labels for delivery actions
 */
export const actionLabels: Record<DeliveryActionType, string> = {
  reschedule: 'Reagendar',
  'assign-driver': 'Atribuir motorista',
  'update-priority': 'Atualizar prioridade',
};

/**
 * Descriptions for delivery actions (used in bulk dropdown)
 */
export const actionDescriptions: Record<DeliveryActionType, string> = {
  reschedule: 'Alterar data de entrega',
  'assign-driver': 'Designar motorista às entregas',
  'update-priority': 'Alterar nível de prioridade',
};
