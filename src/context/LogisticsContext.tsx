import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Shipment,
  Driver,
  Vehicle,
  Warehouse,
  Route,
  AppNotification,
  UserRole,
  ShipmentStatus,
  ProofOfDelivery,
  DriverStatus,
  VehicleStatus,
  MaintenanceRecord,
  RouteStop
} from '../types';
import {
  initialShipments,
  initialDrivers,
  initialVehicles,
  initialWarehouses,
  initialRoutes,
  initialNotifications
} from '../data/mockData';

interface LogisticsContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedShipmentId: string | null;
  setSelectedShipmentId: (id: string | null) => void;
  trackingLookupNumber: string;
  setTrackingLookupNumber: (num: string) => void;

  shipments: Shipment[];
  drivers: Driver[];
  vehicles: Vehicle[];
  warehouses: Warehouse[];
  routes: Route[];
  notifications: AppNotification[];

  isNewShipmentModalOpen: boolean;
  setIsNewShipmentModalOpen: (open: boolean) => void;
  isPodModalOpen: boolean;
  setIsPodModalOpen: (open: boolean) => void;
  podTargetShipment: Shipment | null;
  setPodTargetShipment: (shipment: Shipment | null) => void;

  // Actions
  createShipment: (newShipment: Partial<Shipment>) => string;
  updateShipmentStatus: (shipmentId: string, newStatus: ShipmentStatus, description?: string) => void;
  assignDriverAndVehicle: (shipmentId: string, driverId: string, vehicleId: string) => void;
  submitProofOfDelivery: (podData: Omit<ProofOfDelivery, 'id'>) => void;
  
  createDriver: (driverData: Partial<Driver>) => void;
  updateDriverStatus: (driverId: string, status: DriverStatus) => void;
  
  createVehicle: (vehicleData: Partial<Vehicle>) => void;
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
  addVehicleMaintenance: (vehicleId: string, record: Omit<MaintenanceRecord, 'id'>) => void;

  createRoute: (routeData: Partial<Route>) => void;
  optimizeRouteStops: (routeId: string) => void;
  toggleRouteStopCompleted: (routeId: string, stopId: string) => void;

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error', linkShipmentId?: string) => void;

  advanceLiveSimulation: () => void;
  resetDemoData: () => void;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

export const LogisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [trackingLookupNumber, setTrackingLookupNumber] = useState<string>('LT-2026-000184');

  const [isNewShipmentModalOpen, setIsNewShipmentModalOpen] = useState<boolean>(false);
  const [isPodModalOpen, setIsPodModalOpen] = useState<boolean>(false);
  const [podTargetShipment, setPodTargetShipment] = useState<Shipment | null>(null);

  // Initializing state with localStorage fallback
  const [shipments, setShipments] = useState<Shipment[]>(() => {
    const saved = localStorage.getItem('logitrack_shipments');
    return saved ? JSON.parse(saved) : initialShipments;
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('logitrack_drivers');
    return saved ? JSON.parse(saved) : initialDrivers;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('logitrack_vehicles');
    return saved ? JSON.parse(saved) : initialVehicles;
  });

  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem('logitrack_warehouses');
    return saved ? JSON.parse(saved) : initialWarehouses;
  });

  const [routes, setRoutes] = useState<Route[]>(() => {
    const saved = localStorage.getItem('logitrack_routes');
    return saved ? JSON.parse(saved) : initialRoutes;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('logitrack_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('logitrack_shipments', JSON.stringify(shipments));
  }, [shipments]);

  useEffect(() => {
    localStorage.setItem('logitrack_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('logitrack_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('logitrack_routes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('logitrack_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error',
    linkShipmentId?: string
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false,
      linkShipmentId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const createShipment = (data: Partial<Shipment>): string => {
    const count = shipments.length + 185;
    const trackingNumber = `LT-2026-000${count}`;
    const id = `shp-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newShipment: Shipment = {
      id,
      trackingNumber,
      customerId: data.customerId || `cust-${Date.now()}`,
      customerName: data.customerName || 'General Customer',
      customerEmail: data.customerEmail || 'client@example.com',
      customerPhone: data.customerPhone || '+1 (555) 012-3456',
      senderName: data.senderName || 'Central Staging Hub',
      senderAddress: data.senderAddress || '4200 Logistics Pkwy',
      senderCity: data.senderCity || 'Chicago, IL',
      senderPhone: data.senderPhone || '+1 (312) 555-0100',
      receiverName: data.receiverName || 'Recipient',
      receiverAddress: data.receiverAddress || '100 Main St',
      receiverCity: data.receiverCity || 'Chicago, IL',
      receiverPhone: data.receiverPhone || '+1 (312) 555-0199',
      items: data.items && data.items.length > 0 ? data.items : [
        {
          id: `item-${Date.now()}`,
          description: 'Logistics Parcel Standard',
          quantity: 1,
          weightKg: data.totalWeightKg || 5.0,
          dimensionsCm: { length: 30, width: 25, height: 20 }
        }
      ],
      totalWeightKg: data.totalWeightKg || 5.0,
      shippingType: data.shippingType || 'Standard',
      priority: data.priority || 'Normal',
      pickupDate: data.pickupDate || nowIso,
      expectedDeliveryDate: data.expectedDeliveryDate || new Date(Date.now() + 86400000).toISOString(),
      status: 'Pending',
      currentLocation: data.warehouseId ? 'Central Logistics Hub' : 'Order Received',
      currentCoordinates: { lat: 41.8781, lng: -87.6298 },
      warehouseId: data.warehouseId || 'wh-1',
      specialInstructions: data.specialInstructions || '',
      isFragile: !!data.isFragile,
      isHazardous: !!data.isHazardous,
      createdAt: nowIso,
      estimatedArrival: 'Tomorrow afternoon',
      trackingHistory: [
        {
          id: `th-${Date.now()}`,
          timestamp: nowIso,
          status: 'Pending',
          location: data.senderCity || 'Chicago, IL',
          description: 'Shipment created and registered in LogiTrack system.'
        }
      ]
    };

    setShipments(prev => [newShipment, ...prev]);
    addNotification(
      'New Shipment Created',
      `Shipment ${trackingNumber} created for ${newShipment.customerName}.`,
      'info',
      newShipment.id
    );
    return id;
  };

  const updateShipmentStatus = (shipmentId: string, newStatus: ShipmentStatus, description?: string) => {
    const nowIso = new Date().toISOString();
    setShipments(prev =>
      prev.map(s => {
        if (s.id !== shipmentId) return s;

        const newEvent = {
          id: `th-${Date.now()}`,
          timestamp: nowIso,
          status: newStatus,
          location: s.currentLocation,
          description: description || `Status updated to ${newStatus}`
        };

        const updated: Shipment = {
          ...s,
          status: newStatus,
          trackingHistory: [...s.trackingHistory, newEvent]
        };

        if (newStatus === 'Delivered') {
          updated.actualDeliveryDate = nowIso;
        }

        return updated;
      })
    );

    addNotification(
      `Shipment Status: ${newStatus}`,
      `Shipment ${shipmentId} updated to ${newStatus}.`,
      newStatus === 'Delivered' ? 'success' : newStatus === 'Delayed' ? 'warning' : 'info',
      shipmentId
    );
  };

  const assignDriverAndVehicle = (shipmentId: string, driverId: string, vehicleId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    const vehicle = vehicles.find(v => v.id === vehicleId);

    setShipments(prev =>
      prev.map(s => {
        if (s.id !== shipmentId) return s;
        const nowIso = new Date().toISOString();
        const event = {
          id: `th-${Date.now()}`,
          timestamp: nowIso,
          status: s.status === 'Pending' ? ('Pickup Scheduled' as ShipmentStatus) : s.status,
          location: s.currentLocation,
          description: `Assigned to driver ${driver ? driver.name : driverId} with vehicle ${vehicle ? vehicle.registrationNumber : vehicleId}.`,
          actor: driver?.name
        };
        return {
          ...s,
          assignedDriverId: driverId,
          assignedDriverName: driver?.name,
          assignedVehicleId: vehicleId,
          assignedVehicleReg: vehicle?.registrationNumber,
          status: s.status === 'Pending' ? ('Pickup Scheduled' as ShipmentStatus) : s.status,
          trackingHistory: [...s.trackingHistory, event]
        };
      })
    );

    // Update driver status if available
    setDrivers(prev =>
      prev.map(d => (d.id === driverId ? { ...d, status: 'On Delivery', assignedVehicleId: vehicleId } : d))
    );

    // Update vehicle status
    setVehicles(prev =>
      prev.map(v => (v.id === vehicleId ? { ...v, status: 'In Use', assignedDriverId: driverId } : v))
    );

    addNotification(
      'Driver & Vehicle Assigned',
      `Assigned ${driver?.name || 'Driver'} & ${vehicle?.registrationNumber || 'Vehicle'} to shipment.`,
      'info',
      shipmentId
    );
  };

  const submitProofOfDelivery = (podData: Omit<ProofOfDelivery, 'id'>) => {
    const podId = `pod-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const completePod: ProofOfDelivery = {
      ...podData,
      id: podId
    };

    setShipments(prev =>
      prev.map(s => {
        if (s.id !== podData.shipmentId) return s;

        const event = {
          id: `th-${Date.now()}`,
          timestamp: nowIso,
          status: 'Delivered' as ShipmentStatus,
          location: s.receiverAddress,
          description: `Delivered to ${podData.recipientName}. Digital signature and proof photo recorded.`,
          actor: podData.driverName
        };

        return {
          ...s,
          status: 'Delivered',
          actualDeliveryDate: nowIso,
          proofOfDelivery: completePod,
          currentLocation: 'Delivered to Recipient',
          trackingHistory: [...s.trackingHistory, event]
        };
      })
    );

    // Also update driver statistics
    setDrivers(prev =>
      prev.map(d => {
        if (d.id === podData.verifiedByDriverId) {
          const total = d.totalDeliveries + 1;
          const successful = d.successfulDeliveries + 1;
          const onTimeRate = Math.min(100, Math.round((successful / total) * 1000) / 10);
          return {
            ...d,
            totalDeliveries: total,
            successfulDeliveries: successful,
            onTimeRate
          };
        }
        return d;
      })
    );

    addNotification(
      'Delivery Completed & POD Confirmed',
      `Shipment ${podData.shipmentId} verified delivered to ${podData.recipientName}.`,
      'success',
      podData.shipmentId
    );
  };

  const createDriver = (driverData: Partial<Driver>) => {
    const id = `drv-${Date.now()}`;
    const newDriver: Driver = {
      id,
      name: driverData.name || 'New Driver',
      email: driverData.email || 'driver@logitrack.io',
      phone: driverData.phone || '+1 (555) 000-0000',
      avatar: driverData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      licenseNumber: driverData.licenseNumber || 'CDL-PENDING',
      licenseExpiration: driverData.licenseExpiration || '2028-12-31',
      status: driverData.status || 'Available',
      assignedVehicleId: driverData.assignedVehicleId,
      assignedVehicleName: driverData.assignedVehicleName,
      currentLocation: driverData.currentLocation || { lat: 41.8781, lng: -87.6298, address: 'Central Hub' },
      totalDeliveries: 0,
      successfulDeliveries: 0,
      failedDeliveries: 0,
      onTimeRate: 100,
      averageDeliveryMinutes: 25,
      rating: 5.0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setDrivers(prev => [newDriver, ...prev]);
    addNotification('Driver Onboarded', `${newDriver.name} added to driver fleet.`, 'success');
  };

  const updateDriverStatus = (driverId: string, status: DriverStatus) => {
    setDrivers(prev => prev.map(d => (d.id === driverId ? { ...d, status } : d)));
  };

  const createVehicle = (vehicleData: Partial<Vehicle>) => {
    const id = `veh-${Date.now()}`;
    const newVehicle: Vehicle = {
      id,
      registrationNumber: vehicleData.registrationNumber || `LT-${Math.floor(100 + Math.random() * 900)}`,
      type: vehicleData.type || 'Van',
      model: vehicleData.model || 'Standard Cargo Carrier',
      year: vehicleData.year || 2024,
      assignedDriverId: vehicleData.assignedDriverId,
      assignedDriverName: vehicleData.assignedDriverName,
      capacityKg: vehicleData.capacityKg || 2000,
      capacityM3: vehicleData.capacityM3 || 15.0,
      currentMileageKm: vehicleData.currentMileageKm || 0,
      fuelBatteryPercent: vehicleData.fuelBatteryPercent || 100,
      status: vehicleData.status || 'Available',
      insuranceExpiration: vehicleData.insuranceExpiration || '2027-12-31',
      lastServiceDate: new Date().toISOString().split('T')[0],
      maintenanceRecords: [],
      coordinates: { lat: 41.8781, lng: -87.6298 }
    };
    setVehicles(prev => [newVehicle, ...prev]);
    addNotification('Vehicle Added', `Vehicle ${newVehicle.registrationNumber} added to fleet.`, 'info');
  };

  const updateVehicleStatus = (vehicleId: string, status: VehicleStatus) => {
    setVehicles(prev => prev.map(v => (v.id === vehicleId ? { ...v, status } : v)));
  };

  const addVehicleMaintenance = (vehicleId: string, record: Omit<MaintenanceRecord, 'id'>) => {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: `mr-${Date.now()}`
    };
    setVehicles(prev =>
      prev.map(v =>
        v.id === vehicleId
          ? {
              ...v,
              maintenanceRecords: [newRecord, ...v.maintenanceRecords],
              lastServiceDate: record.date
            }
          : v
      )
    );
    addNotification('Maintenance Logged', `Service logged for vehicle: ${record.type}`, 'info');
  };

  const createRoute = (routeData: Partial<Route>) => {
    const id = `rt-${Date.now()}`;
    const newRoute: Route = {
      id,
      name: routeData.name || 'New Route Run',
      assignedDriverId: routeData.assignedDriverId || '',
      assignedDriverName: routeData.assignedDriverName || 'Unassigned',
      assignedVehicleId: routeData.assignedVehicleId || '',
      assignedVehicleReg: routeData.assignedVehicleReg || 'Unassigned',
      startLocation: routeData.startLocation || 'Central Logistics Hub',
      endLocation: routeData.endLocation || 'Central Logistics Hub',
      stops: routeData.stops || [],
      totalDistanceKm: routeData.totalDistanceKm || 35.0,
      estimatedDurationMinutes: routeData.estimatedDurationMinutes || 120,
      status: 'Draft',
      date: new Date().toISOString().split('T')[0]
    };
    setRoutes(prev => [newRoute, ...prev]);
    addNotification('Route Created', `Delivery route "${newRoute.name}" created.`, 'info');
  };

  const optimizeRouteStops = (routeId: string) => {
    setRoutes(prev =>
      prev.map(r => {
        if (r.id !== routeId) return r;
        // Keep depot stops at start and end, sort intermediate stops by sequence or simulated distance
        const stopsCopy = [...r.stops];
        if (stopsCopy.length <= 2) return r;

        const first = stopsCopy[0];
        const last = stopsCopy[stopsCopy.length - 1];
        const middle = stopsCopy.slice(1, stopsCopy.length - 1);

        // Sort middle stops by lat/lng proximity to start
        middle.sort((a, b) => {
          const distA = Math.hypot(a.coordinates.lat - first.coordinates.lat, a.coordinates.lng - first.coordinates.lng);
          const distB = Math.hypot(b.coordinates.lat - first.coordinates.lat, b.coordinates.lng - first.coordinates.lng);
          return distA - distB;
        });

        const reordered = [first, ...middle, last].map((s, idx) => ({ ...s, sequence: idx + 1 }));
        return {
          ...r,
          stops: reordered,
          totalDistanceKm: Math.round(r.totalDistanceKm * 0.88 * 10) / 10 // simulated 12% saving
        };
      })
    );
    addNotification('Route Optimized', 'Stops re-sequenced. Estimated distance reduced by 12%.', 'success');
  };

  const toggleRouteStopCompleted = (routeId: string, stopId: string) => {
    setRoutes(prev =>
      prev.map(r => {
        if (r.id !== routeId) return r;
        return {
          ...r,
          stops: r.stops.map(s => (s.id === stopId ? { ...s, completed: !s.completed } : s))
        };
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Live simulation: advance coordinates & statuses to show live active dispatch
  const advanceLiveSimulation = () => {
    // 1. Move drivers slightly along their routes
    setDrivers(prev =>
      prev.map(d => {
        if (d.status === 'On Delivery') {
          const deltaLat = (Math.random() - 0.5) * 0.005;
          const deltaLng = (Math.random() - 0.5) * 0.005;
          return {
            ...d,
            currentLocation: {
              ...d.currentLocation,
              lat: d.currentLocation.lat + deltaLat,
              lng: d.currentLocation.lng + deltaLng
            }
          };
        }
        return d;
      })
    );

    // 2. Advance active shipment
    setShipments(prev => {
      let updatedOne = false;
      return prev.map(s => {
        if (!updatedOne && s.status === 'Pickup Scheduled') {
          updatedOne = true;
          return {
            ...s,
            status: 'Picked Up',
            currentLocation: 'Picked up by Driver. En route to hub.',
            trackingHistory: [
              ...s.trackingHistory,
              {
                id: `th-${Date.now()}`,
                timestamp: new Date().toISOString(),
                status: 'Picked Up',
                location: s.senderAddress,
                description: 'Cargo verified and loaded.'
              }
            ]
          };
        }
        return s;
      });
    });

    addNotification('Live Simulation Ping', 'Fleet GPS beacons & shipment statuses updated.', 'info');
  };

  const resetDemoData = () => {
    localStorage.removeItem('logitrack_shipments');
    localStorage.removeItem('logitrack_drivers');
    localStorage.removeItem('logitrack_vehicles');
    localStorage.removeItem('logitrack_routes');
    localStorage.removeItem('logitrack_notifications');

    setShipments(initialShipments);
    setDrivers(initialDrivers);
    setVehicles(initialVehicles);
    setWarehouses(initialWarehouses);
    setRoutes(initialRoutes);
    setNotifications(initialNotifications);

    addNotification('Demo Data Reset', 'Default logistics operations restored.', 'info');
  };

  return (
    <LogisticsContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedShipmentId,
        setSelectedShipmentId,
        trackingLookupNumber,
        setTrackingLookupNumber,
        shipments,
        drivers,
        vehicles,
        warehouses,
        routes,
        notifications,
        isNewShipmentModalOpen,
        setIsNewShipmentModalOpen,
        isPodModalOpen,
        setIsPodModalOpen,
        podTargetShipment,
        setPodTargetShipment,
        createShipment,
        updateShipmentStatus,
        assignDriverAndVehicle,
        submitProofOfDelivery,
        createDriver,
        updateDriverStatus,
        createVehicle,
        updateVehicleStatus,
        addVehicleMaintenance,
        createRoute,
        optimizeRouteStops,
        toggleRouteStopCompleted,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        advanceLiveSimulation,
        resetDemoData
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
};
