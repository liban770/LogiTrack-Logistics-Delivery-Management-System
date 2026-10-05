import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { ShippingType, PriorityLevel } from '../../types';
import { X, PackagePlus, AlertTriangle, ShieldAlert } from 'lucide-react';

export const NewShipmentModal: React.FC = () => {
  const { isNewShipmentModalOpen, setIsNewShipmentModalOpen, createShipment, warehouses, setSelectedShipmentId, setActiveTab } = useLogistics();

  const [customerName, setCustomerName] = useState('Apex Medical Supplies');
  const [customerEmail, setCustomerEmail] = useState('logistics@apexmed.com');
  const [customerPhone, setCustomerPhone] = useState('+1 (312) 555-8120');

  const [senderName, setSenderName] = useState('Apex Distribution Facility');
  const [senderAddress, setSenderAddress] = useState('4200 Logistics Pkwy, Dock 2');
  const [senderCity, setSenderCity] = useState('Chicago, IL');

  const [receiverName, setReceiverName] = useState('Metro Health Clinic');
  const [receiverAddress, setReceiverAddress] = useState('2200 W Harrison St');
  const [receiverCity, setReceiverCity] = useState('Chicago, IL');
  const [receiverPhone, setReceiverPhone] = useState('+1 (312) 555-4499');

  const [itemDescription, setItemDescription] = useState('Diagnostic Reagent Kits');
  const [quantity, setQuantity] = useState(4);
  const [totalWeightKg, setTotalWeightKg] = useState(12.5);
  const [lengthCm, setLengthCm] = useState(40);
  const [widthCm, setWidthCm] = useState(30);
  const [heightCm, setHeightCm] = useState(25);

  const [shippingType, setShippingType] = useState<ShippingType>('Express');
  const [priority, setPriority] = useState<PriorityLevel>('Urgent');
  const [warehouseId, setWarehouseId] = useState('wh-1');
  const [specialInstructions, setSpecialInstructions] = useState('Keep upright. Fragile glass containers.');
  const [isFragile, setIsFragile] = useState(true);
  const [isHazardous, setIsHazardous] = useState(false);

  if (!isNewShipmentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newId = createShipment({
      customerName,
      customerEmail,
      customerPhone,
      senderName,
      senderAddress,
      senderCity,
      receiverName,
      receiverAddress,
      receiverCity,
      receiverPhone,
      items: [
        {
          id: `item-${Date.now()}`,
          description: itemDescription,
          quantity: Number(quantity),
          weightKg: Number(totalWeightKg),
          dimensionsCm: {
            length: Number(lengthCm),
            width: Number(widthCm),
            height: Number(heightCm)
          }
        }
      ],
      totalWeightKg: Number(totalWeightKg),
      shippingType,
      priority,
      warehouseId,
      specialInstructions,
      isFragile,
      isHazardous
    });

    setIsNewShipmentModalOpen(false);
    setSelectedShipmentId(newId);
    setActiveTab('shipments');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Create New Shipment</h2>
              <p className="text-xs text-slate-500">Generate waybill, auto-assign tracking ID, and queue for dispatch</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewShipmentModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Customer / Account Info */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Customer & Billing Account</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Company / Customer Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Pickup & Delivery Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            {/* Sender / Pickup */}
            <div className="space-y-2 p-3 bg-slate-50/70 rounded-xl border border-slate-200/70">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span> Pickup Origin (Sender)
              </span>
              <div>
                <label className="block text-slate-600 font-medium mb-0.5">Sender Facility / Name</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-0.5">Street Address</label>
                <input
                  type="text"
                  required
                  value={senderAddress}
                  onChange={e => setSenderAddress(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-0.5">City & State</label>
                <input
                  type="text"
                  required
                  value={senderCity}
                  onChange={e => setSenderCity(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Receiver / Destination */}
            <div className="space-y-2 p-3 bg-slate-50/70 rounded-xl border border-slate-200/70">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-600"></span> Delivery Destination (Receiver)
              </span>
              <div>
                <label className="block text-slate-600 font-medium mb-0.5">Recipient Name / Company</label>
                <input
                  type="text"
                  required
                  value={receiverName}
                  onChange={e => setReceiverName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-0.5">Street Address</label>
                <input
                  type="text"
                  required
                  value={receiverAddress}
                  onChange={e => setReceiverAddress(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-0.5">City & State</label>
                  <input
                    type="text"
                    required
                    value={receiverCity}
                    onChange={e => setReceiverCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-0.5">Phone</label>
                  <input
                    type="text"
                    value={receiverPhone}
                    onChange={e => setReceiverPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Package Details & Specifications */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Package Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="block text-slate-600 font-medium mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  value={itemDescription}
                  onChange={e => setItemDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Total Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={totalWeightKg}
                  onChange={e => setTotalWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-slate-500 text-[11px] mb-1">Length (cm)</label>
                <input
                  type="number"
                  min="1"
                  value={lengthCm}
                  onChange={e => setLengthCm(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[11px] mb-1">Width (cm)</label>
                <input
                  type="number"
                  min="1"
                  value={widthCm}
                  onChange={e => setWidthCm(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[11px] mb-1">Height (cm)</label>
                <input
                  type="number"
                  min="1"
                  value={heightCm}
                  onChange={e => setHeightCm(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          {/* Shipping Service & Routing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Shipping Type</label>
              <select
                value={shippingType}
                onChange={e => setShippingType(e.target.value as ShippingType)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
              >
                <option value="Standard">Standard (2-3 days)</option>
                <option value="Express">Express (Next day)</option>
                <option value="Same Day">Same Day Delivery</option>
                <option value="Freight">Heavy Freight Cargo</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
              >
                <option value="Critical">🔴 High Priority (Critical)</option>
                <option value="Urgent">🟡 Medium Priority (Urgent)</option>
                <option value="Normal">⚪ Low Priority (Normal)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Dispatching Warehouse</label>
              <select
                value={warehouseId}
                onChange={e => setWarehouseId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Special Instructions & Flags */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-slate-600 font-medium">Special Delivery Instructions</label>
            <input
              type="text"
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Call 15 min prior to arrival. Gate code #4012."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
            />
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={isFragile}
                  onChange={e => setIsFragile(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                />
                <span className="flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Fragile Handling Required
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={isHazardous}
                  onChange={e => setIsHazardous(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span className="flex items-center gap-1 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> Hazardous Material
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewShipmentModalOpen(false)}
              className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <PackagePlus className="w-4 h-4" />
              Generate Shipment & Tracking ID
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
