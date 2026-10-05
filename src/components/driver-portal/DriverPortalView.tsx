import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Shipment } from '../../types';
import {
  Smartphone,
  Navigation,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  AlertTriangle,
  Camera,
  PenTool,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const DriverPortalView: React.FC = () => {
  const {
    drivers,
    shipments,
    updateShipmentStatus,
    setIsPodModalOpen,
    setPodTargetShipment,
    addNotification
  } = useLogistics();

  // Active driver context (defaulting to first driver)
  const [activeDriverId, setActiveDriverId] = useState(drivers[0]?.id || 'drv-1');
  const currentDriver = drivers.find(d => d.id === activeDriverId) || drivers[0];

  const assignedDeliveries = shipments.filter(
    s => s.assignedDriverId === currentDriver.id && s.status !== 'Delivered'
  );

  const completedDeliveries = shipments.filter(
    s => s.assignedDriverId === currentDriver.id && s.status === 'Delivered'
  );

  const handleReportDelay = (shipment: Shipment) => {
    updateShipmentStatus(shipment.id, 'Delayed', 'Driver reported severe route congestion.');
    addNotification('Driver Reported Delay', `Driver ${currentDriver.name} flagged delay on ${shipment.trackingNumber}`, 'warning', shipment.id);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Mobile Terminal Top Card */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentDriver.avatar}
              alt={currentDriver.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-white">{currentDriver.name}</h1>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {currentDriver.assignedVehicleName || 'Electric Sprinter (LT-EV-104)'}
              </p>
            </div>
          </div>

          {/* Quick Driver Selector for demo */}
          <select
            value={activeDriverId}
            onChange={e => setActiveDriverId(e.target.value)}
            className="text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-1.5 focus:outline-none"
          >
            {drivers.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-800">
          <div className="p-2 bg-slate-800/60 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase">Assigned Stops</span>
            <div className="text-lg font-bold text-orange-400 font-mono">
              {assignedDeliveries.length}
            </div>
          </div>
          <div className="p-2 bg-slate-800/60 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase">Completed Today</span>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {completedDeliveries.length}
            </div>
          </div>
          <div className="p-2 bg-slate-800/60 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase">On-Time Score</span>
            <div className="text-lg font-bold text-white font-mono">
              {currentDriver.onTimeRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Stops Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
            Active Delivery Stops ({assignedDeliveries.length})
          </h2>
          <span className="text-xs text-slate-500 font-mono">Tap POD to confirm handover</span>
        </div>

        {assignedDeliveries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 stroke-1" />
            <p className="text-xs font-semibold text-slate-700">All assigned runs completed!</p>
            <p className="text-[11px] text-slate-400">Stand by for new dispatch instructions.</p>
          </div>
        ) : (
          assignedDeliveries.map((delivery, index) => {
            const isOut = delivery.status === 'Out for Delivery';
            const isDelayed = delivery.status === 'Delayed';

            return (
              <div
                key={delivery.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 font-mono">
                        {delivery.trackingNumber}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-semibold">{delivery.customerName}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isDelayed
                        ? 'bg-red-100 text-red-700'
                        : isOut
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {delivery.status}
                  </span>
                </div>

                {/* Recipient Address */}
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs border border-slate-100">
                  <div className="font-semibold text-slate-900">{delivery.receiverName}</div>
                  <div className="text-slate-600 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span>{delivery.receiverAddress}, {delivery.receiverCity}</span>
                  </div>
                  <div className="text-slate-500 flex items-center gap-1 font-mono pt-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{delivery.receiverPhone}</span>
                  </div>
                </div>

                {/* Cargo */}
                <div className="text-[11px] text-slate-500 flex justify-between px-1">
                  <span>Cargo: {delivery.items[0]?.description}</span>
                  <span className="font-mono font-semibold text-slate-800">{delivery.totalWeightKg} kg</span>
                </div>

                {/* Driver Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  {delivery.status !== 'Out for Delivery' ? (
                    <button
                      onClick={() => updateShipmentStatus(delivery.id, 'Out for Delivery', 'Driver approaching delivery address.')}
                      className="py-2.5 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Start Navigation
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setPodTargetShipment(delivery);
                        setIsPodModalOpen(true);
                      }}
                      className="py-2.5 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      Confirm Handover (POD)
                    </button>
                  )}

                  <button
                    onClick={() => handleReportDelay(delivery)}
                    className="py-2.5 px-3 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    Report Delay
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Completed POD Log */}
      {completedDeliveries.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Completed Proof of Deliveries Today ({completedDeliveries.length})
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            {completedDeliveries.map(s => (
              <div key={s.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-slate-900">{s.trackingNumber}</div>
                  <div className="text-[11px] text-slate-500">Delivered to: {s.receiverName}</div>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4" /> Verified POD
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
