import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Route, RouteStop } from '../../types';
import {
  Route as RouteIcon,
  Plus,
  Zap,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  ArrowRight,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const RoutesView: React.FC = () => {
  const { routes, drivers, vehicles, optimizeRouteStops, toggleRouteStopCompleted, createRoute } = useLogistics();

  const [selectedRouteId, setSelectedRouteId] = useState(routes[0]?.id || '');
  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <RouteIcon className="w-5 h-5 text-orange-500" />
            Route Planner & Sequence Optimizer
          </h1>
          <p className="text-xs text-slate-500">
            Multi-stop waypoint routing, turn-by-turn dispatch, and distance efficiency optimization
          </p>
        </div>

        {/* Route Selector tabs */}
        <div className="flex items-center gap-2">
          {routes.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                selectedRouteId === r.id
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r.name.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {activeRoute ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left 2 Cols: Waypoints & Stops Sequence */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">{activeRoute.name}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>Driver: <strong className="text-slate-800">{activeRoute.assignedDriverName}</strong></span>
                  <span>Vehicle: <strong className="text-slate-800 font-mono">{activeRoute.assignedVehicleReg}</strong></span>
                </div>
              </div>

              {/* Optimize Sequence Button */}
              <button
                onClick={() => optimizeRouteStops(activeRoute.id)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Optimize Stop Sequence (AI/TSP)
              </button>
            </div>

            {/* Waypoints List */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ordered Delivery Sequence ({activeRoute.stops.length} Stops)
              </span>

              <div className="space-y-2.5 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
                {activeRoute.stops.map(stop => (
                  <div
                    key={stop.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all relative ${
                      stop.completed
                        ? 'bg-slate-50/80 border-slate-200 opacity-75'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {/* Sequence Badge / Checkbox */}
                    <button
                      onClick={() => toggleRouteStopCompleted(activeRoute.id, stop.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-colors ${
                        stop.completed
                          ? 'bg-emerald-600 text-white'
                          : stop.type === 'depot'
                          ? 'bg-slate-900 text-white'
                          : 'bg-orange-500 text-white'
                      }`}
                    >
                      {stop.completed ? <CheckCircle2 className="w-5 h-5" /> : stop.sequence}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{stop.name}</span>
                        <span className="text-[11px] font-mono text-slate-500">
                          ETA: {stop.estimatedArrival}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{stop.address}</p>
                      {stop.trackingNumber && (
                        <div className="text-[10px] text-blue-700 font-mono font-medium mt-1">
                          Parcel: {stop.trackingNumber}
                        </div>
                      )}
                      {stop.notes && (
                        <div className="text-[10px] text-amber-700 bg-amber-50 p-1 rounded mt-1.5 inline-block">
                          Note: {stop.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Route Summary & Metrics */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Run Metrics & Schedule</h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase">Total Mileage</span>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {activeRoute.totalDistanceKm} km
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase">Estimated Time</span>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {Math.floor(activeRoute.estimatedDurationMinutes / 60)}h{' '}
                    {activeRoute.estimatedDurationMinutes % 60}m
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Route Progress</span>
                  <span className="font-bold text-emerald-600">
                    {activeRoute.stops.filter(s => s.completed).length} / {activeRoute.stops.length} Complete
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${
                        (activeRoute.stops.filter(s => s.completed).length / activeRoute.stops.length) * 100
                      }%`
                    }}
                    className="h-full bg-emerald-500 rounded-full transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Start Depot:</span>
                  <span className="font-semibold text-slate-800">{activeRoute.startLocation}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Return Depot:</span>
                  <span className="font-semibold text-slate-800">{activeRoute.endLocation}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Run Status:</span>
                  <span className="font-semibold text-blue-700">{activeRoute.status}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Scheduled Date:</span>
                  <span className="font-mono text-slate-800">{activeRoute.date}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-blue-900">
              <span className="font-bold block mb-1">Route Dispatch Note:</span>
              Stops 1 and 2 completed. Driver Ahmed Mohamed is currently en route to Stop 3 (St. Jude Regional Hospital).
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          No routes found.
        </div>
      )}
    </div>
  );
};
