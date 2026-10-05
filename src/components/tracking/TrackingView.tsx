import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { ShipmentStatus } from '../../types';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  User,
  ShieldCheck,
  AlertTriangle,
  PlayCircle,
  Copy,
  Check,
  Package,
  Calendar,
  Phone,
  FileCheck
} from 'lucide-react';

export const TrackingView: React.FC = () => {
  const {
    shipments,
    trackingLookupNumber,
    setTrackingLookupNumber,
    updateShipmentStatus,
    setIsPodModalOpen,
    setPodTargetShipment
  } = useLogistics();

  const [inputVal, setInputVal] = useState(trackingLookupNumber || 'LT-2026-000184');
  const [copied, setCopied] = useState(false);

  const matchedShipment = shipments.find(
    s => s.trackingNumber.trim().toUpperCase() === (trackingLookupNumber || inputVal).trim().toUpperCase()
  ) || shipments[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setTrackingLookupNumber(inputVal.trim());
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Standard logistics milestone sequence from Section 6
  const milestoneSteps: { title: string; desc: string; targetStatuses: ShipmentStatus[] }[] = [
    { title: 'Shipment Created', desc: 'Order details registered', targetStatuses: ['Pending', 'Pickup Scheduled', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'] },
    { title: 'Pickup Completed', desc: 'Driver collected cargo', targetStatuses: ['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'] },
    { title: 'Departed Warehouse', desc: 'Processed at hub facility', targetStatuses: ['In Transit', 'Out for Delivery', 'Delivered'] },
    { title: 'In Transit', desc: 'Moving along active corridor', targetStatuses: ['In Transit', 'Out for Delivery', 'Delivered'] },
    { title: 'Out for Delivery', desc: 'Driver dispatched to final address', targetStatuses: ['Out for Delivery', 'Delivered'] },
    { title: 'Delivered', desc: 'Recipient verified & POD secured', targetStatuses: ['Delivered'] }
  ];

  const getStepStatus = (stepIndex: number) => {
    if (!matchedShipment) return 'upcoming';

    if (matchedShipment.status === 'Delivered') {
      return 'completed';
    }

    if (matchedShipment.status === 'Delayed') {
      if (stepIndex <= 3) return 'completed';
      if (stepIndex === 4) return 'delayed';
      return 'upcoming';
    }

    const currentStatus = matchedShipment.status;
    const statusMap: Record<ShipmentStatus, number> = {
      'Pending': 0,
      'Pickup Scheduled': 0,
      'Picked Up': 1,
      'In Transit': 3,
      'Out for Delivery': 4,
      'Delivered': 5,
      'Delayed': 3,
      'Failed Delivery': 4,
      'Cancelled': 0,
      'Returned': 2
    };

    const currentLevel = statusMap[currentStatus] ?? 0;
    if (stepIndex < currentLevel) return 'completed';
    if (stepIndex === currentLevel) return 'current';
    return 'upcoming';
  };

  // Progress driver along next milestone
  const advanceMilestone = () => {
    if (!matchedShipment) return;
    if (matchedShipment.status === 'Pending') updateShipmentStatus(matchedShipment.id, 'Picked Up');
    else if (matchedShipment.status === 'Pickup Scheduled') updateShipmentStatus(matchedShipment.id, 'Picked Up');
    else if (matchedShipment.status === 'Picked Up') updateShipmentStatus(matchedShipment.id, 'In Transit');
    else if (matchedShipment.status === 'In Transit') updateShipmentStatus(matchedShipment.id, 'Out for Delivery');
    else if (matchedShipment.status === 'Out for Delivery') {
      setPodTargetShipment(matchedShipment);
      setIsPodModalOpen(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="text-center max-w-xl mx-auto mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 font-mono">
            Direct Tracking Engine
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Track Any Package Worldwide
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time milestone progression, GPS beacons, and digital proof of delivery.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Enter Tracking Number (e.g. LT-2026-000184)"
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-xs transition-colors whitespace-nowrap"
          >
            Track Order
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap text-xs text-slate-500">
          <span className="text-[11px] text-slate-400">Sample Records:</span>
          {shipments.slice(0, 4).map(s => (
            <button
              key={s.id}
              onClick={() => {
                setInputVal(s.trackingNumber);
                setTrackingLookupNumber(s.trackingNumber);
              }}
              className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-700 font-mono text-[11px] transition-colors"
            >
              {s.trackingNumber} ({s.status})
            </button>
          ))}
        </div>
      </div>

      {matchedShipment ? (
        <div className="space-y-6">
          {/* Main Tracking Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-linear-to-r from-slate-50 via-white to-orange-50/20">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Waypoint Manifest
                </span>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-extrabold text-slate-900 font-mono">
                    {matchedShipment.trackingNumber}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      matchedShipment.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : matchedShipment.status === 'Delayed'
                        ? 'bg-red-100 text-red-800 animate-pulse'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {matchedShipment.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Customer: <span className="font-semibold text-slate-800">{matchedShipment.customerName}</span> ·{' '}
                  {matchedShipment.shippingType} Priority
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied' : 'Share Link'}</span>
                </button>

                {matchedShipment.status !== 'Delivered' && (
                  <button
                    onClick={advanceMilestone}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Advance Status</span>
                  </button>
                )}
              </div>
            </div>

            {/* Visual Milestones Stepper */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                {/* Horizontal Progress Bar for Desktop */}
                <div className="hidden md:block absolute top-5 left-6 right-6 h-1 bg-slate-200 z-0">
                  <div
                    style={{
                      width:
                        matchedShipment.status === 'Delivered'
                          ? '100%'
                          : matchedShipment.status === 'Out for Delivery'
                          ? '80%'
                          : matchedShipment.status === 'In Transit'
                          ? '60%'
                          : matchedShipment.status === 'Picked Up'
                          ? '30%'
                          : '10%'
                    }}
                    className="h-full bg-orange-500 transition-all duration-500"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative z-10">
                  {milestoneSteps.map((step, idx) => {
                    const status = getStepStatus(idx);
                    const isCompleted = status === 'completed';
                    const isCurrent = status === 'current';
                    const isDelayed = status === 'delayed';

                    return (
                      <div key={step.title} className="flex flex-col md:items-center text-left md:text-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-transform shadow-xs ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-orange-500 text-white ring-4 ring-orange-200 scale-105'
                              : isDelayed
                              ? 'bg-red-600 text-white ring-4 ring-red-200'
                              : 'bg-white border-2 border-slate-200 text-slate-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <span>0{idx + 1}</span>
                          )}
                        </div>

                        <div className="text-xs font-bold text-slate-900">{step.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{step.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Delivery Meta & Dispatch Cards */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Origin & Destination */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Route Coordinates
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-blue-600 font-bold block mb-0.5">ORIGIN</span>
                    <div className="font-semibold text-slate-900">{matchedShipment.senderName}</div>
                    <div className="text-slate-500">{matchedShipment.senderAddress}, {matchedShipment.senderCity}</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-orange-600 font-bold block mb-0.5">DESTINATION</span>
                    <div className="font-semibold text-slate-900">{matchedShipment.receiverName}</div>
                    <div className="text-slate-500">{matchedShipment.receiverAddress}, {matchedShipment.receiverCity}</div>
                  </div>
                </div>
              </div>

              {/* Driver & Vehicle */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Carrier & Vehicle
                </span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {matchedShipment.assignedDriverName || 'Awaiting assignment'}
                      </div>
                      <div className="text-[10px] text-slate-400">Driver License Verified</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vehicle Unit:</span>
                      <span className="font-semibold font-mono">{matchedShipment.assignedVehicleReg || 'Pending'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Zone:</span>
                      <span className="font-medium text-slate-800 text-right truncate max-w-[140px]">
                        {matchedShipment.currentLocation}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estimated Arrival:</span>
                      <span className="font-bold text-orange-600">{matchedShipment.estimatedArrival || 'Today'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Specs */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Cargo Verification
                </span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Weight:</span>
                    <span className="font-bold text-slate-900 font-mono">{matchedShipment.totalWeightKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Item Count:</span>
                    <span className="font-bold text-slate-900">{matchedShipment.items.length} Parcel(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service Class:</span>
                    <span className="font-bold text-slate-900">{matchedShipment.shippingType}</span>
                  </div>
                  {matchedShipment.isFragile && (
                    <div className="text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded border border-amber-200 flex items-center gap-1 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" /> Fragile Handling Required
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Proof of Delivery (POD) Section if delivered */}
          {matchedShipment.proofOfDelivery && (
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-100 mb-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h3 className="text-base text-slate-900">Official Proof of Delivery (POD)</h3>
                    <p className="text-xs text-slate-500 font-normal">
                      Verified receipt by customer signature and location audit
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  VERIFIED DELIVERED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meta & Signer */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                    <div>
                      <span className="text-slate-500">Signed For By:</span>{' '}
                      <span className="font-bold text-slate-900">{matchedShipment.proofOfDelivery.recipientName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Delivered Timestamp:</span>{' '}
                      <span className="font-bold font-mono text-slate-900">
                        {new Date(matchedShipment.proofOfDelivery.deliveredAt).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Verified Driver:</span>{' '}
                      <span className="font-bold text-slate-900">{matchedShipment.proofOfDelivery.driverName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Driver Notes:</span>{' '}
                      <span className="text-slate-700 italic">{matchedShipment.proofOfDelivery.driverNotes}</span>
                    </div>
                  </div>

                  {/* Digital Signature */}
                  {matchedShipment.proofOfDelivery.signatureDataUrl && (
                    <div>
                      <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Recipient Digital Signature:
                      </span>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
                        <img
                          src={matchedShipment.proofOfDelivery.signatureDataUrl}
                          alt="Customer Signature"
                          className="max-h-20 object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Photo Proof */}
                {matchedShipment.proofOfDelivery.photoUrl && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Delivery Location & Photo Proof:
                    </span>
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 h-48 bg-slate-100">
                      <img
                        src={matchedShipment.proofOfDelivery.photoUrl}
                        alt="Delivery Proof"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono">
                        GPS Verified: {matchedShipment.proofOfDelivery.gpsCoordinates.lat.toFixed(4)}°,{' '}
                        {matchedShipment.proofOfDelivery.gpsCoordinates.lng.toFixed(4)}°
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Audit History Log */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Complete Tracking Event Log</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {matchedShipment.trackingHistory.map((ev, i) => (
                <div key={ev.id || i} className="py-3 flex items-start gap-4">
                  <div className="font-mono text-slate-400 w-24 shrink-0 text-[11px]">
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-slate-900">{ev.status}</span> —{' '}
                    <span className="text-slate-600">{ev.description}</span>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">{ev.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          No shipment found with tracking number "{inputVal}".
        </div>
      )}
    </div>
  );
};
