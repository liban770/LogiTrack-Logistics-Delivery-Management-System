import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Driver, DriverStatus } from '../../types';
import {
  Users,
  Plus,
  Star,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Shield,
  Truck,
  X,
  Search
} from 'lucide-react';

export const DriversView: React.FC = () => {
  const { drivers, vehicles, createDriver, updateDriverStatus } = useLogistics();

  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');

  // New Driver Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiration, setLicenseExpiration] = useState('2028-12-31');
  const [assignedVehicleId, setAssignedVehicleId] = useState('');

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.licenseNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find(v => v.id === assignedVehicleId);
    createDriver({
      name,
      email,
      phone,
      licenseNumber,
      licenseExpiration,
      assignedVehicleId: assignedVehicleId || undefined,
      assignedVehicleName: veh ? `${veh.model} (${veh.registrationNumber})` : undefined,
      status: 'Available'
    });

    setIsAddDriverOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setLicenseNumber('');
  };

  const statusColors: Record<DriverStatus, { badge: string; dot: string }> = {
    'Available': { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    'On Delivery': { badge: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    'On Break': { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    'Offline': { badge: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
    'Unavailable': { badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            Driver Fleet Management
          </h1>
          <p className="text-xs text-slate-500">
            {drivers.length} drivers registered · Performance scores, certifications, and shift statuses
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search driver name..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-44"
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Delivery">On Delivery</option>
            <option value="On Break">On Break</option>
            <option value="Offline">Offline</option>
          </select>

          <button
            onClick={() => setIsAddDriverOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Onboard Driver
          </button>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map(driver => {
          const style = statusColors[driver.status];

          return (
            <div
              key={driver.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top Profile Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{driver.name}</h3>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{driver.rating.toFixed(2)}</span>
                        <span className="text-slate-400 font-normal font-mono">
                          ({driver.totalDeliveries} runs)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={driver.status}
                    onChange={e => updateDriverStatus(driver.id, e.target.value as DriverStatus)}
                    className={`text-[11px] font-semibold px-2 py-1 rounded-full border ${style.badge} focus:outline-none`}
                  >
                    <option value="Available">Available</option>
                    <option value="On Delivery">On Delivery</option>
                    <option value="On Break">On Break</option>
                    <option value="Offline">Offline</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>

                {/* Contact & License Info */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{driver.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px]">
                      {driver.licenseNumber} (Exp: {driver.licenseExpiration})
                    </span>
                  </div>
                  {driver.assignedVehicleName && (
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 font-medium text-blue-800">
                      <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{driver.assignedVehicleName}</span>
                    </div>
                  )}
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase">On-Time</span>
                    <div className="font-extrabold text-slate-900 font-mono">{driver.onTimeRate}%</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase">Success</span>
                    <div className="font-extrabold text-emerald-600 font-mono">
                      {driver.successfulDeliveries}
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase">Avg Time</span>
                    <div className="font-extrabold text-slate-900 font-mono">
                      {driver.averageDeliveryMinutes}m
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Current Location */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate max-w-[200px]">📍 {driver.currentLocation.address}</span>
                <span className="font-mono text-slate-400">Joined {driver.joinedDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Onboard Driver Modal */}
      {isAddDriverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Onboard New Driver</h2>
              <button
                onClick={() => setIsAddDriverOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Samuel Ortiz"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="driver@logitrack.io"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">CDL License # *</label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={e => setLicenseNumber(e.target.value)}
                    placeholder="IL-CDL-12345"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={licenseExpiration}
                    onChange={e => setLicenseExpiration(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Assign Initial Vehicle</label>
                <select
                  value={assignedVehicleId}
                  onChange={e => setAssignedVehicleId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="">None / Standby</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} - {v.model} ({v.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDriverOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold"
                >
                  Save & Register Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
