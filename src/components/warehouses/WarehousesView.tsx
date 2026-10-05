import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Warehouse, Shipment } from '../../types';
import {
  Warehouse as WarehouseIcon,
  Barcode,
  Scan,
  PackageCheck,
  PackageOpen,
  ArrowDownLeft,
  ArrowUpRight,
  MapPin,
  Phone,
  CheckCircle2,
  Box
} from 'lucide-react';

export const WarehousesView: React.FC = () => {
  const { warehouses, shipments, updateShipmentStatus, addNotification } = useLogistics();

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(warehouses[0]?.id || '');
  const [scanCode, setScanCode] = useState('');
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);

  const activeWarehouse = warehouses.find(w => w.id === selectedWarehouseId) || warehouses[0];

  const warehouseShipments = shipments.filter(
    s => s.warehouseId === activeWarehouse?.id || s.senderCity.includes(activeWarehouse?.city.split(',')[0])
  );

  const handleSimulateScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCode.trim()) return;

    const found = shipments.find(
      s => s.trackingNumber.toUpperCase() === scanCode.trim().toUpperCase()
    );

    if (found) {
      updateShipmentStatus(found.id, 'In Transit', `Scanned at ${activeWarehouse.name} dock bay.`);
      setScanFeedback(`✓ Barcode Verified: ${found.trackingNumber} checked into ${activeWarehouse.name}`);
      addNotification('Package Checked In', `${found.trackingNumber} scanned at ${activeWarehouse.name}`, 'success', found.id);
    } else {
      setScanFeedback(`ℹ️ Scanned code ${scanCode} registered as Inbound Waybill.`);
    }

    setScanCode('');
    setTimeout(() => setScanFeedback(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <WarehouseIcon className="w-5 h-5 text-orange-500" />
            Warehouse & Fulfillment Hub Operations
          </h1>
          <p className="text-xs text-slate-500">
            Cross-dock inventory, package scanning terminal, and staging bay management
          </p>
        </div>

        {/* Warehouse Tabs */}
        <div className="flex items-center gap-2">
          {warehouses.map(w => (
            <button
              key={w.id}
              onClick={() => setSelectedWarehouseId(w.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                selectedWarehouseId === w.id
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {w.code}
            </button>
          ))}
        </div>
      </div>

      {activeWarehouse && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Warehouse Facility Details & Scanner */}
          <div className="space-y-5">
            {/* Facility Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {activeWarehouse.code}
                </span>
                <h2 className="text-base font-bold text-slate-900">{activeWarehouse.name}</h2>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeWarehouse.address}</span>
                </div>
              </div>

              {/* Capacity Gauge */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Storage Capacity Utilization</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {Math.round((activeWarehouse.currentPackagesCount / activeWarehouse.capacityPackages) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    style={{
                      width: `${(activeWarehouse.currentPackagesCount / activeWarehouse.capacityPackages) * 100}%`
                    }}
                    className="h-full bg-orange-500 rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>{activeWarehouse.currentPackagesCount.toLocaleString()} stored</span>
                  <span>Max: {activeWarehouse.capacityPackages.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Facility Manager:</span>
                  <span className="font-semibold text-slate-900">{activeWarehouse.managerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Operations Contact:</span>
                  <span className="font-mono text-slate-900">{activeWarehouse.contactPhone}</span>
                </div>
              </div>
            </div>

            {/* Inbound / Outbound Barcode Scan Terminal */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Scan className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Dock Bay Barcode Terminal</h3>
                  <p className="text-[11px] text-slate-400">Scan package label to check-in or dispatch</p>
                </div>
              </div>

              <form onSubmit={handleSimulateScan} className="space-y-2">
                <div className="relative">
                  <Barcode className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={scanCode}
                    onChange={e => setScanCode(e.target.value)}
                    placeholder="Scan or enter Tracking ID..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl font-mono uppercase focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <PackageCheck className="w-4 h-4" />
                  Simulate Package Scan
                </button>
              </form>

              {scanFeedback && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-1.5 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{scanFeedback}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right 2 Cols: Staged Packages Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Staged & Transiting Inventory</h3>
                <p className="text-xs text-slate-500">Parcels routed through {activeWarehouse.code}</p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                {warehouseShipments.length} Active Parcels
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Tracking #</th>
                    <th className="py-2.5 px-3">Recipient & Cargo</th>
                    <th className="py-2.5 px-3">Weight</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Dock Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {warehouseShipments.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{s.trackingNumber}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{s.receiverName}</div>
                        <div className="text-[11px] text-slate-400">{s.items[0]?.description}</div>
                      </td>
                      <td className="py-3 px-3 font-mono">{s.totalWeightKg} kg</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-700">
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => updateShipmentStatus(s.id, 'In Transit', 'Dispatched from warehouse staging.')}
                          className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Dispatch Out
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
