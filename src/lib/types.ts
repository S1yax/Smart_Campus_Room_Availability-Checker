export interface Booking {
  id: string;
  label: string;
  start: number; // minutes after midnight
  end: number;   // minutes after midnight
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
}

export interface FilterCriteria {
  minCapacity: number;
  requiredEquipment: string[];
}

export type CheckStatus = 'available' | 'unavailable' | null;

export interface CheckResult {
  status: CheckStatus;
  reasons: string[];
  warnings: string[];
}
