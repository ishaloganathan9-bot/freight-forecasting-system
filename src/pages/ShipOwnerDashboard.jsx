import React, { useState } from 'react';
import { 
  Ship, 
  FileText, 
  Clock, 
  DollarSign, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Navigation, 
  Edit2, 
  TrendingUp,
  MapPin,
  ExternalLink,
  Loader2
} from 'lucide-react';

export default function ShipOwnerDashboard({ setCurrentPage }) {
  const [selectedRouteVessel, setSelectedRouteVessel] = useState('MV Ocean Star');
  const [showAddModal, setShowAddModal] = useState(false);
  const [imoVerified, setImoVerified] = useState(false);
  const [imoVerifying, setImoVerifying] = useState(false);
  const [imoError, setImoError] = useState('');
  const [vessels, setVessels] = useState([
    { name: 'MV Ocean Star', imo: 'IMO 9234567', dwt: '50,000', draft: '13.2', loa: '189', beam: '32.4', status: 'Available' },
    { name: 'MV Blue Horizon', imo: 'IMO 9345678', dwt: '38,000', draft: '11.8', loa: '178', beam: '28.6', status: 'On Charter' },
    { name: 'MV Coral Queen', imo: 'IMO 9456789', dwt: '76,000', draft: '15.6', loa: '225', beam: '36.2', status: 'Available' },
    { name: 'MV Sunrise', imo: 'IMO 9567890', dwt: '60,000', draft: '14.9', loa: '210', beam: '34.8', status: 'Available' },
    { name: 'MV Pacific Wind', imo: 'IMO 9678901', dwt: '82,000', draft: '16.8', loa: '240', beam: '38.5', status: 'On Charter' }
  ]);

  const [newVessel, setNewVessel] = useState({
    name: '',
    imo: '9483721',
    dwt: '',
    draft: '',
    loa: '',
    beam: '',
    status: 'Available'
  });

  const handleVerifyImo = () => {
    if (!newVessel.imo || newVessel.imo.trim().length < 5) {
      setImoError('Please enter a valid 7-digit IMO number');
      return;
    }
    setImoError('');
    setImoVerifying(true);
    setTimeout(() => {
      setImoVerifying(false);
      setImoVerified(true);
      // Auto-populate registry specs if empty
      setNewVessel(prev => ({
        ...prev,
        name: prev.name || 'MV Atlantic Carrier',
        dwt: prev.dwt || '65,000',
        draft: prev.draft || '14.2',
        loa: prev.loa || '215',
        beam: prev.beam || '35.0'
      }));
    }, 600);
  };

  const handleAddVessel = (e) => {
    e.preventDefault();
    if (!newVessel.name) return;
    if (!imoVerified) {
      setImoError('Please verify the IMO number before saving the vessel.');
      return;
    }
    setVessels([...vessels, { ...newVessel, imo: `IMO ${newVessel.imo}` }]);
    setShowAddModal(false);
    setNewVessel({ name: '', imo: '9483721', dwt: '', draft: '', loa: '', beam: '', status: 'Available' });
    setImoVerified(false);
    setImoError('');
  };

  return (
    <div className="content-area">
      {/* Hero Banner with Oceanic Aesthetic */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: '1.5rem',
        border: '1px solid var(--border-card)',
        minHeight: '130px',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #071524 0%, rgba(7, 21, 36, 0.9) 45%, rgba(7, 21, 36, 0.4) 100%)'
      }}>
        <img 
          src="/assets/bulk_carrier_sunset.jpg" 
          alt="Fleet operations" 
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '60%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: 0.65
          }} 
        />
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '65%',
          background: 'linear-gradient(90deg, #071524 60%, rgba(7, 21, 36, 0.9) 80%, transparent 100%)',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, padding: '1.5rem 2rem', maxWidth: '640px' }}>
          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '0.35rem'
          }}>
            Manage Your Fleet, Grow Your Business
          </h1>
          <p style={{
            fontSize: '0.84rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.4
          }}>
            List your vessels, find charter opportunities and track your voyages – all in one place.
          </p>
        </div>

        <div style={{
          position: 'absolute',
          right: '2rem',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          color: 'rgba(255, 255, 255, 0.85)',
          fontSize: '0.78rem',
          fontWeight: 600,
          textShadow: '0 2px 4px rgba(0,0,0,0.6)'
        }}>
          <span>More Charter Opportunities</span>
          <span>More Voyages</span>
          <span>More Growth</span>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* KPI 1 */}
        <div className="panel-box" style={{ padding: '1.15rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <Ship size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Total Vessels
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                8
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>2 Available</span> &nbsp;|&nbsp; 6 On Charter
              </div>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="panel-box" style={{ padding: '1.15rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(168, 85, 247, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-purple)'
            }}>
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Active Charter Requests
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                5
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>3 New</span> &nbsp;|&nbsp; 2 Under Review
              </div>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="panel-box" style={{ padding: '1.15rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Ongoing Voyages
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                6
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                3 Departed &nbsp;|&nbsp; <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>3 Enroute</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="panel-box" style={{ padding: '1.15rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)'
            }}>
              <DollarSign size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Total Earnings (MTD)
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>$1.25M</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>↑ 12%</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                vs previous cycle
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Fleet/Routes (62%) & Right Charters/Activity (38%) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.55fr 1fr',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* My Vessels Table */}
          <div className="panel-box" style={{ padding: '1.25rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ship size={16} style={{ color: 'var(--accent-cyan)' }} />
                <span>My Vessels</span>
              </h2>
              <button 
                type="button" 
                onClick={() => alert('Viewing all 8 registered vessels in your fleet.')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.78rem',
                textAlign: 'left'
              }}>
                <thead>
                  <tr style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.72rem'
                  }}>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>Vessel Name</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>IMO Number</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>DWT</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>Draft (m)</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>LOA (m)</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>Beam (m)</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>Availability</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vessels.map((v, i) => (
                    <tr 
                      key={i}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-card-subtle)'
                      }}
                    >
                      <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {v.name}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-muted)' }}>
                        {v.imo}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-primary)' }}>
                        {v.dwt}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-primary)' }}>
                        {v.draft}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-primary)' }}>
                        {v.loa}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-primary)' }}>
                        {v.beam}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>
                        <span style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          backgroundColor: v.status === 'Available' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: v.status === 'Available' ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                          display: 'inline-block'
                        }}>
                          {v.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => alert(`Edit specifications for ${v.name}`)}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.25rem 0.55rem',
                            color: 'var(--text-secondary)',
                            fontSize: '0.7rem',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Vessel Button */}
            <div style={{ marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                style={{
                  backgroundColor: 'var(--accent-blue)',
                  backgroundImage: 'linear-gradient(135deg, #1d68ff 0%, #1652cc 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.55rem 1rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: 'var(--nav-active-shadow)'
                }}
              >
                <Plus size={15} />
                <span>Add New Vessel</span>
              </button>
            </div>
          </div>

          {/* Vessel Routes Section */}
          <div className="panel-box" style={{ padding: '1.25rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.85rem'
            }}>
              <div>
                <h2 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Vessel Routes
                </h2>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Live sea corridor navigation tracking to destination port
                </p>
              </div>

              <select
                value={selectedRouteVessel}
                onChange={(e) => setSelectedRouteVessel(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  outline: 'none'
                }}
              >
                <option value="All Vessels">All Vessels</option>
                <option value="MV Ocean Star">MV Ocean Star</option>
                <option value="MV Blue Horizon">MV Blue Horizon</option>
                <option value="MV Coral Queen">MV Coral Queen</option>
              </select>
            </div>

            {/* Oceanic Multi-Vessel SVG Map */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '310px',
              backgroundColor: '#04101e',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)',
              overflow: 'hidden'
            }}>
              <svg 
                viewBox="0 0 680 340" 
                style={{ width: '100%', height: '100%', display: 'block' }}
              >
                <defs>
                  <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0a2540" />
                    <stop offset="100%" stopColor="#040e1b" />
                  </radialGradient>
                  <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="glow" />
                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                  </filter>
                </defs>

                {/* Ocean Background & Graticules */}
                <rect width="680" height="340" fill="url(#oceanGlow)" />
                <path d="M 0,85 L 680,85 M 0,170 L 680,170 M 0,255 L 680,255" stroke="rgba(56,189,248,0.06)" strokeDasharray="3 4" />
                <path d="M 170,0 L 170,340 M 340,0 L 340,340 M 510,0 L 510,340" stroke="rgba(56,189,248,0.06)" strokeDasharray="3 4" />

                {/* Landmass Simplifications (India, SE Asia, Australia) */}
                {/* Indian Subcontinent */}
                <path 
                  d="M 440,40 L 490,40 L 520,80 L 505,120 L 485,150 L 470,125 L 455,95 Z" 
                  fill="#11253a" 
                  stroke="#1e3a5f" 
                  strokeWidth="1.2" 
                />
                <text x="475" y="80" fill="#94a3b8" fontSize="10" fontWeight="700">India</text>

                {/* Paradip Port Destination Pin */}
                <circle cx="496" cy="112" r="5" fill="#f43f5e" filter="url(#routeGlow)" />
                <circle cx="496" cy="112" r="10" fill="none" stroke="#f43f5e" strokeWidth="1.5" opacity="0.6" />
                <text x="508" y="112" fill="#ffffff" fontSize="11" fontWeight="800">Paradip</text>
                <text x="508" y="124" fill="#38bdf8" fontSize="9" fontWeight="600">(India)</text>

                {/* Australia */}
                <path 
                  d="M 490,260 L 610,240 L 640,290 L 590,335 L 510,320 Z" 
                  fill="#11253a" 
                  stroke="#1e3a5f" 
                  strokeWidth="1.2" 
                />
                <text x="550" y="295" fill="#94a3b8" fontSize="11" fontWeight="700">Australia</text>

                {/* Indonesia Islands */}
                <path d="M 430,200 Q 480,210 530,205" stroke="#1e3a5f" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
                <text x="440" y="218" fill="#64748b" fontSize="8">Indonesia</text>

                {/* Route 1: MV Ocean Star (Blue Route from Australia Hay Point to Paradip) */}
                <path 
                  d="M 545,255 C 500,230 460,210 445,180 C 440,155 465,135 496,112" 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="2.5" 
                  strokeDasharray="5 5" 
                  filter="url(#routeGlow)" 
                />
                {/* Ship 1 Marker */}
                <circle cx="452" cy="188" r="4.5" fill="#38bdf8" />

                {/* Route 2: MV Blue Horizon (Cyan Route) */}
                <path 
                  d="M 525,270 C 485,245 440,225 430,195 C 425,160 455,135 496,112" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="2" 
                  strokeDasharray="4 4" 
                  opacity="0.85" 
                />
                {/* Ship 2 Marker */}
                <circle cx="478" cy="155" r="4" fill="#10b981" />

                {/* Route 3: MV Coral Queen (Amber Route) */}
                <path 
                  d="M 560,265 C 515,240 480,220 460,190 C 450,165 470,140 496,112" 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="2" 
                  strokeDasharray="4 4" 
                  opacity="0.85" 
                />
                {/* Ship 3 Marker */}
                <circle cx="505" cy="225" r="4" fill="#f59e0b" />
              </svg>

              {/* Waypoint Card Overlaid */}
              <div style={{
                position: 'absolute',
                left: '1.25rem',
                top: '1.25rem',
                backgroundColor: 'rgba(7, 21, 36, 0.88)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.85rem',
                fontSize: '0.72rem',
                boxShadow: 'var(--shadow-card)'
              }}>
                <div style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  MV Ocean Star
                </div>
                <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>
                  Australia → Paradip
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: '2px' }}>
                  Duration: 28 days
                </div>
              </div>

              {/* Bottom Map Legend / Vessel Selectors */}
              <div style={{
                position: 'absolute',
                bottom: '0.75rem',
                left: '1rem',
                right: '1rem',
                display: 'flex',
                gap: '1.25rem',
                backgroundColor: 'rgba(7, 21, 36, 0.75)',
                backdropFilter: 'blur(4px)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.72rem'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
                  MV Ocean Star
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  MV Blue Horizon
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                  MV Coral Queen
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Current Charter Requests */}
          <div className="panel-box" style={{ padding: '1.25rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <FileText size={16} style={{ color: 'var(--accent-cyan)' }} />
                <span>Current Charter Requests</span>
              </h2>
              <span 
                onClick={() => alert('All charter opportunities currently matching your fleet specifications.')}
                style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 600 }}
              >
                View All →
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Request 1 */}
              <div style={{
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
                display: 'flex',
                gap: '0.75rem'
              }}>
                <img 
                  src="/assets/panamax_vessel.jpg" 
                  alt="Bulk fixture" 
                  style={{ width: '64px', height: '54px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                      Bulk Cargo — Australia → Paradip
                    </div>
                    <span style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      color: 'var(--accent-amber)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '999px'
                    }}>
                      + New
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    50,000 DWT | 27 Nov 2025
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                    <button 
                      type="button" 
                      onClick={() => alert('Viewing cargo fixture specifications & laycan dates.')}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.68rem',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      View Details
                    </button>
                    <button 
                      type="button" 
                      onClick={() => alert('Submitting freight rate offer for 50,000 DWT parcel.')}
                      style={{
                        backgroundColor: 'var(--accent-blue)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.3rem 0.75rem',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      Respond
                    </button>
                  </div>
                </div>
              </div>

              {/* Request 2 */}
              <div style={{
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
                display: 'flex',
                gap: '0.75rem'
              }}>
                <img 
                  src="/assets/bulk_carrier_sunset.jpg" 
                  alt="Iron Ore" 
                  style={{ width: '64px', height: '54px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                      Iron Ore — Brazil → Vizag
                    </div>
                    <span style={{
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '999px'
                    }}>
                      Pending
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    45,000 DWT | 10 Dec 2025
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                    <button 
                      type="button" 
                      onClick={() => alert('Viewing cargo fixture specifications & laycan dates.')}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.68rem',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      View Details
                    </button>
                    <button 
                      type="button" 
                      onClick={() => alert('Submitting freight rate offer for 45,000 DWT parcel.')}
                      style={{
                        backgroundColor: 'var(--accent-blue)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.3rem 0.75rem',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      Respond
                    </button>
                  </div>
                </div>
              </div>

              {/* Request 3 */}
              <div style={{
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
                display: 'flex',
                gap: '0.75rem'
              }}>
                <img 
                  src="/assets/panamax_vessel.jpg" 
                  alt="Coal" 
                  style={{ width: '64px', height: '54px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                      Coal — Indonesia → Haldia
                    </div>
                    <span style={{
                      backgroundColor: 'rgba(168, 85, 247, 0.15)',
                      color: 'var(--accent-purple)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '999px'
                    }}>
                      Under Review
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    60,000 DWT | 20 Dec 2025
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                    <button 
                      type="button" 
                      onClick={() => alert('Viewing cargo fixture specifications & laycan dates.')}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.68rem',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      View Details
                    </button>
                    <button 
                      type="button" 
                      onClick={() => alert('Submitting freight rate offer for 60,000 DWT parcel.')}
                      style={{
                        backgroundColor: 'var(--accent-blue)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.3rem 0.75rem',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      Respond
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="panel-box" style={{ padding: '1.25rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Recent Activity
              </h2>
              <span 
                onClick={() => alert('Complete chartering activity log.')}
                style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 600 }}
              >
                View All →
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    Your offer for Bulk Cargo (Australia → Paradip) was accepted.
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    2 hours ago
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                <AlertCircle size={16} style={{ color: 'var(--accent-cyan)', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    New charter request received — Iron Ore (Brazil → Vizag).
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    4 hours ago
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                <Ship size={16} style={{ color: 'var(--accent-purple)', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    Vessel MV Blue Horizon updated availability.
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    1 day ago
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Vessel Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '500px',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-card)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Add New Vessel to Fleet
            </h3>

            <form onSubmit={handleAddVessel} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Vessel Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MV Atlantic Carrier"
                  value={newVessel.name}
                  onChange={(e) => setNewVessel({ ...newVessel, name: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    IMO Number
                  </label>
                  <div style={{ display: 'flex', gap: '0.45rem' }}>
                    <input
                      type="text"
                      required
                      placeholder="9483721"
                      value={newVessel.imo}
                      onChange={(e) => {
                        setNewVessel({ ...newVessel, imo: e.target.value });
                        setImoVerified(false);
                        setImoError('');
                      }}
                      style={{ 
                        flex: 1, 
                        padding: '0.55rem 0.75rem', 
                        borderRadius: 'var(--radius-sm)', 
                        border: imoVerified ? '1px solid #10b981' : '1px solid var(--border-subtle)', 
                        background: 'var(--bg-app)', 
                        color: 'var(--text-primary)',
                        fontSize: '0.8rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyImo}
                      style={{
                        backgroundColor: imoVerified ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card-subtle)',
                        border: imoVerified ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                        color: imoVerified ? '#10b981' : 'var(--text-primary)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.55rem 0.85rem',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {imoVerifying ? (
                        <Loader2 size={13} className="spin" />
                      ) : imoVerified ? (
                        <>
                          <CheckCircle2 size={13} />
                          <span>Verified</span>
                        </>
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>
                  {imoVerified && (
                    <div style={{ fontSize: '0.67rem', color: '#10b981', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={11} />
                      <span>IMO validated in Equasis registry</span>
                    </div>
                  )}
                  {imoError && (
                    <div style={{ fontSize: '0.67rem', color: '#f43f5e', marginTop: '0.25rem' }}>
                      {imoError}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    DWT (MT)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="65,000"
                    value={newVessel.dwt}
                    onChange={(e) => setNewVessel({ ...newVessel, dwt: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Draft (m)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="14.2"
                    value={newVessel.draft}
                    onChange={(e) => setNewVessel({ ...newVessel, draft: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    LOA (m)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="215"
                    value={newVessel.loa}
                    onChange={(e) => setNewVessel({ ...newVessel, loa: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Beam (m)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="35.0"
                    value={newVessel.beam}
                    onChange={(e) => setNewVessel({ ...newVessel, beam: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.55rem 1rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--accent-blue)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.55rem 1.15rem',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Save Vessel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
