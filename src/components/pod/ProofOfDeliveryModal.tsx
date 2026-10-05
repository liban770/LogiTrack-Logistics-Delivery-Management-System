import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { SignatureCanvas } from '../common/SignatureCanvas';
import { X, CheckCircle2, Camera, MapPin, Clock, User, ShieldCheck } from 'lucide-react';

export const ProofOfDeliveryModal: React.FC = () => {
  const { isPodModalOpen, setIsPodModalOpen, podTargetShipment, setPodTargetShipment, submitProofOfDelivery, drivers } = useLogistics();

  const [recipientName, setRecipientName] = useState('');
  const [signatureData, setSignatureData] = useState('');
  const [driverNotes, setDriverNotes] = useState('Delivered into recipient hands. Outer carton intact.');
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80'
  );
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);

  if (!isPodModalOpen || !podTargetShipment) return null;

  const currentDriver = drivers.find(d => d.id === podTargetShipment.assignedDriverId) || drivers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      alert('Please enter recipient name.');
      return;
    }

    submitProofOfDelivery({
      shipmentId: podTargetShipment.id,
      deliveredAt: new Date().toISOString(),
      recipientName: recipientName.trim(),
      signatureDataUrl: signatureData || undefined,
      photoUrl: photoUrl || undefined,
      gpsCoordinates: podTargetShipment.currentCoordinates || { lat: 41.8781, lng: -87.6298 },
      driverNotes: driverNotes.trim(),
      verifiedByDriverId: currentDriver.id,
      driverName: currentDriver.name
    });

    setIsPodModalOpen(false);
    setPodTargetShipment(null);
    setRecipientName('');
    setSignatureData('');
  };

  const handleSimulateNewPhoto = () => {
    setIsCapturingPhoto(true);
    setTimeout(() => {
      // Rotate sample realistic delivered package photos
      const samples = [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=400&q=80'
      ];
      const next = samples[Math.floor(Math.random() * samples.length)];
      setPhotoUrl(next);
      setIsCapturingPhoto(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Confirm Delivery & Proof (POD)</h2>
              <p className="text-xs text-slate-500 font-mono">Shipment: {podTargetShipment.trackingNumber}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsPodModalOpen(false);
              setPodTargetShipment(null);
            }}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          {/* Target summary */}
          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-900">{podTargetShipment.customerName}</span>
              <span className="text-blue-700 font-mono font-medium">{podTargetShipment.totalWeightKg} kg · {podTargetShipment.shippingType}</span>
            </div>
            <div className="text-xs text-blue-800/90 flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-600" />
              <span>{podTargetShipment.receiverAddress}, {podTargetShipment.receiverCity}</span>
            </div>
          </div>

          {/* Recipient Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Recipient Full Name / Title <span className="text-orange-600">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. John Doe, Receiving Lead"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Interactive Signature */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Customer Digital Signature
            </label>
            <SignatureCanvas onSave={setSignatureData} />
          </div>

          {/* Photo Proof */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Delivery Photo Verification</label>
              <button
                type="button"
                onClick={handleSimulateNewPhoto}
                disabled={isCapturingPhoto}
                className="text-xs font-medium text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                {isCapturingPhoto ? 'Snapping...' : 'Retake Photo'}
              </button>
            </div>
            <div className="relative h-28 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Delivery Proof"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-400 flex flex-col items-center gap-1">
                  <Camera className="w-6 h-6" />
                  <span className="text-xs">No photo captured</span>
                </div>
              )}
              <div className="absolute bottom-1.5 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white backdrop-blur-xs font-mono">
                GPS Verified
              </div>
            </div>
          </div>

          {/* Driver Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Driver Handover Notes
            </label>
            <textarea
              rows={2}
              value={driverNotes}
              onChange={(e) => setDriverNotes(e.target.value)}
              placeholder="e.g. Left with front desk receptionist, no damage to parcel."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Geolocation & Time Audit Stamps */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 font-mono">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Live)</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>41.8781° N, 87.6298° W</span>
            </div>
            <div className="col-span-2 flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Verified by Driver: {currentDriver.name} ({currentDriver.licenseNumber})</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsPodModalOpen(false);
                setPodTargetShipment(null);
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Delivery & Save POD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
