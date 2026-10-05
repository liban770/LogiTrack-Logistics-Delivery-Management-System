export type UserRole = 'admin' | 'dispatcher' | 'driver' | 'customer';

export type ShipmentStatus =
  | 'Pending'
  | 'Pickup Scheduled'
  | 'Picked Up'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Delayed'
  | 'Failed Delivery'
  | 'Cancelled'
  | 'Returned';

export type ShippingType = 'Standard' | 'Express' | 'Same Day' | 'Freight';
export type PriorityLevel = 'Normal' | 'Urgent' | 'Critical' | 'High' | 'Medium' | 'Low';

export type DriverStatus = 'Available' | 'On Delivery' | 'Offline' | 'On Break' | 'Unavailable';

export type VehicleType = 'Van' | 'Box Truck' | 'Motorcycle' | 'Heavy Truck' | 'Electric Sprinter';
export type VehicleStatus = 'Available' | 'In Use' | 'Maintenance' | 'Out of Service';

export interface TrackingEvent {
  id: string;
  timestamp: string;
  status: ShipmentStatus;
  location: string;
  description: string;
  actor?: string;
}

export interface ProofOfDelivery {
  id: string;
  shipmentId: string;
  deliveredAt: string;
  recipientName: string;
  signatureDataUrl?: string;
  photoUrl?: string;
  gpsCoordinates: { lat: number; lng: number };
  driverNotes?: string;
  verifiedByDriverId: string;
  driverName: string;
}

export interface ShipmentItem {
  id: string;
  description: string;
  quantity: number;
  weightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
}

export interface Shipment {
  id: string;
  trackingNumber: string; // e.g. "LT-2026-000184"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderPhone: string;

  receiverName: string;
  receiverAddress: string;
  receiverCity: string;
  receiverPhone: string;

  items: ShipmentItem[];
  totalWeightKg: number;
  shippingType: ShippingType;
  priority: PriorityLevel;

  pickupDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;

  status: ShipmentStatus;
  currentLocation: string;
  currentCoordinates: { lat: number; lng: number };
  
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedVehicleId?: string;
  assignedVehicleReg?: string;
  
  warehouseId?: string;
  specialInstructions?: string;
  isFragile?: boolean;
  isHazardous?: boolean;

  trackingHistory: TrackingEvent[];
  proofOfDelivery?: ProofOfDelivery;
  createdAt: string;
  estimatedArrival?: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  licenseNumber: string;
  licenseExpiration: string;
  status: DriverStatus;
  assignedVehicleId?: string;
  assignedVehicleName?: string;
  currentLocation: { lat: number; lng: number; address: string };
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  onTimeRate: number; // percentage
  averageDeliveryMinutes: number;
  rating: number; // 1-5
  joinedDate: string;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  cost: number;
  nextServiceDate: string;
  notes: string;
  technician?: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string; // e.g. "LT-VAN-402"
  type: VehicleType;
  model: string;
  year: number;
  assignedDriverId?: string;
  assignedDriverName?: string;
  capacityKg: number;
  capacityM3: number;
  currentMileageKm: number;
  fuelBatteryPercent: number;
  status: VehicleStatus;
  insuranceExpiration: string;
  lastServiceDate: string;
  maintenanceRecords: MaintenanceRecord[];
  coordinates: { lat: number; lng: number };
}

export interface RouteStop {
  id: string;
  sequence: number;
  type: 'pickup' | 'delivery' | 'depot';
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  shipmentId?: string;
  trackingNumber?: string;
  estimatedArrival: string;
  actualArrival?: string;
  completed: boolean;
  notes?: string;
}

export interface Route {
  id: string;
  name: string;
  assignedDriverId: string;
  assignedDriverName: string;
  assignedVehicleId: string;
  assignedVehicleReg: string;
  startLocation: string;
  endLocation: string;
  stops: RouteStop[];
  totalDistanceKm: number;
  estimatedDurationMinutes: number;
  status: 'Draft' | 'In Progress' | 'Completed';
  date: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  capacityPackages: number;
  currentPackagesCount: number;
  managerName: string;
  contactPhone: string;
  coordinates: { lat: number; lng: number };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  linkShipmentId?: string;
}
