import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Car,
  Route as RouteIcon,
  MapPin,
  Search,
  Warehouse,
  BarChart3,
  Smartphone,
  UserCheck,
  AlertTriangle,
  RotateCcw,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    shipments,
    drivers,
    vehicles,
    role,
    setRole,
    resetDemoData,
    currentUser,
    logout
  } = useLogistics();

  const delayedCount = shipments.filter(s => s.status === 'Delayed').length;
  const inTransitCount = shipments.filter(s => s.status === 'In Transit' || s.status === 'Out for Delivery').length;
  const activeDriversCount = drivers.filter(d => d.status === 'On Delivery').length;

  const mainNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'dispatcher']
    },
    {
      id: 'shipments',
      label: 'Shipments',
      icon: Package,
      badge: shipments.length,
      roles: ['admin', 'dispatcher']
    },
    {
      id: 'deliveries',
      label: 'Deliveries',
      icon: Truck,
      badge: inTransitCount > 0 ? `${inTransitCount} active` : undefined,
      badgeColor: 'bg-blue-100 text-blue-700',
      roles: ['admin', 'dispatcher']
    },
    {
      id: 'map',
      label: 'Live Fleet Map',
      icon: MapPin,
      roles: ['admin', 'dispatcher']
    },
    {
      id: 'drivers',
      label: 'Drivers',
      icon: Users,
      badge: `${activeDriversCount} on road`,
      roles: ['admin', 'dispatcher']
    },
    {
      id: 'vehicles',
      label: 'Vehicles & Fleet',
      icon: Car,
      badge: vehicles.length,
      roles: ['admin', 'dispatcher']
    },
    {
      id: 'routes',
      label: 'Route Planner',
      icon: RouteIcon,
      roles: ['admin', 'dispatcher']
    },
    {
      id: 'warehouses',
      label: 'Warehouses',
      icon: Warehouse,
      roles: ['admin', 'dispatcher']
    },
    {
      id: 'tracking',
      label: 'Track Any Order',
      icon: Search,
      roles: ['admin', 'dispatcher', 'driver', 'customer']
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      roles: ['admin', 'dispatcher']
    }
  ];

  const rolePortals = [
    {
      id: 'driver-app',
      label: 'Driver Field View',
      icon: Smartphone,
      subtitle: 'Mobile pickup & POD signature',
      roleTarget: 'driver' as const
    },
    {
      id: 'customer-portal',
      label: 'Customer Portal',
      icon: UserCheck,
      subtitle: 'Order tracking & history',
      roleTarget: 'customer' as const
    }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 overflow-y-auto space-y-6">
          {/* Delayed alert banner if any */}
          {delayedCount > 0 && (
            <div
              onClick={() => handleNavClick('shipments')}
              className="p-3 bg-red-50 border border-red-200 rounded-xl cursor-pointer hover:bg-red-100/70 transition-colors"
            >
              <div className="flex items-center gap-2 text-red-700 font-semibold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{delayedCount} Delayed Shipment</span>
              </div>
              <p className="text-[11px] text-red-600/90 mt-1">Requires immediate dispatch review</p>
            </div>
          )}

          {/* Operations Menu */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Logistics Operations
            </div>
            <nav className="space-y-1">
              {mainNavItems.map(item => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeColor || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Dedicated Portals Section */}
          <div className="pt-2 border-t border-slate-100">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Role Specialized Views
            </div>
            <div className="space-y-1.5">
              {rolePortals.map(p => {
                const isActive = activeTab === p.id;
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setRole(p.roleTarget);
                      handleNavClick(p.id);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                      isActive
                        ? 'border-orange-300 bg-orange-50/70 text-orange-950 shadow-2xs'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isActive ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold truncate">{p.label}</div>
                        <div className="text-[10px] text-slate-400 truncate">{p.subtitle}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Profile & Logout Info */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-2">
          {currentUser && (
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-orange-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate font-mono">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider">
                  {currentUser.role}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  title="Sign out of LogiTrack"
                >
                  <LogOut className="w-3 h-3" /> Sign Out
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Online</span>
            </span>
            <button
              onClick={resetDemoData}
              title="Reset state to initial sample records"
              className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
