export type DriverStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export type VehicleType = 'MOTORCYCLE' | 'CAR' | 'VAN' | 'TRUCK';

export type VehicleDto = {
  plate: string;
  model: string;
  type: VehicleType;
};

export type DriverDto = {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: VehicleDto;
  status: DriverStatus;
  current_deliveries: number;
  total_deliveries: number;
  rating: number;
  created_at: string;
};

export type DriversListResponseDto = {
  data: DriverDto[];
  total: number;
};
