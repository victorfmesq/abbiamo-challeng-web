export type DeliveryStatus =
  | 'PENDING'
  | 'DISPATCHED'
  | 'IN_ROUTE'
  | 'DELIVERED'
  | 'DELAYED'
  | 'FAILED';

export type DeliveryPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type CoordinatesDto = { lat: number; lng: number };

export type AddressDto = {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  coordinates?: CoordinatesDto;
};

export type RecipientDto = {
  name: string;
  phone: string;
  document: string;
  address: AddressDto;
};

export type DeliveryEventDto = {
  id: string;
  status: DeliveryStatus;
  timestamp: string;
  actor: string;
  notes?: string;
};

export type DeliveryDto = {
  id: string;
  tracking_code: string;
  status: DeliveryStatus;
  priority: DeliveryPriority;
  assigned_driver?: string;
  recipient: RecipientDto;
  created_at: string;
  expected_delivery_at: string;
  delivery_attempts: number;
  timeline: DeliveryEventDto[];
};

export type PaginatedDeliveriesResponseDto = {
  data: DeliveryDto[];
  total: number;
  page: number;
  totalPages: number;
};

export type DeliveryStatsDto = {
  total: number;
  inRoute: { count: number; percentage: string };
  completed: { count: number; percentage: string };
  delayed: { count: number; percentage: string };
  byStatus: Record<DeliveryStatus, number>;
};

export type BulkOperationResponseDto = {
  success: boolean;
  updated: number;
  notFound: number;
  notFoundIds: string[];
  data: unknown[];
};

export type BulkRescheduleDto = {
  deliveryIds: string[];
  newExpectedDate: string;
};

export type BulkAssignDriverDto = {
  deliveryIds: string[];
  driverId: string;
};

export type BulkUpdatePriorityDto = {
  deliveryIds: string[];
  priority: DeliveryPriority;
};
