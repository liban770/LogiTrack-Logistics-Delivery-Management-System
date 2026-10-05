import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import {
  UserCheck,
  Package,
  Search,
  Plus,
  ShieldCheck,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  Calendar
} from 'lucide-react';

export const CustomerPortalView: React.FC = () => {
  const {
    shipments,
    setIsNewShipmentModalOpen,
    setTrackingLookupNumber,
    setActiveTab,
    setSelectedShipmentId
  } = useLogistics();

  const [search, setSearch] = useState('');

  // Sample customer context (Apex Medical Supplies)
  const customerShipments = shipments.filter(
    s => s.customerName.includes('Apex') || s.senderName.includes('Apex')
  );

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Customer Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 font-mono">
              Client Portal
            </span>
            <h1 className="text-xl font-extrabold tracking-tight">Apex Medical Supplies Inc.</h1>
            <p className="text-xs text-blue-100 mt-0.5">
              Account #LOGI-CUST-884 · Contract Logistics Tier 1
            </p>
          </div>

          <button
            onClick={() => setIsNewShipmentModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-blue-900 bg-white hover:bg-blue-50 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-orange-600" />
            Book Shipment Pickup
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-blue-500/40 text-center text-xs">
          <div className="p-2 bg-white/10 rounded-xl">
            <span className="text-[10px] text-blue-200">Active Shipments</span>
            <div className="text-lg font-bold font-mono">
              {customerShipments.filter(s => s.status !== 'Delivered').length}
            </div>
          </div>
          <div className="p-2 bg-white/10 rounded-xl">
            <span className="text-[10px] text-blue-200">Delivered Shipments</span>
            <div className="text-lg font-bold font-mono">
              {customerShipments.filter(s => s.status === 'Delivered').length}
            </div>
          </div>
          <div className="p-2 bg-white/10 rounded-xl">
            <span className="text-[10px] text-blue-200">On-Time SLA</span>
            <div className="text-lg font-bold font-mono">99.2%</div>
          </div>
        </div>
      </div>

      {/* Shipments List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Your Shipments & Orders</h2>
            <p className="text-xs text-slate-500">Live order status and digital proof of delivery documentation</p>
          </div>
        </div>

        <div className="space-y-3">
          {customerShipments.map(s => {
            const isDelivered = s.status === 'Delivered';

            return (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 hover:bg-white shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 font-mono">
                        {s.trackingNumber}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {s.items[0]?.description} ({s.totalWeightKg} kg)
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold self-start sm:self-auto ${
                      isDelivered
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span>Destination: {s.receiverAddress}, {s.receiverCity}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Estimated: {s.estimatedArrival || 'Today'}</span>
                  </div>
                </div>

                {s.proofOfDelivery && (
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Received by: {s.proofOfDelivery.recipientName}</span>
                    </div>
                    <span className="font-mono text-[10px]">
                      {new Date(s.proofOfDelivery.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setTrackingLookupNumber(s.trackingNumber);
                      setActiveTab('tracking');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1"
                  >
                    Track Live <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
