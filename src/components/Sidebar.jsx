import React from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  Lightbulb, 
  History as HistoryIcon, 
  Settings as SettingsIcon,
  Ship,
  Anchor,
  FileText,
  DollarSign,
  Navigation,
  Calendar,
  Info,
  BarChart3,
  PlusCircle,
  Package
} from 'lucide-react';

export default function Sidebar({ 
  currentPage, 
  setCurrentPage, 
  isSidebarCollapsed, 
  toggleSidebar,
  userRole = 'cargo-buyer'
}) {
  // Role-specific navigation definitions
  const getNavItems = () => {
    switch (userRole) {
      case 'ship-owner':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'settings', label: 'Settings', icon: SettingsIcon },
        ];
      case 'port-operator':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'settings', label: 'Settings', icon: SettingsIcon },
        ];
      case 'cargo-buyer':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'new-analysis', label: 'New Analysis', icon: Compass },
          { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
          { id: 'history', label: 'History', icon: HistoryIcon },
          { id: 'settings', label: 'Settings', icon: SettingsIcon },
        ];
    }
  };

  const navItems = getNavItems();

  const getPortalInfo = () => {
    switch (userRole) {
      case 'ship-owner':
        return {
          portal: 'Ship Owner Portal',
          footer: 'Your Vessels.\nGlobal Opportunities.',
          icon: Ship
        };
      case 'port-operator':
        return {
          portal: 'Port Operator Portal',
          footer: 'Efficient Ports.\nSmoother Operations.',
          icon: Anchor
        };
      case 'cargo-buyer':
      default:
        return {
          portal: 'Cargo Buyer Portal',
          footer: 'Smarter data.\nBetter decisions.\nSustainable oceans.',
          icon: Package
        };
    }
  };

  const portalInfo = getPortalInfo();

  return (
    <aside className={`app-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div>
        {/* Brand Header */}
        <div 
          className="sidebar-brand" 
          onClick={isSidebarCollapsed ? toggleSidebar : () => setCurrentPage('dashboard')}
          title={isSidebarCollapsed ? "Expand Sidebar" : "FreightForecast"}
        >
          <div className="brand-icon-box">
            <Ship size={22} />
          </div>
          <div className="brand-info">
            <span className="brand-name">FreightForecast</span>
            <span className="brand-tagline" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
              {portalInfo.portal}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentPage(item.id)}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Graphic */}
      <div className="sidebar-footer">
        <div className="sidebar-ship-graphic">
          <svg width="42" height="28" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 28C14 26 22 32 32 30C42 28 50 34 60 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 3"/>
            <path d="M12 25L16 14H46L52 25H12Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/>
            <path d="M34 14V6M34 6H24M34 6H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <rect x="22" y="10" width="8" height="4" rx="1" fill="currentColor"/>
          </svg>
        </div>
        <p className="sidebar-footer-text" style={{ whiteSpace: 'pre-line' }}>
          {portalInfo.footer}
        </p>
      </div>
    </aside>
  );
}
