import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Shipment, Driver } from '../../types';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Truck,
  MapPin,
  Clock,
  User,
  ShieldAlert,
  ChevronRight,
  Navigation
} from 'lucide-react';

export const LiveFleetMapView: React.FC = () => {
  const {
    shipments,
    drivers,
    warehouses,
    setSelectedShipmentId,
    setActiveTab,
    setTrackingLookupNumber,
    setIsPodModalOpen,
    setPodTargetShipment
  } = useLogistics();

  const [zoom, setZoom] = useState(1);
  const [filterType, setFilterType] = useState<'all' | 'active' | 'drivers' | 'delivered' | 'delayed'>('all');
  const [selectedEntity, setSelectedEntity] = useState<
    | { type: 'shipment'; data: Shipment }
    | { type: 'driver'; data: Driver }
    | null
  >({ type: 'shipment', data: shipments[0] });

  // Map coordinate conversion helper (centered around Midwest US: Chicago/Detroit/Milwaukee)
  // Lat: 41.5 to 43.5 (height ~2 deg), Lng: -88.5 to -82.5 (width ~6 deg)
  const mapWidth = 900;
  const mapHeight = 520;

  const latToY = (lat: number) => {
    const minLat = 41.3;
    const maxLat = 43.5;
    const ratio = (lat - minLat) / (maxLat - minLat);
    return mapHeight - ratio * mapHeight;
  };

  const lngToX = (lng: number) => {
    const minLng = -88.5;
    const maxLng = -82.8;
    const ratio = (lng - minLng) / (maxLng - minLng);
    return ratio * mapWidth;
  };

  const activeShipments = shipments.filter(s => s.status === 'In Transit' || s.status === 'Out for Delivery');
  const delayedShipments = shipments.filter(s => s.status === 'Delayed');
  const deliveredShipments = shipments.filter(s => s.status === 'Delivered');

  return (
    <div className="space-y-4">
      {/* Top Controls & Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-orange-500" />
            Live Fleet & Delivery Operations Map
          </h2>
          <p className="text-xs text-slate-500">Real-time GPS telemetry, active routes, and shipment statuses</p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Markers
          </button>
          <button
            onClick={() => setFilterType('active')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
              filterType === 'active'
                ? 'bg-orange-100 text-orange-800 ring-1 ring-orange-500 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Active Deliveries ({activeShipments.length})
          </button>
          <button
            onClick={() => setFilterType('drivers')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
              filterType === 'drivers'
                ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-500 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Drivers ({drivers.length})
          </button>
          <button
            onClick={() => setFilterType('delayed')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
              filterType === 'delayed'
                ? 'bg-red-100 text-red-800 ring-1 ring-red-500 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Delayed ({delayedShipments.length})
          </button>
          <button
            onClick={() => setFilterType('delivered')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
              filterType === 'delivered'
                ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-500 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Delivered ({deliveredShipments.length})
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Interactive Map Surface */}
        <div className="lg:col-span-2 relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md min-h-[480px]">
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-800/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg">
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.25, 2.0))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.75))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 space-y-1 shadow-lg">
            <div className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider mb-1">
              Marker Index
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <span>🟠 Active Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>🔵 Driver on Duty</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>🟢 Completed / Delivered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span>🔴 Delayed Shipment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-400" />
              <span>🏢 Logistics Warehouse / Hub</span>
            </div>
          </div>

          {/* SVG Canvas with Zoom transform */}
          <div className="w-full h-full overflow-hidden flex items-center justify-center p-2">
            <div
              style={{
                transform: `scale(${zoom})`,
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="w-full h-[500px] flex items-center justify-center relative select-none"
            >
              <svg
                viewBox={`0 0 ${mapWidth} ${mapHeight}`}
                className="w-full h-full max-h-[500px]"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background grid representing GIS tiles */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                  </pattern>
                  {/* Glowing orange filter */}
                  <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <rect width={mapWidth} height={mapHeight} fill="#0f172a" />
                <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />

                {/* Lake Michigan Water Body Silhouette Simulation */}
                <path
                  d="M 280 40 C 290 120, 260 220, 240 320 C 230 380, 210 440, 200 500 L 320 500 C 350 440, 360 300, 340 180 C 330 100, 310 40, 300 40 Z"
                  fill="#0c4a6e"
                  opacity="0.35"
                />
                <text x="250" y="240" fill="#38bdf8" opacity="0.3" fontSize="13" fontStyle="italic">
                  Lake Michigan
                </text>

                {/* Major Highways Interstate Arteries */}
                {/* I-94 Corridor (Detroit -> Chicago -> Milwaukee) */}
                <path
                  d="M 820 400 Q 550 460, 200 440 T 160 140"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="3.5"
                  strokeDasharray="6 3"
                />
                {/* I-90 West Corridor */}
                <path
                  d="M 200 440 L 40 430"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2.5"
                />

                {/* Active Route 1: Express Run Path */}
                <path
                  d="M 200 440 Q 185 410, 170 380 T 180 340"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeDasharray="5 3"
                  opacity="0.8"
                />
                {/* Active Route 2: Freight Run Path */}
                <path
                  d="M 800 395 C 650 370, 420 330, 160 140"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  opacity="0.7"
                />

                {/* Warehouses / Hubs */}
                {warehouses.map(w => {
                  const x = lngToX(w.coordinates.lng);
                  const y = latToY(w.coordinates.lat);
                  return (
                    <g key={w.id} className="cursor-pointer">
                      <rect
                        x={x - 12}
                        y={y - 12}
                        width="24"
                        height="24"
                        rx="5"
                        fill="#1e293b"
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                      <text x={x} y={y + 4} textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">
                        🏢
                      </text>
                      <text
                        x={x}
                        y={y + 24}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="10"
                        fontWeight="600"
                        className="font-mono"
                      >
                        {w.code}
                      </text>
                    </g>
                  );
                })}

                {/* Driver Markers */}
                {(filterType === 'all' || filterType === 'drivers') &&
                  drivers.map(d => {
                    const x = lngToX(d.currentLocation.lng);
                    const y = latToY(d.currentLocation.lat);
                    const isSelected = selectedEntity?.type === 'driver' && selectedEntity.data.id === d.id;

                    return (
                      <g
                        key={d.id}
                        onClick={() => setSelectedEntity({ type: 'driver', data: d })}
                        className="cursor-pointer group"
                      >
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? "16" : "12"}
                          fill="#2563eb"
                          stroke="#ffffff"
                          strokeWidth="2"
                          opacity="0.9"
                        />
                        <text
                          x={x}
                          y={y + 3.5}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          🚗
                        </text>
                        <text
                          x={x}
                          y={y - 14}
                          textAnchor="middle"
                          fill="#93c5fd"
                          fontSize="9"
                          fontWeight="600"
                        >
                          {d.name.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}

                {/* Shipments Markers */}
                {shipments.map(s => {
                  const isDelivered = s.status === 'Delivered';
                  const isDelayed = s.status === 'Delayed';
                  const isActive = s.status === 'In Transit' || s.status === 'Out for Delivery';

                  // Apply filter
                  if (filterType === 'active' && !isActive) return null;
                  if (filterType === 'delayed' && !isDelayed) return null;
                  if (filterType === 'delivered' && !isDelivered) return null;
                  if (filterType === 'drivers') return null;

                  const x = lngToX(s.currentCoordinates.lng);
                  const y = latToY(s.currentCoordinates.lat);
                  const isSelected = selectedEntity?.type === 'shipment' && selectedEntity.data.id === s.id;

                  const color = isDelayed
                    ? '#dc2626'
                    : isDelivered
                    ? '#16a34a'
                    : '#f97316';

                  return (
                    <g
                      key={s.id}
                      onClick={() => setSelectedEntity({ type: 'shipment', data: s })}
                      className="cursor-pointer group"
                    >
                      {/* Pulse ring for active or delayed shipments */}
                      {(isActive || isDelayed) && (
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? "22" : "16"}
                          fill="none"
                          stroke={color}
                          strokeWidth="1.5"
                          opacity="0.5"
                        >
                          <animate
                            attributeName="r"
                            values={isSelected ? "18;26;18" : "12;20;12"}
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.8;0.1;0.8"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? "11" : "8"}
                        fill={color}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />

                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        fill="#e2e8f0"
                        fontSize="9"
                        fontWeight="600"
                        className="font-mono pointer-events-none drop-shadow-sm"
                      >
                        {s.trackingNumber.slice(-4)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Selected Inspector Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs">
          {selectedEntity ? (
            selectedEntity.type === 'shipment' ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Tracking Inspector
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-mono">
                      {selectedEntity.data.trackingNumber}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      selectedEntity.data.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedEntity.data.status === 'Delayed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {selectedEntity.data.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-100">
                  <div className="font-semibold text-slate-800">
                    {selectedEntity.data.customerName}
                  </div>
                  <div className="text-slate-600 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{selectedEntity.data.receiverAddress}, {selectedEntity.data.receiverCity}</span>
                  </div>
                  <div className="text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>ETA: {selectedEntity.data.estimatedArrival || 'Scheduled'}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Assigned Driver</span>
                    <span className="font-semibold text-slate-800">
                      {selectedEntity.data.assignedDriverName || 'Not Assigned'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Assigned Vehicle</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {selectedEntity.data.assignedVehicleReg || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Weight & Category</span>
                    <span className="font-semibold text-slate-800">
                      {selectedEntity.data.totalWeightKg} kg ({selectedEntity.data.shippingType})
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Current Zone</span>
                    <span className="font-semibold text-slate-800 text-right truncate max-w-[180px]">
                      {selectedEntity.data.currentLocation}
                    </span>
                  </div>
                </div>

                {selectedEntity.data.status === 'Delayed' && (
                  <div className="p-2.5 bg-red-50 rounded-xl border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Severe delay reported on route. Dispatch priority alert.</span>
                  </div>
                )}

                <div className="pt-3 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setTrackingLookupNumber(selectedEntity.data.trackingNumber);
                      setActiveTab('tracking');
                    }}
                    className="w-full py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    Open Complete Tracking Journey <ChevronRight className="w-4 h-4" />
                  </button>

                  {selectedEntity.data.status !== 'Delivered' && (
                    <button
                      onClick={() => {
                        setPodTargetShipment(selectedEntity.data);
                        setIsPodModalOpen(true);
                      }}
                      className="w-full py-2 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                    >
                      Confirm Delivery (Proof of Delivery)
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Driver Entity Details */
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={selectedEntity.data.avatar}
                      alt={selectedEntity.data.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{selectedEntity.data.name}</h3>
                      <p className="text-[11px] text-slate-500 font-mono">{selectedEntity.data.licenseNumber}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      selectedEntity.data.status === 'On Delivery'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedEntity.data.status === 'Available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {selectedEntity.data.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Current Beacon</span>
                    <span className="font-semibold text-slate-800">{selectedEntity.data.currentLocation.address}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Vehicle Assignment</span>
                    <span className="font-semibold text-slate-800">{selectedEntity.data.assignedVehicleName || 'None'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase">On-Time Score</div>
                    <div className="text-base font-bold text-slate-900 font-mono">{selectedEntity.data.onTimeRate}%</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase">Total Deliveries</div>
                    <div className="text-base font-bold text-slate-900 font-mono">{selectedEntity.data.totalDeliveries}</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setActiveTab('drivers');
                    }}
                    className="w-full py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    View Driver Profile & Performance
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <MapPin className="w-8 h-8 stroke-1 text-slate-300" />
              <p className="text-xs">Click any marker or driver pin on the map to inspect full telemetry</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
