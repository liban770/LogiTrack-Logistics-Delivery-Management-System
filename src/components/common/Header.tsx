import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { UserRole } from '../../types';
import {
  Bell,
  Search,
  Plus,
  Truck,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  Menu,
  X,
  PlayCircle,
  RotateCcw,
  LogOut,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const {
    currentUser,
    logout,
    role,
    setRole,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsNewShipmentModalOpen,
    setSelectedShipmentId,
    advanceLiveSimulation,
    resetDemoData
  } = useLogistics();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; desc: string; color: string }> = {
    admin: { label: 'Administrator', desc: 'Full System Control', color: 'bg-orange-500' },
    dispatcher: { label: 'Dispatcher', desc: 'Operations & Routes', color: 'bg-blue-600' },
    driver: { label: 'Driver App', desc: 'Active Runs & POD', color: 'bg-emerald-600' },
    customer: { label: 'Customer Portal', desc: 'Shipment Tracking', color: 'bg-purple-600' }
  };

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'shipments', label: 'Shipments' },
    { id: 'deliveries', label: 'Deliveries' },
    { id: 'map', label: 'Fleet Map' },
    { id: 'tracking', label: 'Track Order' },
    { id: 'warehouses', label: 'Warehouses' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
                  Logi<span className="text-orange-600">Track</span>
                </span>
                <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                  Logistics & Delivery OS
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-orange-600 bg-orange-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Global Quick Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xs relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tracking, driver, customer..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Zone 3: Actions & Role & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Simulation Trigger (Demo Tool) */}
            <button
              onClick={advanceLiveSimulation}
              title="Advance Live Simulation: Moves GPS coordinates and progresses transit"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/60 transition-colors shadow-2xs whitespace-nowrap"
            >
              <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Simulate Ping</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notification Popover Drawer */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-0 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Operational Alerts
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-700 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">No active alerts</div>
                    ) : (
                      notifications.map(n => {
                        const Icon =
                          n.type === 'success'
                            ? CheckCircle
                            : n.type === 'warning'
                            ? AlertTriangle
                            : Info;
                        const iconColor =
                          n.type === 'success'
                            ? 'text-emerald-500 bg-emerald-50'
                            : n.type === 'warning'
                            ? 'text-amber-500 bg-amber-50'
                            : 'text-blue-500 bg-blue-50';

                        return (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationAsRead(n.id);
                              if (n.linkShipmentId) {
                                setSelectedShipmentId(n.linkShipmentId);
                                setActiveTab('shipments');
                                setIsNotifOpen(false);
                              }
                            }}
                            className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                              !n.read ? 'bg-orange-50/30' : ''
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg shrink-0 ${iconColor}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900 truncate">{n.title}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                                {n.timestamp}
                              </span>
                            </div>
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0 mt-1.5" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated User Profile & Logout Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/80 transition-colors text-xs font-medium text-slate-800 focus:outline-none cursor-pointer"
                aria-label="User profile and settings"
              >
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                    {currentUser?.name || 'User'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium capitalize">
                    {roleLabels[role]?.label || role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {/* User Profile Card */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                        {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 text-xs truncate">
                          {currentUser?.name || 'Current User'}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate font-mono">
                          {currentUser?.email || ''}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Account Role:</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        role === 'admin'
                          ? 'bg-orange-100 text-orange-800'
                          : role === 'dispatcher'
                          ? 'bg-blue-100 text-blue-800'
                          : role === 'driver'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {roleLabels[role]?.label || role}
                      </span>
                    </div>
                  </div>

                  {/* Switch Role Option */}
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active View / Role
                  </div>
                  {(Object.keys(roleLabels) as UserRole[]).map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setIsProfileMenuOpen(false);
                        if (r === 'driver') setActiveTab('driver-app');
                        else if (r === 'customer') setActiveTab('customer-portal');
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        role === r ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${roleLabels[r].color}`} />
                        <span>{roleLabels[r].label}</span>
                      </div>
                      {role === r && <span className="text-orange-600 text-xs">✓</span>}
                    </button>
                  ))}

                  <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
                    <button
                      onClick={() => {
                        resetDemoData();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reset Demo Seed</span>
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-2.5 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Log Out Icon Button */}
            <button
              onClick={logout}
              title="Sign Out / Log Out"
              aria-label="Sign Out"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Primary Action Button: New Shipment */}
            <button
              onClick={() => setIsNewShipmentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Shipment</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
