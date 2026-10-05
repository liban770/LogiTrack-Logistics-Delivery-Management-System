import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { ShipmentStatus } from '../../types';
import {
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  User,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Filter
} from 'lucide-react';

export const DeliveriesView: React.FC = () => {
  const {
    shipments,
    drivers,
    vehicles,
    assignDriverAndVehicle,
    updateShipmentStatus,
    setIsPodModalOpen,
    setPodTargetShipment,
    setSelectedShipmentId,
    setActiveTab,
    setIsNewShipmentModalOpen
  } = useLogistics();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedDriverId, setSelectedDriverId] = useState<{ [shipmentId: string]: string }>({});
  const [selectedVehicleId, setSelectedVehicleId] = useState<{ [shipmentId: string]: string }>({});

  const filteredDeliveries = shipments.filter(s => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Active') return s.status === 'In Transit' || s.status === 'Out for Delivery';
    return s.status === filterStatus;
  });

  const handleAssign = (shipmentId: string) => {
    const dId = selectedDriverId[shipmentId] || drivers[0].id;
    const vId = selectedVehicleId[shipmentId] || vehicles[0].id;
    assignDriverAndVehicle(shipmentId, dId, vId);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-500" />
            Delivery Operations & Dispatch Schedule
          </h1>
          <p className="text-xs text-slate-500">
            Monitor and control delivery dispatches, vehicle runs, and handover checkpoints
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            {['All', 'Active', 'Out for Delivery', 'Delivered', 'Delayed'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterStatus === st
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsNewShipmentModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Book Delivery Run
          </button>
        </div>
      </div>

      {/* Grid of Delivery Manifest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeliveries.map(delivery => {
          const isDelivered = delivery.status === 'Delivered';
          const isDelayed = delivery.status === 'Delayed';
          const isOutForDelivery = delivery.status === 'Out for Delivery';

          return (
            <div
              key={delivery.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Delivery #{delivery.id.slice(-6)}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 font-mono">
                    {delivery.trackingNumber}
                  </h3>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    {delivery.customerName}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    isDelivered
                      ? 'bg-emerald-100 text-emerald-800'
                      : isDelayed
                      ? 'bg-red-100 text-red-800 animate-pulse'
                      : isOutForDelivery
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {delivery.status}
                </span>
              </div>

              {/* Waypoints */}
              <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">PICKUP</span>
                    <span className="font-semibold text-slate-800">{delivery.senderName}</span>
                    <div className="text-slate-500 truncate max-w-[240px]">{delivery.senderAddress}</div>
                  </div>
                </div>

                <div className="w-0.5 h-3 bg-slate-200 ml-1" />

                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-600 mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">DELIVER TO</span>
                    <span className="font-semibold text-slate-800">{delivery.receiverName}</span>
                    <div className="text-slate-500 truncate max-w-[240px]">{delivery.receiverAddress}</div>
                  </div>
                </div>
              </div>

              {/* Driver & Vehicle Dispatch Row */}
              <div className="text-xs space-y-1.5">
                {delivery.assignedDriverName ? (
                  <div className="flex items-center justify-between p-2 bg-blue-50/50 rounded-xl border border-blue-100/70">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                        {delivery.assignedDriverName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{delivery.assignedDriverName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{delivery.assignedVehicleReg}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-blue-700 font-medium">Assigned</span>
                  </div>
                ) : (
                  <div className="space-y-2 p-2 bg-amber-50/50 rounded-xl border border-amber-100">
                    <div className="text-[11px] font-semibold text-amber-800">
                      Unassigned Delivery
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <select
                        value={selectedDriverId[delivery.id] || ''}
                        onChange={e =>
                          setSelectedDriverId({ ...selectedDriverId, [delivery.id]: e.target.value })
                        }
                        className="p-1 bg-white border border-slate-200 rounded text-[11px]"
                      >
                        <option value="">Driver...</option>
                        {drivers.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedVehicleId[delivery.id] || ''}
                        onChange={e =>
                          setSelectedVehicleId({ ...selectedVehicleId, [delivery.id]: e.target.value })
                        }
                        className="p-1 bg-white border border-slate-200 rounded text-[11px]"
                      >
                        <option value="">Vehicle...</option>
                        {vehicles.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.registrationNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleAssign(delivery.id)}
                      className="w-full py-1 text-[11px] font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded transition-colors"
                    >
                      Assign Fleet
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Weight: {delivery.totalWeightKg} kg</span>
                  <span className="font-mono text-slate-700 font-semibold">ETA: {delivery.estimatedArrival || 'Scheduled'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedShipmentId(delivery.id);
                    setActiveTab('shipments');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex-1 text-center"
                >
                  Manage Run
                </button>

                {!isDelivered ? (
                  <button
                    onClick={() => {
                      setPodTargetShipment(delivery);
                      setIsPodModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    POD
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> POD Complete
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
