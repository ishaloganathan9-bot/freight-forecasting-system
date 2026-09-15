import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu,
  Bell, 
  Moon, 
  Sun, 
  ChevronDown, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Ship,
  Anchor,
  Package,
  LogOut,
  UserCheck,
  Settings as SettingsIcon
} from 'lucide-react';

export default function TopHeader({ 
  currentPage, 
  setCurrentPage, 
  theme, 
  toggleTheme,
  userRole = 'cargo-buyer',
  setUserRole,
  onOpenLogin,
  isSidebarCollapsed,
  toggleSidebar
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: "Forward Freight Rate Alert", desc: "Panamax rates projected to peak in Jan 2026 ($32/ton).", time: "25m ago", icon: AlertCircle, color: "#f59e0b" },
    { id: 2, title: "Port Congestion Clearance", desc: "Paradip Port draft clearance confirmed for 60,000+ DWT.", time: "1h ago", icon: CheckCircle2, color: "#10b981" },
    { id: 3, title: "Market Model Updated", desc: "Q3/Q4 historical Baltic index fixtures calibrated.", time: "3h ago", icon: CheckCircle2, color: "#38bdf8" },
  ];

  // Exactly 3 stakeholder roles as instructed: Ship Owner, Port Operator, Cargo Buyer
  const stakeholderOptions = [
    {
      id: 'ship-owner',
      label: 'Ship Owner',
      desc: 'Fleet & Charter Operations',
      icon: Ship,
      name: 'Oceanic Shipping Ltd.',
      avatar: 'SR',
      roleTag: 'Ship Owner'
    },
    {
      id: 'port-operator',
      label: 'Port Operator',
      desc: 'Berth Scheduling & Harbor',
      icon: Anchor,
      name: 'Paradip Port Authority',
      avatar: 'PO',
      roleTag: 'Port Operator'
    },
    {
      id: 'cargo-buyer',
      label: 'Cargo Buyer',
      desc: 'Dry Bulk Procurement & Rates',
      icon: Package,
      name: 'Freight Admin',
      avatar: 'IL',
      roleTag: 'Cargo Buyer'
    }
  ];

  const currentStakeholder = stakeholderOptions.find(s => s.id === userRole) || stakeholderOptions[2];

  return (
    <header className="top-header">
      {/* Left Menu Toggle & Back Navigation */}
      <div className="header-left">
        <button 
          type="button" 
          onClick={toggleSidebar}
          className="header-action-btn"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu size={18} />
        </button>

        {currentPage === 'dashboard' ? null : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              type="button" 
              onClick={() => setCurrentPage('dashboard')}
              className="back-btn"
            >
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
            <div className="header-title-box">
              <h1 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {currentPage === 'new-analysis' && 'Route & Vessel Analysis'}
                {currentPage === 'recommendations' && 'Recommendation Details'}
                {currentPage === 'history' && 'Past Analyses & Corridors'}
                {currentPage === 'settings' && 'Platform & Stakeholder Settings'}
              </h1>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="header-right">
        {/* Theme Switcher */}
        <button 
          type="button" 
          onClick={toggleTheme}
          className="header-action-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            onClick={() => setShowNotifications(!showNotifications)}
            className="header-action-btn"
            title="Notifications"
          >
            <Bell size={17} />
            <span className="notification-dot" />
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '320px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-card)',
              padding: '1rem',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Notifications (3)
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', cursor: 'pointer' }}>
                  Mark all as read
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div 
                      key={n.id} 
                      style={{ 
                        display: 'flex', 
                        gap: '0.6rem', 
                        padding: '0.5rem', 
                        borderRadius: 'var(--radius-sm)', 
                        background: 'var(--bg-card-subtle)',
                        fontSize: '0.75rem'
                      }}
                    >
                      <Icon size={16} style={{ color: n.color, flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{n.desc}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '2px' }}>{n.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip with Interactive Stakeholder Dropdown */}
        <div style={{ position: 'relative' }} ref={profileMenuRef}>
          <div 
            className="user-profile-chip" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <div className="user-avatar" style={{ fontWeight: 700 }}>
              {currentStakeholder.avatar}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.15 }}>
              <span className="user-name" style={{ fontWeight: 700 }}>
                {currentStakeholder.name}
              </span>
              <span style={{ fontSize: '0.66rem', color: 'var(--accent-cyan)' }}>
                {currentStakeholder.roleTag}
              </span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)', marginLeft: '4px' }} />
          </div>

          {/* Profile Dropdown: Stakeholder Selection (Only Ship Owner, Port Operator, Cargo Buyer) */}
          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '280px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-card)',
              padding: '0.85rem',
              zIndex: 200,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              <div style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                paddingBottom: '0.35rem',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                Select Your Stakeholder
              </div>

              {/* Stakeholder Selector Options - Strictly the 3 requested */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {stakeholderOptions.map((role) => {
                  const Icon = role.icon;
                  const isCurrent = userRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setUserRole(role.id);
                        setCurrentPage('dashboard');
                        setShowProfileMenu(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        border: isCurrent ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                        backgroundColor: isCurrent ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-card-subtle)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          backgroundColor: isCurrent ? 'var(--accent-blue)' : 'rgba(255,255,255,0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff'
                        }}>
                          <Icon size={14} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: isCurrent ? 700 : 600, color: isCurrent ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                            {role.label}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            {role.desc}
                          </div>
                        </div>
                      </div>
                      {isCurrent && <CheckCircle2 size={15} style={{ color: 'var(--accent-cyan)' }} />}
                    </button>
                  );
                })}
              </div>

              {/* Menu Actions */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.5rem',
                marginTop: '0.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage('settings');
                    setShowProfileMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <SettingsIcon size={14} />
                  <span>Profile & Stakeholder Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onOpenLogin) onOpenLogin();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--accent-rose)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <LogOut size={14} />
                  <span>Sign Out / Switch Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
