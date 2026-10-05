import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Vehicle, VehicleType, VehicleStatus } from '../../types';
import {
  Car,
  Plus,
  BatteryCharging,
  Fuel,
  Wrench,
  ShieldCheck,
  Truck,
  AlertTriangle,
  X,
  Calendar,
  DollarSign,
  CheckCircle2
} from 'lucide-react';

export const VehiclesView: React.FC = () => {
  const { vehicles, drivers, createVehicle, updateVehicleStatus, addVehicleMaintenance } = useLogistics();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVehicleForMaint, setSelectedVehicleForMaint] = useState<Vehicle | null>(null);

  // New vehicle form
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [type, setType] = useState<VehicleType>('Van');
  const [model, setModel] = useState('');
  const [capacityKg, setCapacityKg] = useState(1800);
  const [capacityM3, setCapacityM3] = useState(14.0);
  const [assignedDriverId, setAssignedDriverId] = useState('');

  // Maintenance form
  const [maintType, setMaintType] = useState('Brake & Fluid Service');
  const [maintCost, setMaintCost] = useState(350);
  const [maintNotes, setMaintNotes] = useState('Replaced pads and inspected sensors.');

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const drv = drivers.find(d => d.id === assignedDriverId);
    createVehicle({
      registrationNumber: registrationNumber || `LT-FL-${Math.floor(100 + Math.random() * 900)}`,
      type,
      model: model || 'Cargo Carrier Express',
      year: 2025,
      capacityKg: Number(capacityKg),
      capacityM3: Number(capacityM3),
      assignedDriverId: assignedDriverId || undefined,
      assignedDriverName: drv ? drv.name : undefined,
      status: 'Available',
      fuelBatteryPercent: 100,
      currentMileageKm: 0,
      insuranceExpiration: '2028-05-31'
    });

    setIsAddModalOpen(false);
    setRegistrationNumber('');
    setModel('');
  };

  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleForMaint) return;

    addVehicleMaintenance(selectedVehicleForMaint.id, {
      date: new Date().toISOString().split('T')[0],
      type: maintType,
      cost: Number(maintCost),
      nextServiceDate: '2027-04-15',
      notes: maintNotes,
      technician: 'Fleet Pro Diagnostics'
    });

    updateVehicleStatus(selectedVehicleForMaint.id, 'Available');
    setSelectedVehicleForMaint(null);
  };

  const statusStyles: Record<VehicleStatus, string> = {
    'Available': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'In Use': 'bg-blue-50 text-blue-700 border-blue-200',
    'Maintenance': 'bg-amber-50 text-amber-700 border-amber-200',
    'Out of Service': 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Car className="w-5 h-5 text-orange-500" />
            Vehicle Fleet & Maintenance Registry
          </h1>
          <p className="text-xs text-slate-500">
            {vehicles.length} fleet units · Telemetry, payload capacities, fuel levels, and maintenance logs
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map(veh => {
          const isElectric = veh.type === 'Electric Sprinter';
          const isMaint = veh.status === 'Maintenance';

          return (
            <div
              key={veh.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Title & Status */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {veh.type}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-mono">
                      {veh.registrationNumber}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">{veh.model}</p>
                  </div>

                  <select
                    value={veh.status}
                    onChange={e => updateVehicleStatus(veh.id, e.target.value as VehicleStatus)}
                    className={`text-[11px] font-semibold px-2 py-1 rounded-full border ${statusStyles[veh.status]} focus:outline-none`}
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>

                {/* Specs */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Payload Capacity</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {veh.capacityKg.toLocaleString()} kg / {veh.capacityM3} m³
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Odometer</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {veh.currentMileageKm.toLocaleString()} km
                    </span>
                  </div>
                </div>

                {/* Battery / Fuel Gauge */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      {isElectric ? (
                        <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Fuel className="w-3.5 h-3.5 text-blue-600" />
                      )}
                      <span>{isElectric ? 'State of Charge' : 'Fuel Level'}</span>
                    </span>
                    <span className="font-bold font-mono text-slate-800">{veh.fuelBatteryPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${veh.fuelBatteryPercent}%` }}
                      className={`h-full rounded-full transition-all ${
                        veh.fuelBatteryPercent > 30 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Assigned Driver */}
                <div className="mt-3 text-xs flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-500">Designated Driver:</span>
                  <span className="font-semibold text-slate-900">
                    {veh.assignedDriverName || 'Standby'}
                  </span>
                </div>

                {/* Maintenance Records Preview */}
                {veh.maintenanceRecords && veh.maintenanceRecords.length > 0 && (
                  <div className="mt-3 p-2.5 bg-amber-50/50 rounded-xl border border-amber-100 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-amber-900 font-semibold">
                      <span className="flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-amber-600" /> Recent Service
                      </span>
                      <span className="font-mono text-[10px]">{veh.lastServiceDate}</span>
                    </div>
                    <div className="text-slate-600 truncate">{veh.maintenanceRecords[0].type}</div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedVehicleForMaint(veh)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Wrench className="w-3.5 h-3.5 text-slate-500" />
                  Log Maintenance
                </button>

                <span className="text-[11px] text-slate-400 font-mono">
                  Insured to {veh.insuranceExpiration}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Add Fleet Vehicle</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Registration # *</label>
                  <input
                    type="text"
                    required
                    value={registrationNumber}
                    onChange={e => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. LT-VN-505"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as VehicleType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Van">Van</option>
                    <option value="Box Truck">Box Truck</option>
                    <option value="Electric Sprinter">Electric Sprinter</option>
                    <option value="Heavy Truck">Heavy Truck</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Model & Make</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  placeholder="e.g. Ford Transit 350 High Roof"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Capacity (kg)</label>
                  <input
                    type="number"
                    value={capacityKg}
                    onChange={e => setCapacityKg(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Capacity (m³)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={capacityM3}
                    onChange={e => setCapacityM3(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Assigned Driver</label>
                <select
                  value={assignedDriverId}
                  onChange={e => setAssignedDriverId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="">Unassigned</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Maintenance Modal */}
      {selectedVehicleForMaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Record Maintenance Event</h2>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedVehicleForMaint.registrationNumber} ({selectedVehicleForMaint.model})
                </p>
              </div>
              <button
                onClick={() => setSelectedVehicleForMaint(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMaintenance} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Service Type *</label>
                <input
                  type="text"
                  required
                  value={maintType}
                  onChange={e => setMaintType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Cost ($ USD)</label>
                <input
                  type="number"
                  required
                  value={maintCost}
                  onChange={e => setMaintCost(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Technician Notes</label>
                <textarea
                  rows={2}
                  value={maintNotes}
                  onChange={e => setMaintNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedVehicleForMaint(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Commit Service Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
