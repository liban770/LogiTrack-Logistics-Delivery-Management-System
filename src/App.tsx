import React, { useState } from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { ShipmentsView } from './components/shipments/ShipmentsView';
import { DeliveriesView } from './components/deliveries/DeliveriesView';
import { LiveFleetMapView } from './components/map/LiveFleetMapView';
import { DriversView } from './components/drivers/DriversView';
import { VehiclesView } from './components/vehicles/VehiclesView';
import { RoutesView } from './components/routes/RoutesView';
import { WarehousesView } from './components/warehouses/WarehousesView';
import { TrackingView } from './components/tracking/TrackingView';
import { ReportsView } from './components/reports/ReportsView';
import { DriverPortalView } from './components/driver-portal/DriverPortalView';
import { CustomerPortalView } from './components/customer-portal/CustomerPortalView';
import { NewShipmentModal } from './components/shipments/NewShipmentModal';
import { ProofOfDeliveryModal } from './components/pod/ProofOfDeliveryModal';

const AppContent: React.FC = () => {
  const { activeTab } = useLogistics();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'shipments':
        return <ShipmentsView />;
      case 'deliveries':
        return <DeliveriesView />;
      case 'map':
        return <LiveFleetMapView />;
      case 'drivers':
        return <DriversView />;
      case 'vehicles':
        return <VehiclesView />;
      case 'routes':
        return <RoutesView />;
      case 'warehouses':
        return <WarehousesView />;
      case 'tracking':
        return <TrackingView />;
      case 'reports':
        return <ReportsView />;
      case 'driver-app':
        return <DriverPortalView />;
      case 'customer-portal':
        return <CustomerPortalView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-orange-500 selection:text-white">
      {/* Top Header */}
      <Header
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <NewShipmentModal />
      <ProofOfDeliveryModal />
    </div>
  );
};

export default function App() {
  return (
    <LogisticsProvider>
      <AppContent />
    </LogisticsProvider>
  );
}
