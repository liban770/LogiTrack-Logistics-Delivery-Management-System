import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Users,
  Car,
  Star,
  FileSpreadsheet
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { shipments, drivers, vehicles } = useLogistics();

  const [dateRange, setDateRange] = useState('October 2026');

  // Compute metrics
  const total = shipments.length;
  const delivered = shipments.filter(s => s.status === 'Delivered').length;
  const delayed = shipments.filter(s => s.status === 'Delayed').length;
  const inTransit = shipments.filter(s => s.status === 'In Transit' || s.status === 'Out for Delivery').length;

  const handleExportCSV = () => {
    const headers = ['TrackingNumber', 'Customer', 'Origin', 'Destination', 'Status', 'WeightKg', 'Driver', 'Vehicle'];
    const rows = shipments.map(s => [
      s.trackingNumber,
      `"${s.customerName}"`,
      `"${s.senderCity}"`,
      `"${s.receiverCity}"`,
      s.status,
      s.totalWeightKg,
      `"${s.assignedDriverName || 'N/A'}"`,
      s.assignedVehicleReg || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `logitrack_shipments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            Operations Analytics & SLA Reports
          </h1>
          <p className="text-xs text-slate-500">
            Performance metrics, driver efficiency benchmarks, and CSV data export
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export CSV Dataset
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">On-Time Delivery SLA</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">98.4%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +1.2% this quarter
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Fleet Fuel/Energy Efficiency</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">8.2 km/kWh</div>
          <div className="text-[11px] text-slate-500 mt-1">Electric Sprinter fleet</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Avg Handover Dwell Time</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">3.4 min</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">With digital POD</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Customer Rating Index</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">4.92 / 5.0</div>
          <div className="text-[11px] text-amber-500 font-medium mt-1 flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400" /> Across 1,480 reviews
          </div>
        </div>
      </div>

      {/* Driver Performance Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Driver Efficiency Leaderboard</h2>
            <p className="text-xs text-slate-500">Ranked by on-time fulfillment and customer satisfaction rating</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rank & Driver</th>
                <th className="py-3 px-4">Total Deliveries</th>
                <th className="py-3 px-4">Successful</th>
                <th className="py-3 px-4">On-Time %</th>
                <th className="py-3 px-4">Avg Drop Duration</th>
                <th className="py-3 px-4">Customer Rating</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[...drivers]
                .sort((a, b) => b.rating - a.rating)
                .map((driver, index) => (
                  <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-400 w-4 text-center">
                          #{index + 1}
                        </span>
                        <img
                          src={driver.avatar}
                          alt={driver.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{driver.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{driver.assignedVehicleName || 'Standby'}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {driver.totalDeliveries}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-emerald-600 font-semibold">
                      {driver.successfulDeliveries}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {driver.onTimeRate}%
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {driver.averageDeliveryMinutes} mins
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-bold text-amber-600 font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{driver.rating.toFixed(2)}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {driver.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
