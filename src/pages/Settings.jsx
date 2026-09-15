import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Sliders, 
  Bell, 
  Globe, 
  Save, 
  Check, 
  Ship, 
  Anchor, 
  Package, 
  CheckCircle2,
  LogOut
} from 'lucide-react';

export default function Settings({ theme, toggleTheme, userRole = 'cargo-buyer', setUserRole, onLogout }) {
  const [name, setName] = useState(
    userRole === 'ship-owner' ? 'Oceanic Shipping Operations' :
    userRole === 'port-operator' ? 'Paradip Port Authority Admin' : 'Freight Admin'
  );
  const [email, setEmail] = useState(
    userRole === 'ship-owner' ? 'chartering@oceanic-shipping.com' :
    userRole === 'port-operator' ? 'ops.berth@paradip-port.gov.in' : 'rajesh.sharma@sail.in'
  );
  const [currency, setCurrency] = useState('USD');
  const [units, setUnits] = useState('metric');
  const [saved, setSaved] = useState(false);

  // Exactly 3 stakeholder roles: Ship Owner, Port Operator, Cargo Buyer
  const roles = [
    {
      id: 'ship-owner',
      label: 'Ship Owner',
      desc: 'Fleet management, vessel routes, charter requests & fixtures',
      icon: Ship
    },
    {
      id: 'port-operator',
      label: 'Port Operator',
      desc: 'Berth scheduling, Gantt operations, waiting time & congestion',
      icon: Anchor
    },
    {
      id: 'cargo-buyer',
      label: 'Cargo Buyer',
      desc: 'Dry bulk intelligence, forward rate forecasts & fixtures',
      icon: Package
    }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="content-area">
      <div className="panel-box" style={{ maxWidth: '820px', margin: '0 auto', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <SettingsIcon size={20} style={{ color: 'var(--accent-cyan)' }} />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Profile & Stakeholder Settings
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Configure your stakeholder portal role, profile details, and system preferences.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.95rem',
              color: '#f43f5e',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={15} />
            <span>Log Out</span>
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Section 0: Select Your Stakeholders (Only Ship Owner, Port Operator, Cargo Buyer) */}
          <div>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} style={{ color: 'var(--accent-cyan)' }} />
              <span>Select Your Stakeholder Role</span>
            </h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              Switch your active operational portal across dry bulk maritime stakeholders:
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.85rem'
            }}>
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = userRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      if (setUserRole) setUserRole(r.id);
                    }}
                    style={{
                      border: isSelected ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg-card-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isSelected ? 'var(--accent-blue)' : 'rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}>
                        <Icon size={16} />
                      </div>
                      {isSelected && <CheckCircle2 size={16} style={{ color: 'var(--accent-cyan)' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                        {r.label}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>
                        {r.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 1: User Profile Details */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Account Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="fast-input-field">
                <label>Display Name / Entity</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div className="fast-input-field">
                <label>Official Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Model & Market Data Parameters */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={16} style={{ color: '#10b981' }} />
              <span>Model & Regional Parameters</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div className="fast-input-field">
                <label>Default Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div className="fast-input-field">
                <label>Tonnage Measurement</label>
                <select value={units} onChange={(e) => setUnits(e.target.value)}>
                  <option value="metric">Metric Tonnes (MT)</option>
                  <option value="long">Long Tons (LT)</option>
                </select>
              </div>

              <div className="fast-input-field">
                <label>Theme Mode</label>
                <button 
                  type="button" 
                  onClick={toggleTheme}
                  style={{
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                >
                  {theme === 'dark' ? 'Oceanic Dark Mode' : 'Clean Light Mode'}
                </button>
              </div>
            </div>
          </div>

          {/* Save & Log Out Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <button 
              type="button"
              onClick={onLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'transparent',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 1.15rem',
                color: '#f43f5e',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={15} />
              <span>Log Out to Login Screen</span>
            </button>

            <button type="submit" className="fast-submit-btn" style={{ margin: 0 }}>
              {saved ? <Check size={16} /> : <Save size={16} />}
              <span>{saved ? 'Settings Updated!' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
