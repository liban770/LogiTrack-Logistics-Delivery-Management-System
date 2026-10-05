import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Car,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Search,
  ExternalLink,
  ChevronRight,
  MapPin
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    shipments,
    drivers,
    vehicles,
    setActiveTab,
    setIsNewShipmentModalOpen,
    setSelectedShipmentId,
    setTrackingLookupNumber,
    setIsPodModalOpen,
    setPodTargetShipment
  } = useLogistics();

  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Compute live operational KPIs
  const totalShipments = 1284 + shipments.length - 6;
  const inTransitCount = shipments.filter(s => s.status === 'In Transit' || s.status === 'Out for Delivery').length;
  const inTransitDisplay = 342 + inTransitCount - 2;
  const deliveredCount = shipments.filter(s => s.status === 'Delivered').length;
  const deliveredDisplay = 816 + deliveredCount - 1;
  const pendingCount = shipments.filter(s => s.status === 'Pending' || s.status === 'Pickup Scheduled').length;
  const pendingDisplay = 76 + pendingCount - 2;
  const delayedCount = shipments.filter(s => s.status === 'Delayed').length;
  const delayedDisplay = 23 + delayedCount - 1;
  const activeDrivers = drivers.filter(d => d.status === 'On Delivery').length;
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;

  // Chart data for weekly/monthly performance
  const weekData = [
    { label: 'Mon', delivered: 142, inTransit: 48, delayed: 2 },
    { label: 'Tue', delivered: 168, inTransit: 55, delayed: 4 },
    { label: 'Wed', delivered: 185, inTransit: 62, delayed: 3 },
    { label: 'Thu', delivered: 194, inTransit: 58, delayed: 1 },
    { label: 'Fri', delivered: 210, inTransit: 74, delayed: 5 },
    { label: 'Sat', delivered: 120, inTransit: 38, delayed: 2 },
    { label: 'Sun', delivered: 95, inTransit: 25, delayed: 1 }
  ];

  const monthData = [
    { label: 'Week 1', delivered: 780, inTransit: 240, delayed: 18 },
    { label: 'Week 2', delivered: 840, inTransit: 265, delayed: 14 },
    { label: 'Week 3', delivered: 920, inTransit: 290, delayed: 21 },
    { label: 'Week 4', delivered: 1040, inTransit: 342, delayed: 23 }
  ];

  const currentChartData = chartPeriod === 'week' ? weekData : monthData;
  const maxVal = Math.max(...currentChartData.map(d => d.delivered + d.inTransit));

  // Quick Tracking input state
  const [quickTrackInput, setQuickTrackInput] = useState('');

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackInput.trim()) {
      setTrackingLookupNumber(quickTrackInput.trim());
      setActiveTab('tracking');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-orange-500/10 via-blue-500/5 to-white p-5 rounded-2xl border border-orange-200/60 shadow-xs">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-orange-600 uppercase font-mono">
            Command Center
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Logistics & Fleet Operations
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time delivery visibility across 3 fulfillment hubs and 4 active routes.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Track Input form */}
          <form onSubmit={handleQuickTrack} className="flex items-center relative">
            <input
              type="text"
              value={quickTrackInput}
              onChange={e => setQuickTrackInput(e.target.value)}
              placeholder="Track # (e.g. LT-2026-000184)"
              className="pl-3 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-52 font-mono"
            />
            <button
              type="submit"
              className="absolute right-2 text-slate-400 hover:text-orange-600"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <button
            onClick={() => setIsNewShipmentModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Shipment
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (8 Cards matching Section 4 spec) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
        {/* Total Shipments */}
        <div
          onClick={() => setActiveTab('shipments')}
          className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Shipments</span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalShipments.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12.4% vs last week</span>
          </div>
        </div>

        {/* In Transit */}
        <div
          onClick={() => setActiveTab('deliveries')}
          className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">In Transit</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {inTransitDisplay.toLocaleString()}
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            {activeDrivers} vehicles moving
          </div>
        </div>

        {/* Delivered */}
        <div
          onClick={() => setActiveTab('shipments')}
          className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Delivered</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {deliveredDisplay.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            98.4% on-time rate
          </div>
        </div>

        {/* Delayed */}
        <div
          onClick={() => setActiveTab('shipments')}
          className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-red-200 hover:border-red-300 bg-red-50/20 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-red-700">Delayed</span>
            <div className="p-2 rounded-xl bg-red-100 text-red-600 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-red-600 font-mono tabular-nums">
            {delayedDisplay}
          </div>
          <div className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
            <span>Action Required</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Pending Shipments */}
        <div
          onClick={() => setActiveTab('shipments')}
          className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pending Dispatch</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {pendingDisplay}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Awaiting driver assignment
          </div>
        </div>

        {/* Active Drivers */}
        <div
          onClick={() => setActiveTab('drivers')}
          className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Active Drivers</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {48 + activeDrivers - 2}
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">
            {drivers.filter(d => d.status === 'Available').length} available now
          </div>
        </div>

        {/* Available Fleet Vehicles */}
        <div
          onClick={() => setActiveTab('vehicles')}
          className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Fleet Available</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {availableVehicles} / {vehicles.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            1 vehicle in maintenance
          </div>
        </div>

        {/* Delivery Completion Rate */}
        <div className="p-4 bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-xs font-medium">SLA Compliance</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums">
            98.8%
          </div>
          <div className="text-[11px] text-slate-300 mt-1">
            Target SLA &ge; 98.0%
          </div>
        </div>
      </div>

      {/* Middle Grid: Operational Volume Chart & Live Fleet Quick Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Volume Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Shipment Throughput & Status Distribution</h2>
              <p className="text-xs text-slate-500">Delivered vs In-Transit operational volume</p>
            </div>

            {/* Time period switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setChartPeriod('week')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  chartPeriod === 'week' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setChartPeriod('month')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  chartPeriod === 'month' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                4 Weeks
              </button>
            </div>
          </div>

          {/* SVG Custom High-Fidelity Chart */}
          <div className="relative h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {currentChartData.map((d, i) => {
              const deliveredHeight = (d.delivered / maxVal) * 160;
              const inTransitHeight = (d.inTransit / maxVal) * 160;
              const isHovered = hoveredBarIndex === i;

              return (
                <div
                  key={d.label}
                  onMouseEnter={() => setHoveredBarIndex(i)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-10 px-2.5 py-1 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-20 pointer-events-none font-mono">
                      {d.label}: {d.delivered} delivered · {d.inTransit} in-transit
                    </div>
                  )}

                  {/* Stacked Bars */}
                  <div className="w-full max-w-[42px] flex flex-col justify-end gap-1 h-[170px] items-center">
                    {/* In Transit top portion */}
                    <div
                      style={{ height: `${inTransitHeight}px` }}
                      className={`w-full rounded-t-md bg-blue-500 transition-all ${
                        isHovered ? 'brightness-110' : 'opacity-90'
                      }`}
                    />
                    {/* Delivered bottom portion */}
                    <div
                      style={{ height: `${deliveredHeight}px` }}
                      className={`w-full rounded-b-md bg-orange-500 transition-all ${
                        isHovered ? 'brightness-110' : 'opacity-90'
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-900 transition-colors">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-orange-500" />
                <span>Delivered Parcels</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-blue-500" />
                <span>In-Transit Active</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Real-time Telemetry</span>
          </div>
        </div>

        {/* Live Delivery Map Quick Widget (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-500" />
                Active Fleet Pulse
              </h2>
              <p className="text-xs text-slate-500">Live GPS beacon positions</p>
            </div>
            <button
              onClick={() => setActiveTab('map')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              Full Map <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mini Interactive Map Preview */}
          <div
            onClick={() => setActiveTab('map')}
            className="relative h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer group"
          >
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Visual Markers on Mini-map */}
            <div className="absolute top-1/4 left-1/3 flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-orange-500 animate-ping absolute" />
              <span className="w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white relative z-10" />
              <span className="text-[9px] text-slate-200 font-mono mt-1 bg-slate-900/80 px-1 rounded">LT-184</span>
            </div>

            <div className="absolute top-1/2 right-1/4 flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white relative z-10" />
              <span className="text-[9px] text-red-200 font-mono mt-1 bg-red-950/80 px-1 rounded">DELAY</span>
            </div>

            <div className="absolute bottom-1/4 left-1/2 flex flex-col items-center">
              <span className="w-3 h-3 rounded-full bg-blue-600 border border-white relative z-10" />
              <span className="text-[9px] text-blue-200 font-mono mt-1 bg-slate-900/80 px-1 rounded">Ahmed M.</span>
            </div>

            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-xs text-[10px] text-white rounded font-mono group-hover:bg-orange-600 transition-colors">
              Click to Open Telemetry Map →
            </div>
          </div>

          {/* Quick Fleet Summary */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase">On Duty</span>
              <div className="font-bold text-slate-900">{drivers.length} Drivers Active</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase">Fulfillment Hubs</span>
              <div className="font-bold text-slate-900">3 Regional Warehouses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Operational Shipments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Active & Recent Deliveries</h2>
            <p className="text-xs text-slate-500">Live operational log and dispatch assignments</p>
          </div>
          <button
            onClick={() => setActiveTab('shipments')}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            View All Shipments ({shipments.length}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tracking Number</th>
                <th className="py-3 px-4">Customer & Cargo</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Driver / Vehicle</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">ETA</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {shipments.slice(0, 5).map(s => {
                const isDelayed = s.status === 'Delayed';
                const isDelivered = s.status === 'Delivered';
                const isOutForDelivery = s.status === 'Out for Delivery';

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Tracking ID */}
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      <button
                        onClick={() => {
                          setTrackingLookupNumber(s.trackingNumber);
                          setActiveTab('tracking');
                        }}
                        className="hover:text-orange-600 text-blue-700 flex items-center gap-1"
                      >
                        {s.trackingNumber}
                      </button>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 truncate max-w-[180px]">{s.customerName}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {s.items[0]?.description} · {s.totalWeightKg} kg
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 truncate max-w-[170px]">{s.receiverAddress}</div>
                      <div className="text-[11px] text-slate-400">{s.receiverCity}</div>
                    </td>

                    {/* Driver */}
                    <td className="py-3 px-4">
                      {s.assignedDriverName ? (
                        <div>
                          <div className="font-medium text-slate-900">{s.assignedDriverName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{s.assignedVehicleReg}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isDelivered
                            ? 'bg-emerald-50 text-emerald-700'
                            : isDelayed
                            ? 'bg-red-50 text-red-700 animate-pulse'
                            : isOutForDelivery
                            ? 'bg-orange-50 text-orange-700 font-bold'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    {/* ETA */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {s.estimatedArrival || 'Tomorrow'}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedShipmentId(s.id);
                            setActiveTab('shipments');
                          }}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Details
                        </button>
                        {!isDelivered && (
                          <button
                            onClick={() => {
                              setPodTargetShipment(s);
                              setIsPodModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                          >
                            POD
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
