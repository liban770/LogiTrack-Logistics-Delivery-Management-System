import { Driver, Vehicle, Warehouse, Shipment, Route, AppNotification } from '../types';

export const initialWarehouses: Warehouse[] = [
  {
    id: 'wh-1',
    name: 'Central Logistics Hub',
    code: 'HUB-CHI-01',
    city: 'Chicago, IL',
    address: '4200 Logistics Pkwy, Chicago, IL 60638',
    capacityPackages: 15000,
    currentPackagesCount: 8420,
    managerName: 'Robert Lang',
    contactPhone: '+1 (312) 555-0192',
    coordinates: { lat: 41.8781, lng: -87.6298 }
  },
  {
    id: 'wh-2',
    name: 'North Regional Depot',
    code: 'DEP-MIL-02',
    city: 'Milwaukee, WI',
    address: '880 Industrial Way, Milwaukee, WI 53202',
    capacityPackages: 8000,
    currentPackagesCount: 4210,
    managerName: 'Hannah Meyer',
    contactPhone: '+1 (414) 555-0144',
    coordinates: { lat: 43.0389, lng: -87.9065 }
  },
  {
    id: 'wh-3',
    name: 'East Gateway Distribution Center',
    code: 'DST-DET-03',
    city: 'Detroit, MI',
    address: '1500 Transport Blvd, Detroit, MI 48201',
    capacityPackages: 12000,
    currentPackagesCount: 7150,
    managerName: 'Antoine Bell',
    contactPhone: '+1 (313) 555-0188',
    coordinates: { lat: 42.3314, lng: -83.0458 }
  }
];

export const initialDrivers: Driver[] = [
  {
    id: 'drv-1',
    name: 'Ahmed Mohamed',
    email: 'ahmed.mohamed@logitrack.io',
    phone: '+1 (312) 555-7821',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    licenseNumber: 'IL-CDL-9844201',
    licenseExpiration: '2028-11-15',
    status: 'On Delivery',
    assignedVehicleId: 'veh-1',
    assignedVehicleName: 'Electric Sprinter (LT-EV-104)',
    currentLocation: { lat: 41.892, lng: -87.635, address: 'Near Michigan Ave, Chicago, IL' },
    totalDeliveries: 418,
    successfulDeliveries: 409,
    failedDeliveries: 9,
    onTimeRate: 98.2,
    averageDeliveryMinutes: 24,
    rating: 4.95,
    joinedDate: '2023-04-12'
  },
  {
    id: 'drv-2',
    name: 'Sofia Chen',
    email: 'sofia.chen@logitrack.io',
    phone: '+1 (312) 555-4390',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    licenseNumber: 'IL-CDL-8821903',
    licenseExpiration: '2027-08-20',
    status: 'Available',
    assignedVehicleId: 'veh-2',
    assignedVehicleName: 'Ford Transit Van (LT-VN-202)',
    currentLocation: { lat: 41.8781, lng: -87.6298, address: 'Central Logistics Hub' },
    totalDeliveries: 562,
    successfulDeliveries: 554,
    failedDeliveries: 8,
    onTimeRate: 98.8,
    averageDeliveryMinutes: 21,
    rating: 4.98,
    joinedDate: '2022-09-01'
  },
  {
    id: 'drv-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@logitrack.io',
    phone: '+1 (414) 555-8912',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    licenseNumber: 'WI-CDL-4410982',
    licenseExpiration: '2026-12-30',
    status: 'On Delivery',
    assignedVehicleId: 'veh-3',
    assignedVehicleName: 'Box Truck Freight (LT-BX-301)',
    currentLocation: { lat: 42.502, lng: -87.88, address: 'I-94 North Corridor, Kenosha' },
    totalDeliveries: 340,
    successfulDeliveries: 326,
    failedDeliveries: 14,
    onTimeRate: 95.8,
    averageDeliveryMinutes: 38,
    rating: 4.78,
    joinedDate: '2024-01-15'
  },
  {
    id: 'drv-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@logitrack.io',
    phone: '+1 (313) 555-6671',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    licenseNumber: 'MI-CDL-7719024',
    licenseExpiration: '2028-03-10',
    status: 'On Break',
    assignedVehicleId: 'veh-4',
    assignedVehicleName: 'Mercedes Heavy Actros (LT-TR-505)',
    currentLocation: { lat: 42.3314, lng: -83.0458, address: 'East Gateway Distribution Center' },
    totalDeliveries: 712,
    successfulDeliveries: 701,
    failedDeliveries: 11,
    onTimeRate: 98.5,
    averageDeliveryMinutes: 45,
    rating: 4.91,
    joinedDate: '2021-11-20'
  },
  {
    id: 'drv-5',
    name: 'David Kiprono',
    email: 'david.kiprono@logitrack.io',
    phone: '+1 (312) 555-1277',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    licenseNumber: 'IL-CDL-3390145',
    licenseExpiration: '2027-05-18',
    status: 'Available',
    assignedVehicleId: 'veh-5',
    assignedVehicleName: 'Electric Sprinter (LT-EV-106)',
    currentLocation: { lat: 41.8781, lng: -87.6298, address: 'Central Logistics Hub' },
    totalDeliveries: 289,
    successfulDeliveries: 284,
    failedDeliveries: 5,
    onTimeRate: 98.3,
    averageDeliveryMinutes: 26,
    rating: 4.89,
    joinedDate: '2024-03-10'
  }
];

export const initialVehicles: Vehicle[] = [
  {
    id: 'veh-1',
    registrationNumber: 'LT-EV-104',
    type: 'Electric Sprinter',
    model: 'Mercedes-Benz eSprinter Cargo 2025',
    year: 2025,
    assignedDriverId: 'drv-1',
    assignedDriverName: 'Ahmed Mohamed',
    capacityKg: 1600,
    capacityM3: 14.0,
    currentMileageKm: 18450,
    fuelBatteryPercent: 78,
    status: 'In Use',
    insuranceExpiration: '2027-06-30',
    lastServiceDate: '2026-08-15',
    coordinates: { lat: 41.892, lng: -87.635 },
    maintenanceRecords: [
      {
        id: 'mr-1',
        date: '2026-08-15',
        type: 'Routine 15k Battery & Brake Inspection',
        cost: 380,
        nextServiceDate: '2027-02-15',
        notes: 'Battery health at 99.4%, front brake pads replaced.',
        technician: 'FleetTech North'
      }
    ]
  },
  {
    id: 'veh-2',
    registrationNumber: 'LT-VN-202',
    type: 'Van',
    model: 'Ford Transit High Roof EcoBoost',
    year: 2024,
    assignedDriverId: 'drv-2',
    assignedDriverName: 'Sofia Chen',
    capacityKg: 1950,
    capacityM3: 15.5,
    currentMileageKm: 34120,
    fuelBatteryPercent: 92,
    status: 'Available',
    insuranceExpiration: '2027-04-12',
    lastServiceDate: '2026-07-10',
    coordinates: { lat: 41.8781, lng: -87.6298 },
    maintenanceRecords: [
      {
        id: 'mr-2',
        date: '2026-07-10',
        type: 'Oil Change & Tire Rotation',
        cost: 240,
        nextServiceDate: '2026-11-10',
        notes: 'Replaced oil filter, tires in good condition.',
        technician: 'Metro Fleet Care'
      }
    ]
  },
  {
    id: 'veh-3',
    registrationNumber: 'LT-BX-301',
    type: 'Box Truck',
    model: 'Freightliner M2 106 24ft Liftgate',
    year: 2023,
    assignedDriverId: 'drv-3',
    assignedDriverName: 'Marcus Vance',
    capacityKg: 5800,
    capacityM3: 36.0,
    currentMileageKm: 62400,
    fuelBatteryPercent: 64,
    status: 'In Use',
    insuranceExpiration: '2027-01-20',
    lastServiceDate: '2026-06-02',
    coordinates: { lat: 42.502, lng: -87.88 },
    maintenanceRecords: [
      {
        id: 'mr-3',
        date: '2026-06-02',
        type: 'Hydraulic Liftgate Overhaul',
        cost: 1150,
        nextServiceDate: '2026-12-02',
        notes: 'Hydraulic cylinder resealed, fresh fluid.',
        technician: 'Apex Hydraulics'
      }
    ]
  },
  {
    id: 'veh-4',
    registrationNumber: 'LT-TR-505',
    type: 'Heavy Truck',
    model: 'Mercedes-Benz Actros 2545',
    year: 2024,
    assignedDriverId: 'drv-4',
    assignedDriverName: 'Elena Rostova',
    capacityKg: 18000,
    capacityM3: 85.0,
    currentMileageKm: 98200,
    fuelBatteryPercent: 85,
    status: 'In Use',
    insuranceExpiration: '2027-09-14',
    lastServiceDate: '2026-05-18',
    coordinates: { lat: 42.3314, lng: -83.0458 },
    maintenanceRecords: []
  },
  {
    id: 'veh-5',
    registrationNumber: 'LT-EV-106',
    type: 'Electric Sprinter',
    model: 'Rivian Commercial Delivery Van 700',
    year: 2025,
    assignedDriverId: 'drv-5',
    assignedDriverName: 'David Kiprono',
    capacityKg: 1400,
    capacityM3: 18.0,
    currentMileageKm: 12100,
    fuelBatteryPercent: 95,
    status: 'Available',
    insuranceExpiration: '2028-01-10',
    lastServiceDate: '2026-08-30',
    coordinates: { lat: 41.8781, lng: -87.6298 },
    maintenanceRecords: []
  },
  {
    id: 'veh-6',
    registrationNumber: 'LT-VN-209',
    type: 'Van',
    model: 'Ram ProMaster 2500',
    year: 2023,
    capacityKg: 1850,
    capacityM3: 13.0,
    currentMileageKm: 52100,
    fuelBatteryPercent: 40,
    status: 'Maintenance',
    insuranceExpiration: '2027-03-25',
    lastServiceDate: '2026-10-01',
    coordinates: { lat: 41.8781, lng: -87.6298 },
    maintenanceRecords: [
      {
        id: 'mr-6',
        date: '2026-10-01',
        type: 'Transmission Sensor Calibration',
        cost: 650,
        nextServiceDate: '2027-01-01',
        notes: 'Currently undergoing diagnostic in workshop.',
        technician: 'Fleet Care East'
      }
    ]
  }
];

export const initialShipments: Shipment[] = [
  {
    id: 'shp-101',
    trackingNumber: 'LT-2026-000184',
    customerId: 'cust-1',
    customerName: 'Apex Medical Supplies Inc.',
    customerEmail: 'logistics@apexmed.com',
    customerPhone: '+1 (312) 555-8120',
    senderName: 'Apex Distribution Warehouse',
    senderAddress: '4200 Logistics Pkwy, Dock 4',
    senderCity: 'Chicago, IL',
    senderPhone: '+1 (312) 555-8120',
    receiverName: 'St. Jude Regional Hospital',
    receiverAddress: '750 S Paulina St, Receiving Wing B',
    receiverCity: 'Chicago, IL',
    receiverPhone: '+1 (312) 555-9000',
    items: [
      {
        id: 'item-1',
        description: 'Sterile Surgical Kits & Cryo Vials',
        quantity: 12,
        weightKg: 28.5,
        dimensionsCm: { length: 60, width: 40, height: 35 }
      }
    ],
    totalWeightKg: 28.5,
    shippingType: 'Express',
    priority: 'Critical',
    pickupDate: '2026-10-04T08:30:00Z',
    expectedDeliveryDate: '2026-10-04T16:00:00Z',
    status: 'Out for Delivery',
    currentLocation: '3.2 km from destination (W Harrison St)',
    currentCoordinates: { lat: 41.874, lng: -87.671 },
    assignedDriverId: 'drv-1',
    assignedDriverName: 'Ahmed Mohamed',
    assignedVehicleId: 'veh-1',
    assignedVehicleReg: 'LT-EV-104',
    warehouseId: 'wh-1',
    specialInstructions: 'Temperature sensitive: Keep between 2°C - 8°C. Signature required.',
    isFragile: true,
    isHazardous: false,
    createdAt: '2026-10-04T07:15:00Z',
    estimatedArrival: '15:15 Today',
    trackingHistory: [
      {
        id: 'th-1',
        timestamp: '2026-10-04T07:15:00Z',
        status: 'Pending',
        location: 'Chicago, IL',
        description: 'Shipment order generated via API.'
      },
      {
        id: 'th-2',
        timestamp: '2026-10-04T08:30:00Z',
        status: 'Picked Up',
        location: 'Apex Distribution Warehouse',
        description: 'Cargo verified and collected by driver Ahmed Mohamed.',
        actor: 'Ahmed Mohamed'
      },
      {
        id: 'th-3',
        timestamp: '2026-10-04T09:45:00Z',
        status: 'In Transit',
        location: 'Central Logistics Hub',
        description: 'Processed at Hub and loaded onto eSprinter LT-EV-104.'
      },
      {
        id: 'th-4',
        timestamp: '2026-10-04T13:40:00Z',
        status: 'Out for Delivery',
        location: 'Chicago Metro West',
        description: 'Vehicle is currently en route for final delivery.'
      }
    ]
  },
  {
    id: 'shp-102',
    trackingNumber: 'LT-2026-000185',
    customerId: 'cust-2',
    customerName: 'Nordic Electronics Corp',
    customerEmail: 'orders@nordicelec.com',
    customerPhone: '+1 (414) 555-3211',
    senderName: 'Nordic Import Terminal',
    senderAddress: '1500 Transport Blvd',
    senderCity: 'Detroit, MI',
    senderPhone: '+1 (313) 555-3211',
    receiverName: 'TechDepot Milwaukee Central',
    receiverAddress: '1240 N Water St',
    receiverCity: 'Milwaukee, WI',
    receiverPhone: '+1 (414) 555-8765',
    items: [
      {
        id: 'item-2',
        description: 'Precision Server Rack Units 2U',
        quantity: 4,
        weightKg: 85.0,
        dimensionsCm: { length: 90, width: 60, height: 45 }
      }
    ],
    totalWeightKg: 85.0,
    shippingType: 'Freight',
    priority: 'Urgent',
    pickupDate: '2026-10-03T14:00:00Z',
    expectedDeliveryDate: '2026-10-04T18:00:00Z',
    status: 'In Transit',
    currentLocation: 'Interstate 94 North Mile 312',
    currentCoordinates: { lat: 42.502, lng: -87.88 },
    assignedDriverId: 'drv-3',
    assignedDriverName: 'Marcus Vance',
    assignedVehicleId: 'veh-3',
    assignedVehicleReg: 'LT-BX-301',
    warehouseId: 'wh-2',
    specialInstructions: 'Forklift required upon unloading. Inspect tamper seals.',
    isFragile: true,
    createdAt: '2026-10-03T11:00:00Z',
    estimatedArrival: '17:30 Today',
    trackingHistory: [
      {
        id: 'th-201',
        timestamp: '2026-10-03T11:00:00Z',
        status: 'Pending',
        location: 'Detroit, MI',
        description: 'Shipment created.'
      },
      {
        id: 'th-202',
        timestamp: '2026-10-03T14:30:00Z',
        status: 'Picked Up',
        location: 'Detroit Terminal',
        description: 'Loaded into freight line.'
      },
      {
        id: 'th-203',
        timestamp: '2026-10-04T06:00:00Z',
        status: 'In Transit',
        location: 'I-94 Corridor',
        description: 'In interstate transit towards Milwaukee Depot.'
      }
    ]
  },
  {
    id: 'shp-103',
    trackingNumber: 'LT-2026-000180',
    customerId: 'cust-3',
    customerName: 'BioHealth Pharma Solutions',
    customerEmail: 'shipping@biohealth.org',
    customerPhone: '+1 (312) 555-9988',
    senderName: 'BioHealth Labs',
    senderAddress: '880 Industrial Way',
    senderCity: 'Milwaukee, WI',
    senderPhone: '+1 (414) 555-9988',
    receiverName: 'Northwestern Diagnostic Center',
    receiverAddress: '251 E Huron St, Room 410',
    receiverCity: 'Chicago, IL',
    receiverPhone: '+1 (312) 555-3000',
    items: [
      {
        id: 'item-3',
        description: 'Diagnostic Assay Reagents',
        quantity: 6,
        weightKg: 14.2,
        dimensionsCm: { length: 40, width: 30, height: 25 }
      }
    ],
    totalWeightKg: 14.2,
    shippingType: 'Same Day',
    priority: 'Critical',
    pickupDate: '2026-10-03T09:00:00Z',
    expectedDeliveryDate: '2026-10-03T15:00:00Z',
    actualDeliveryDate: '2026-10-03T14:32:00Z',
    status: 'Delivered',
    currentLocation: 'Delivered to Recipient',
    currentCoordinates: { lat: 41.8954, lng: -87.6186 },
    assignedDriverId: 'drv-1',
    assignedDriverName: 'Ahmed Mohamed',
    assignedVehicleId: 'veh-1',
    assignedVehicleReg: 'LT-EV-104',
    warehouseId: 'wh-1',
    createdAt: '2026-10-03T08:00:00Z',
    proofOfDelivery: {
      id: 'pod-103',
      shipmentId: 'shp-103',
      deliveredAt: '2026-10-03T14:32:00Z',
      recipientName: 'Dr. Karen Miller (Head of Diagnostics)',
      signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="80"><path d="M15 50 Q 40 10, 75 45 T 140 30 T 200 55" fill="none" stroke="%232563EB" stroke-width="3"/></svg>',
      photoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
      gpsCoordinates: { lat: 41.8954, lng: -87.6186 },
      driverNotes: 'Delivered to direct staff. Cryo box seals verified unbroken.',
      verifiedByDriverId: 'drv-1',
      driverName: 'Ahmed Mohamed'
    },
    trackingHistory: [
      {
        id: 'th-301',
        timestamp: '2026-10-03T08:00:00Z',
        status: 'Pending',
        location: 'Milwaukee, WI',
        description: 'Shipment created.'
      },
      {
        id: 'th-302',
        timestamp: '2026-10-03T09:15:00Z',
        status: 'Picked Up',
        location: 'BioHealth Labs',
        description: 'Package picked up by driver.'
      },
      {
        id: 'th-303',
        timestamp: '2026-10-03T11:45:00Z',
        status: 'In Transit',
        location: 'Chicago Distribution Entry',
        description: 'In transit to central hospital district.'
      },
      {
        id: 'th-304',
        timestamp: '2026-10-03T13:20:00Z',
        status: 'Out for Delivery',
        location: 'Chicago, IL',
        description: 'Driver Ahmed Mohamed approaching delivery address.'
      },
      {
        id: 'th-305',
        timestamp: '2026-10-03T14:32:00Z',
        status: 'Delivered',
        location: 'Northwestern Diagnostic Center',
        description: 'Delivered. Recipient signature and photo POD secured.',
        actor: 'Ahmed Mohamed'
      }
    ]
  },
  {
    id: 'shp-104',
    trackingNumber: 'LT-2026-000188',
    customerId: 'cust-4',
    customerName: 'Vertex Global Industrial',
    customerEmail: 'parts@vertexglobal.com',
    customerPhone: '+1 (313) 555-7140',
    senderName: 'Vertex Manufacturing Plant 3',
    senderAddress: '450 Industrial Rd',
    senderCity: 'Detroit, MI',
    senderPhone: '+1 (313) 555-7140',
    receiverName: 'Alliance Auto Assembly',
    receiverAddress: '1000 Assembly Way, Gate 7',
    receiverCity: 'Flint, MI',
    receiverPhone: '+1 (810) 555-4001',
    items: [
      {
        id: 'item-4',
        description: 'Machined Aluminum Gearbox Housings',
        quantity: 30,
        weightKg: 240.0,
        dimensionsCm: { length: 120, width: 80, height: 90 }
      }
    ],
    totalWeightKg: 240.0,
    shippingType: 'Freight',
    priority: 'Urgent',
    pickupDate: '2026-10-04T06:00:00Z',
    expectedDeliveryDate: '2026-10-04T12:00:00Z',
    status: 'Delayed',
    currentLocation: 'Flint Southbound Toll Plaza (Severe Traffic Collision)',
    currentCoordinates: { lat: 42.98, lng: -83.68 },
    assignedDriverId: 'drv-4',
    assignedDriverName: 'Elena Rostova',
    assignedVehicleId: 'veh-4',
    assignedVehicleReg: 'LT-TR-505',
    warehouseId: 'wh-3',
    specialInstructions: 'Critical assembly line component. Call receiver on arrival.',
    createdAt: '2026-10-03T18:00:00Z',
    estimatedArrival: '16:45 Today (Delayed +4h 45m)',
    trackingHistory: [
      {
        id: 'th-401',
        timestamp: '2026-10-03T18:00:00Z',
        status: 'Pending',
        location: 'Detroit, MI',
        description: 'Shipment created.'
      },
      {
        id: 'th-402',
        timestamp: '2026-10-04T06:10:00Z',
        status: 'Picked Up',
        location: 'Detroit Plant',
        description: 'Freight loaded.'
      },
      {
        id: 'th-403',
        timestamp: '2026-10-04T07:30:00Z',
        status: 'In Transit',
        location: 'I-75 North',
        description: 'Moving along corridor.'
      },
      {
        id: 'th-404',
        timestamp: '2026-10-04T10:15:00Z',
        status: 'Delayed',
        location: 'I-75 Mile 118',
        description: 'Traffic halted due to multi-vehicle incident. Dispatch notified.',
        actor: 'Elena Rostova'
      }
    ]
  },
  {
    id: 'shp-105',
    trackingNumber: 'LT-2026-000192',
    customerId: 'cust-5',
    customerName: 'Optima Retail Apparel',
    customerEmail: 'distribution@optimaretail.com',
    customerPhone: '+1 (312) 555-2234',
    senderName: 'Optima Central Warehouse',
    senderAddress: '4200 Logistics Pkwy',
    senderCity: 'Chicago, IL',
    senderPhone: '+1 (312) 555-2234',
    receiverName: 'Optima Flagship Store',
    receiverAddress: '600 N Michigan Ave',
    receiverCity: 'Chicago, IL',
    receiverPhone: '+1 (312) 555-7766',
    items: [
      {
        id: 'item-5',
        description: 'Autumn Collection Garments & Accessories',
        quantity: 18,
        weightKg: 62.0,
        dimensionsCm: { length: 80, width: 60, height: 50 }
      }
    ],
    totalWeightKg: 62.0,
    shippingType: 'Standard',
    priority: 'Normal',
    pickupDate: '2026-10-04T14:00:00Z',
    expectedDeliveryDate: '2026-10-05T11:00:00Z',
    status: 'Pickup Scheduled',
    currentLocation: 'Awaiting Driver Pickup at Central Hub',
    currentCoordinates: { lat: 41.8781, lng: -87.6298 },
    assignedDriverId: 'drv-2',
    assignedDriverName: 'Sofia Chen',
    assignedVehicleId: 'veh-2',
    assignedVehicleReg: 'LT-VN-202',
    warehouseId: 'wh-1',
    createdAt: '2026-10-04T09:20:00Z',
    estimatedArrival: 'Tomorrow 11:00',
    trackingHistory: [
      {
        id: 'th-501',
        timestamp: '2026-10-04T09:20:00Z',
        status: 'Pending',
        location: 'Chicago, IL',
        description: 'Shipment created.'
      },
      {
        id: 'th-502',
        timestamp: '2026-10-04T10:00:00Z',
        status: 'Pickup Scheduled',
        location: 'Central Logistics Hub',
        description: 'Assigned to driver Sofia Chen for afternoon pickup run.'
      }
    ]
  },
  {
    id: 'shp-106',
    trackingNumber: 'LT-2026-000195',
    customerId: 'cust-6',
    customerName: 'PrimeTech Home Electronics',
    customerEmail: 'support@primetech.io',
    customerPhone: '+1 (312) 555-6601',
    senderName: 'Central Logistics Depot',
    senderAddress: '4200 Logistics Pkwy',
    senderCity: 'Chicago, IL',
    senderPhone: '+1 (312) 555-6601',
    receiverName: 'Lisa Henderson',
    receiverAddress: '1428 Elmwood Ave',
    receiverCity: 'Evanston, IL',
    receiverPhone: '+1 (847) 555-1982',
    items: [
      {
        id: 'item-6',
        description: 'OLED 65" Cinema Display',
        quantity: 1,
        weightKg: 29.0,
        dimensionsCm: { length: 155, width: 25, height: 95 }
      }
    ],
    totalWeightKg: 29.0,
    shippingType: 'Express',
    priority: 'Normal',
    pickupDate: '2026-10-04T11:00:00Z',
    expectedDeliveryDate: '2026-10-04T17:30:00Z',
    status: 'Pending',
    currentLocation: 'Depot Staging Area B',
    currentCoordinates: { lat: 41.8781, lng: -87.6298 },
    warehouseId: 'wh-1',
    isFragile: true,
    createdAt: '2026-10-04T11:15:00Z',
    trackingHistory: [
      {
        id: 'th-601',
        timestamp: '2026-10-04T11:15:00Z',
        status: 'Pending',
        location: 'Chicago, IL',
        description: 'Shipment booked. Awaiting driver assignment.'
      }
    ]
  }
];

export const initialRoutes: Route[] = [
  {
    id: 'rt-1',
    name: 'Loop & Medical District Express',
    assignedDriverId: 'drv-1',
    assignedDriverName: 'Ahmed Mohamed',
    assignedVehicleId: 'veh-1',
    assignedVehicleReg: 'LT-EV-104',
    startLocation: 'Central Logistics Hub (Chicago)',
    endLocation: 'Central Logistics Hub (Chicago)',
    totalDistanceKm: 42.5,
    estimatedDurationMinutes: 185,
    status: 'In Progress',
    date: '2026-10-04',
    stops: [
      {
        id: 'stp-1',
        sequence: 1,
        type: 'depot',
        name: 'Central Logistics Hub',
        address: '4200 Logistics Pkwy, Chicago',
        coordinates: { lat: 41.8781, lng: -87.6298 },
        estimatedArrival: '08:00 AM',
        actualArrival: '08:00 AM',
        completed: true,
        notes: 'Loaded 8 parcels'
      },
      {
        id: 'stp-2',
        sequence: 2,
        type: 'delivery',
        name: 'Rush University Health Store',
        address: '1653 W Congress Pkwy, Chicago',
        coordinates: { lat: 41.8748, lng: -87.6685 },
        shipmentId: 'shp-100',
        trackingNumber: 'LT-2026-000179',
        estimatedArrival: '10:30 AM',
        actualArrival: '10:28 AM',
        completed: true,
        notes: 'Delivered to reception'
      },
      {
        id: 'stp-3',
        sequence: 3,
        type: 'delivery',
        name: 'St. Jude Regional Hospital',
        address: '750 S Paulina St, Receiving Wing B',
        coordinates: { lat: 41.874, lng: -87.671 },
        shipmentId: 'shp-101',
        trackingNumber: 'LT-2026-000184',
        estimatedArrival: '03:15 PM',
        completed: false,
        notes: 'Requires signature & photo POD'
      },
      {
        id: 'stp-4',
        sequence: 4,
        type: 'depot',
        name: 'Central Logistics Hub (Return)',
        address: '4200 Logistics Pkwy, Chicago',
        coordinates: { lat: 41.8781, lng: -87.6298 },
        estimatedArrival: '05:00 PM',
        completed: false
      }
    ]
  },
  {
    id: 'rt-2',
    name: 'Interstate Freight Corridor: Detroit to Milwaukee',
    assignedDriverId: 'drv-3',
    assignedDriverName: 'Marcus Vance',
    assignedVehicleId: 'veh-3',
    assignedVehicleReg: 'LT-BX-301',
    startLocation: 'Detroit Gateway Hub',
    endLocation: 'Milwaukee Regional Depot',
    totalDistanceKm: 610.0,
    estimatedDurationMinutes: 420,
    status: 'In Progress',
    date: '2026-10-04',
    stops: [
      {
        id: 'stp-201',
        sequence: 1,
        type: 'depot',
        name: 'East Gateway Distribution Center',
        address: '1500 Transport Blvd, Detroit, MI',
        coordinates: { lat: 42.3314, lng: -83.0458 },
        estimatedArrival: '06:00 AM',
        actualArrival: '06:15 AM',
        completed: true
      },
      {
        id: 'stp-202',
        sequence: 2,
        type: 'delivery',
        name: 'TechDepot Milwaukee Central',
        address: '1240 N Water St, Milwaukee, WI',
        coordinates: { lat: 43.0389, lng: -87.9065 },
        shipmentId: 'shp-102',
        trackingNumber: 'LT-2026-000185',
        estimatedArrival: '05:30 PM',
        completed: false
      }
    ]
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Delay Alert: Traffic Bottleneck',
    message: 'Shipment LT-2026-000188 delayed on I-75 near Flint. Expected delay +4h 45m.',
    timestamp: '10 mins ago',
    type: 'warning',
    read: false,
    linkShipmentId: 'shp-104'
  },
  {
    id: 'notif-2',
    title: 'Out for Delivery',
    message: 'Ahmed Mohamed started final delivery run for Critical Medical Shipment LT-2026-000184.',
    timestamp: '45 mins ago',
    type: 'info',
    read: false,
    linkShipmentId: 'shp-101'
  },
  {
    id: 'notif-3',
    title: 'Proof of Delivery Confirmed',
    message: 'Shipment LT-2026-000180 delivered to Dr. Karen Miller. Signature & photo recorded.',
    timestamp: 'Yesterday at 14:32',
    type: 'success',
    read: true,
    linkShipmentId: 'shp-103'
  },
  {
    id: 'notif-4',
    title: 'Fleet Maintenance Alert',
    message: 'Vehicle LT-VN-209 is scheduled for transmission sensor diagnostics.',
    timestamp: 'Yesterday at 09:00',
    type: 'warning',
    read: true
  }
];
