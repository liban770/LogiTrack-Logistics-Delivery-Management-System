import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Shipment, ShipmentStatus, PriorityLevel } from '../../types';
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Truck,
  X,
  MapPin,
  User,
  Phone,
  Calendar,
  FileText,
  Printer,
  ChevronRight,
  ShieldCheck,
  Download,
  FileSpreadsheet
} from 'lucide-react';

export const ShipmentsView: React.FC = () => {
  const {
    shipments,
    drivers,
    vehicles,
    searchQuery,
    setSearchQuery,
    selectedShipmentId,
    setSelectedShipmentId,
    setIsNewShipmentModalOpen,
    setIsPodModalOpen,
    setPodTargetShipment,
    updateShipmentStatus,
    assignDriverAndVehicle,
    setTrackingLookupNumber,
    setActiveTab,
    addNotification
  } = useLogistics();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [selectedDriverToAssign, setSelectedDriverToAssign] = useState<string>('');
  const [selectedVehicleToAssign, setSelectedVehicleToAssign] = useState<string>('');

  // Selected shipment for detailed drawer
  const activeShipment = shipments.find(s => s.id === selectedShipmentId) || null;

  // Filtered shipments in real-time
  const filteredShipments = shipments.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.trackingNumber.toLowerCase().includes(q) ||
      s.customerName.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.receiverName.toLowerCase().includes(q) ||
      s.receiverAddress.toLowerCase().includes(q) ||
      (s.assignedDriverName && s.assignedDriverName.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'All' ||
      (priorityFilter === 'High' && (s.priority === 'High' || s.priority === 'Critical')) ||
      (priorityFilter === 'Medium' && (s.priority === 'Medium' || s.priority === 'Urgent')) ||
      (priorityFilter === 'Low' && (s.priority === 'Low' || s.priority === 'Normal')) ||
      s.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityDisplay = (priority: PriorityLevel | string) => {
    const p = priority?.toLowerCase();
    if (p === 'critical' || p === 'high') {
      return {
        label: 'High',
        original: priority,
        badgeClass: 'bg-red-50 text-red-700 border-red-200/90 font-bold',
        dotClass: 'bg-red-500 animate-pulse',
        indicatorText: 'High Priority'
      };
    }
    if (p === 'urgent' || p === 'medium') {
      return {
        label: 'Medium',
        original: priority,
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/90 font-semibold',
        dotClass: 'bg-amber-500',
        indicatorText: 'Medium Priority'
      };
    }
    return {
      label: 'Low',
      original: priority,
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
      dotClass: 'bg-slate-400',
      indicatorText: 'Low Priority'
    };
  };

  const allStatuses: ShipmentStatus[] = [
    'Pending',
    'Pickup Scheduled',
    'Picked Up',
    'In Transit',
    'Out for Delivery',
    'Delivered',
    'Delayed',
    'Failed Delivery',
    'Cancelled',
    'Returned'
  ];

  const getStatusCount = (st: string) => {
    if (st === 'All') return shipments.length;
    return shipments.filter(s => s.status === st).length;
  };

  const handleExportCSV = () => {
    if (filteredShipments.length === 0) {
      alert('No shipments to export matching the current filters.');
      return;
    }

    const headers = [
      'Shipment ID',
      'Tracking Number',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Sender Name',
      'Sender Address',
      'Sender City',
      'Sender Phone',
      'Receiver Name',
      'Receiver Address',
      'Receiver City',
      'Receiver Phone',
      'Status',
      'Priority',
      'Shipping Type',
      'Total Weight (kg)',
      'Total Items Count',
      'Items Summary',
      'Assigned Driver',
      'Assigned Vehicle',
      'Warehouse ID',
      'Created Date',
      'Expected Delivery Date',
      'Actual Delivery Date',
      'Current Location',
      'Proof of Delivery Verified',
      'POD Recipient Name',
      'POD Delivered At'
    ];

    const escapeCSV = (val: string | number | boolean | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredShipments.map(s => [
      escapeCSV(s.id),
      escapeCSV(s.trackingNumber),
      escapeCSV(s.customerName),
      escapeCSV(s.customerEmail),
      escapeCSV(s.customerPhone),
      escapeCSV(s.senderName),
      escapeCSV(s.senderAddress),
      escapeCSV(s.senderCity),
      escapeCSV(s.senderPhone),
      escapeCSV(s.receiverName),
      escapeCSV(s.receiverAddress),
      escapeCSV(s.receiverCity),
      escapeCSV(s.receiverPhone),
      escapeCSV(s.status),
      escapeCSV(s.priority),
      escapeCSV(s.shippingType),
      s.totalWeightKg,
      s.items.reduce((acc, it) => acc + (it.quantity || 1), 0),
      escapeCSV(s.items.map(it => `${it.quantity}x ${it.description} (${it.weightKg}kg)`).join('; ')),
      escapeCSV(s.assignedDriverName || 'Unassigned'),
      escapeCSV(s.assignedVehicleReg || 'Unassigned'),
      escapeCSV(s.warehouseId || ''),
      escapeCSV(s.createdAt ? new Date(s.createdAt).toISOString() : ''),
      escapeCSV(s.expectedDeliveryDate ? new Date(s.expectedDeliveryDate).toISOString() : ''),
      escapeCSV(s.actualDeliveryDate ? new Date(s.actualDeliveryDate).toISOString() : ''),
      escapeCSV(s.currentLocation),
      escapeCSV(s.proofOfDelivery ? 'YES' : 'NO'),
      escapeCSV(s.proofOfDelivery?.recipientName || ''),
      escapeCSV(s.proofOfDelivery?.deliveredAt || '')
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    const filterTag = statusFilter !== 'All' ? `_${statusFilter.toLowerCase().replace(/\s+/g, '_')}` : '';
    link.href = url;
    link.setAttribute('download', `logitrack_shipments${filterTag}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addNotification(
      'CSV Report Generated',
      `Exported ${filteredShipments.length} filtered shipment record(s) to CSV spreadsheet.`,
      'success'
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-500" />
            Shipment Management
          </h1>
          <p className="text-xs text-slate-500">
            {filteredShipments.length} of {shipments.length} shipments shown
            {searchQuery && (
              <span className="text-orange-600 font-medium ml-1">
                · Filtered by "{searchQuery}"
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleExportCSV}
            title={`Export ${filteredShipments.length} filtered shipment(s) to CSV`}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
              {filteredShipments.length}
            </span>
          </button>

          <button
            onClick={() => setIsNewShipmentModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Shipment
          </button>
        </div>
      </div>

      {/* Dedicated Real-Time Search & Filtering Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Real-time search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by tracking number (e.g. LT-2026-000184), customer name, or shipment ID (e.g. shp-101)..."
              className="w-full pl-10 pr-9 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-orange-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-900 placeholder:text-slate-400 font-mono transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter dropdowns */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Status filter dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <label htmlFor="status-filter-select" className="flex items-center gap-1 text-slate-500 whitespace-nowrap">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Status:</span>
              </label>
              <select
                id="status-filter-select"
                aria-label="Filter shipments by status"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className={`px-3 py-2 text-xs border rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${
                  statusFilter !== 'All'
                    ? 'bg-orange-50/70 border-orange-300 text-orange-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <option value="All">All Statuses ({getStatusCount('All')})</option>
                {allStatuses.map(st => (
                  <option key={st} value={st}>
                    {st} ({getStatusCount(st)})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority filter */}
            <select
              aria-label="Filter shipments by priority"
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="Low">⚪ Low Priority</option>
            </select>

            {(searchQuery || statusFilter !== 'All' || priorityFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setPriorityFilter('All');
                }}
                className="px-2.5 py-2 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors whitespace-nowrap"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Quick Status Chips Bar for 1-click status filtering */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
          <span className="text-[11px] font-medium text-slate-400 mr-1">Quick Status:</span>
          {[
            { id: 'All', label: 'All', count: getStatusCount('All') },
            { id: 'Pending', label: 'Pending', count: getStatusCount('Pending'), dot: 'bg-amber-400' },
            { id: 'In Transit', label: 'In Transit', count: getStatusCount('In Transit'), dot: 'bg-blue-500' },
            { id: 'Out for Delivery', label: 'Out for Delivery', count: getStatusCount('Out for Delivery'), dot: 'bg-orange-500' },
            { id: 'Delivered', label: 'Delivered', count: getStatusCount('Delivered'), dot: 'bg-emerald-500' },
            { id: 'Delayed', label: 'Delayed', count: getStatusCount('Delayed'), dot: 'bg-red-500' }
          ].map(tab => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white font-semibold shadow-2xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {tab.dot && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-white' : tab.dot
                    }`}
                  />
                )}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1 rounded-sm ${
                    isActive ? 'bg-orange-600 text-white' : 'bg-slate-200/60 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}

          {statusFilter !== 'All' && (
            <button
              type="button"
              onClick={() => setStatusFilter('All')}
              className="ml-auto text-[11px] text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-0.5"
            >
              Clear Status Filter <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Live Filter Info Row */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Search suggestions:</span>
            <button
              type="button"
              onClick={() => setSearchQuery('LT-2026-000184')}
              className="hover:text-orange-600 underline font-mono cursor-pointer"
            >
              LT-2026-000184
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setSearchQuery('Apex Medical')}
              className="hover:text-orange-600 underline cursor-pointer"
            >
              Apex Medical
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setSearchQuery('shp-101')}
              className="hover:text-orange-600 underline font-mono cursor-pointer"
            >
              shp-101
            </button>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-[11px]">
            <span>
              {filteredShipments.length} Result{filteredShipments.length !== 1 ? 's' : ''}
            </span>
            <span>·</span>
            <button
              type="button"
              onClick={handleExportCSV}
              className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 cursor-pointer hover:underline"
            >
              <Download className="w-3 h-3" /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Shipments Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tracking ID & Shipment ID</th>
                <th className="py-3 px-4">Customer & Items</th>
                <th className="py-3 px-4">Route (Origin → Destination)</th>
                <th className="py-3 px-4">Priority & Type</th>
                <th className="py-3 px-4">Driver & Vehicle</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="font-semibold text-slate-600">No shipments found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      No parcels match "{searchQuery || statusFilter || priorityFilter}".
                    </p>
                    {(searchQuery || statusFilter !== 'All' || priorityFilter !== 'All') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('All');
                          setPriorityFilter('All');
                        }}
                        className="mt-3 px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors inline-block"
                      >
                        Clear Search & Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredShipments.map(s => {
                  const isDelivered = s.status === 'Delivered';
                  const isDelayed = s.status === 'Delayed';
                  const isOutForDelivery = s.status === 'Out for Delivery';
                  const isSelected = s.id === selectedShipmentId;

                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-orange-50/40' : ''
                      }`}
                    >
                      {/* Tracking ID & Shipment ID */}
                      <td className="py-3.5 px-4 font-mono">
                        <button
                          onClick={() => setSelectedShipmentId(s.id)}
                          className="hover:text-orange-600 text-blue-700 font-bold flex items-center gap-1 text-left"
                        >
                          {s.trackingNumber}
                        </button>
                        <div className="text-[10px] text-slate-400 font-normal">
                          ID: <span className="text-slate-600">{s.id}</span>
                        </div>
                      </td>

                      {/* Customer & Cargo */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{s.customerName}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {s.items[0]?.description} ({s.totalWeightKg} kg)
                        </div>
                      </td>

                      {/* Route */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 truncate max-w-[200px]">
                          {s.senderCity} → {s.receiverCity}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {s.receiverAddress}
                        </div>
                      </td>

                      {/* Priority & Type */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const pBadge = getPriorityDisplay(s.priority);
                            return (
                              <span
                                title={`Operational Priority: ${pBadge.label} (${pBadge.original})`}
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] border shadow-2xs ${pBadge.badgeClass}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${pBadge.dotClass}`} />
                                <span className="font-bold">{pBadge.label}</span>
                              </span>
                            );
                          })()}
                          <span className="text-[11px] text-slate-500 font-medium">
                            {s.shippingType}
                          </span>
                        </div>
                      </td>

                      {/* Driver & Vehicle */}
                      <td className="py-3.5 px-4">
                        {s.assignedDriverName ? (
                          <div>
                            <div className="font-semibold text-slate-900">{s.assignedDriverName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{s.assignedVehicleReg}</div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedShipmentId(s.id)}
                            className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                          >
                            + Assign Driver
                          </button>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
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

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedShipmentId(s.id)}
                            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            Inspect
                          </button>
                          {!isDelivered && (
                            <button
                              onClick={() => {
                                setPodTargetShipment(s);
                                setIsPodModalOpen(true);
                              }}
                              className="px-2.5 py-1 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors font-semibold"
                            >
                              POD
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Shipment Inspection Drawer */}
      {activeShipment && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
          <div>
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Shipment Specification Sheet
                </div>
                <h2 className="text-base font-bold text-slate-900 font-mono mt-0.5">
                  {activeShipment.trackingNumber}
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      activeShipment.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activeShipment.status === 'Delayed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {activeShipment.status}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span>{activeShipment.shippingType}</span>
                    <span>·</span>
                    {(() => {
                      const pBadge = getPriorityDisplay(activeShipment.priority);
                      return (
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border ${pBadge.badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${pBadge.dotClass}`} />
                          <span className="font-bold">{pBadge.label} Priority</span>
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedShipmentId(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-6 text-xs">
              {/* Dispatch Action: Status Advancement */}
              <div className="p-3.5 bg-orange-50/50 border border-orange-100 rounded-xl space-y-2">
                <span className="font-bold text-orange-950 block">Operational Status Control</span>
                <div className="flex flex-wrap gap-1.5">
                  {allStatuses.map(st => (
                    <button
                      key={st}
                      disabled={activeShipment.status === st}
                      onClick={() => updateShipmentStatus(activeShipment.id, st)}
                      className={`px-2 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                        activeShipment.status === st
                          ? 'bg-orange-500 text-white font-bold'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-orange-100/60'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Driver & Fleet Assignment */}
              <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-950">Driver & Vehicle Dispatch</span>
                  <span className="text-[10px] text-blue-700 font-mono">
                    {activeShipment.assignedDriverName || 'Unassigned'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium">Driver</label>
                    <select
                      value={selectedDriverToAssign || activeShipment.assignedDriverId || ''}
                      onChange={e => setSelectedDriverToAssign(e.target.value)}
                      className="w-full mt-0.5 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                    >
                      <option value="">Select Driver...</option>
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-medium">Vehicle</label>
                    <select
                      value={selectedVehicleToAssign || activeShipment.assignedVehicleId || ''}
                      onChange={e => setSelectedVehicleToAssign(e.target.value)}
                      className="w-full mt-0.5 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                    >
                      <option value="">Select Vehicle...</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.registrationNumber} ({v.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const drvId = selectedDriverToAssign || activeShipment.assignedDriverId || drivers[0].id;
                    const vehId = selectedVehicleToAssign || activeShipment.assignedVehicleId || vehicles[0].id;
                    assignDriverAndVehicle(activeShipment.id, drvId, vehId);
                  }}
                  className="w-full py-1.5 text-xs font-semibold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Confirm Fleet Assignment
                </button>
              </div>

              {/* Origin & Destination Cards */}
              <div className="space-y-3">
                {/* Origin */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-blue-700 font-bold mb-1">
                    <MapPin className="w-3.5 h-3.5" /> Pickup Origin (Sender)
                  </div>
                  <div className="font-semibold text-slate-900">{activeShipment.senderName}</div>
                  <div className="text-slate-600">{activeShipment.senderAddress}, {activeShipment.senderCity}</div>
                  <div className="text-slate-500 flex items-center gap-1 mt-1 font-mono">
                    <Phone className="w-3 h-3" /> {activeShipment.senderPhone}
                  </div>
                </div>

                {/* Destination */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-orange-600 font-bold mb-1">
                    <MapPin className="w-3.5 h-3.5" /> Delivery Destination (Receiver)
                  </div>
                  <div className="font-semibold text-slate-900">{activeShipment.receiverName}</div>
                  <div className="text-slate-600">{activeShipment.receiverAddress}, {activeShipment.receiverCity}</div>
                  <div className="text-slate-500 flex items-center gap-1 mt-1 font-mono">
                    <Phone className="w-3 h-3" /> {activeShipment.receiverPhone}
                  </div>
                </div>
              </div>

              {/* Cargo Details */}
              <div>
                <span className="font-bold text-slate-900 block mb-2">Package Items & Specs</span>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {activeShipment.items.map(item => (
                    <div key={item.id} className="p-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-800">{item.description}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {item.dimensionsCm.length}x{item.dimensionsCm.width}x{item.dimensionsCm.height} cm
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-slate-900">{item.quantity} units</div>
                        <div className="text-[11px] text-slate-500">{item.weightKg} kg</div>
                      </div>
                    </div>
                  ))}
                </div>
                {activeShipment.specialInstructions && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-[11px]">
                    <span className="font-bold">Instructions: </span> {activeShipment.specialInstructions}
                  </div>
                )}
              </div>

              {/* Proof of Delivery Card (If available) */}
              {activeShipment.proofOfDelivery && (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Proof of Delivery (POD) Confirmed</span>
                  </div>
                  <div className="text-[11px] text-slate-700 space-y-1">
                    <div><span className="font-semibold">Recipient:</span> {activeShipment.proofOfDelivery.recipientName}</div>
                    <div><span className="font-semibold">Delivered At:</span> {new Date(activeShipment.proofOfDelivery.deliveredAt).toLocaleString()}</div>
                    <div><span className="font-semibold">Verified Driver:</span> {activeShipment.proofOfDelivery.driverName}</div>
                  </div>

                  {activeShipment.proofOfDelivery.signatureDataUrl && (
                    <div className="mt-2 bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block mb-1">Customer Signature:</span>
                      <img
                        src={activeShipment.proofOfDelivery.signatureDataUrl}
                        alt="Signature"
                        className="h-14 object-contain"
                      />
                    </div>
                  )}

                  {activeShipment.proofOfDelivery.photoUrl && (
                    <div className="mt-2">
                      <span className="text-[10px] text-slate-400 block mb-1">Delivery Photo Proof:</span>
                      <img
                        src={activeShipment.proofOfDelivery.photoUrl}
                        alt="Delivery Proof"
                        className="w-full h-28 object-cover rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Complete Event Audit Timeline */}
              <div>
                <span className="font-bold text-slate-900 block mb-3">Audit Tracking Journey</span>
                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeShipment.trackingHistory.map((ev, idx) => (
                    <div key={ev.id || idx} className="flex items-start gap-3 relative">
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-orange-500 text-orange-600 flex items-center justify-center shrink-0 z-10">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-900">{ev.status}</span>
                          <span className="text-slate-400 font-mono">
                            {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{ev.description}</p>
                        <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {ev.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
            <button
              onClick={() => {
                setTrackingLookupNumber(activeShipment.trackingNumber);
                setActiveTab('tracking');
              }}
              className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              Public Tracking View <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {activeShipment.status !== 'Delivered' && (
              <button
                onClick={() => {
                  setPodTargetShipment(activeShipment);
                  setIsPodModalOpen(true);
                }}
                className="py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1"
              >
                Confirm POD
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
