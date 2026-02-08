import type { ReactNode } from 'react';

export type DeliveryActionType = 'reschedule' | 'assign-driver' | 'update-priority';

export interface DeliveryAction {
  /** Unique identifier for the action */
  id: DeliveryActionType;
  /** Display label for the action */
  label: string;
  /** Icon component to display */
  icon: ReactNode;
  /** Description shown in dropdown menu */
  description?: string;
  /** Whether this action is destructive */
  isDestructive?: boolean;
}

export interface DeliveryActionHandler {
  /** Callback when an action is selected */
  onAction: (actionType: DeliveryActionType, deliveryIds: string[]) => void;
}

export interface DeliveryActionCallbacks extends DeliveryActionHandler {
  /** Callback to open reschedule modal */
  onOpenReschedule: (ids: string[]) => void;
  /** Callback to open assign driver modal */
  onOpenAssignDriver: (ids: string[]) => void;
  /** Callback to open update priority modal */
  onOpenPriority: (ids: string[]) => void;
}
