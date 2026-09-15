import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  MapPin, 
  Box, 
  Layers, 
  Calendar, 
  Edit3, 
  Play, 
  Ship, 
  Clock, 
  ShieldCheck, 
  CloudSun, 
  Anchor,
  ArrowRight,
  Navigation
} from 'lucide-react';
import InteractiveRouteMap from '../components/InteractiveRouteMap';
import { defaultAnalysisData, runFreightAnalysis } from '../services/api';

const ANALYSIS_STAGES = [
  'Reviewing bulk cargo requirements & tonnage specifications...',
  'Querying corridor bunker prices & historical Baltic rate fixtures...',
  'Computing forward econometric rate projections...',
  'Synthesizing chartering decision support recommendation...'
];

export default function NewAnalysis({ setCurrentPage, analysisData, setAnalysisData }) {
  const data = analysisData || defaultAnalysisData;

  const [selectedVessel, setSelectedVessel] = useState('panamax');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    cargo: data.input.cargo || 'Bulk Commodity',
    quantity: data.input.quantity || 50000,
    origin: data.input.origin || 'Australia',
    destination: data.input.destination || 'Paradip Port, India',
    deadline: data.input.deadline || 'Next 3 Months',
    contract: data.input.contract || 'Short-term Spot',
    priority: data.input.priority || 'Balanced'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    let timer;
    if (isLoading && stageIndex < ANALYSIS_STAGES.length - 1) {
      timer = setTimeout(() => {
        setStageIndex((prev) => prev + 1);
      }, 700);
    }
    return () => clearTimeout(timer);
  }, [isLoading, stageIndex]);

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setStageIndex(0);

    try {
      const result = await runFreightAnalysis(formData, true);
      // Ensure the user's selected vessel is honored
      const updatedResult = {
        ...result,
        metrics: {
          ...result.metrics,
          recommended_vessel: selectedVessel.charAt(0).toUpperCase() + selectedVessel.slice(1)
        }
      };

      setTimeout(() => {
        setIsLoading(false);
        setAnalysisData(updatedResult);
        setCurrentPage('recommendations');
      }, 3000);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  const vesselCards = [
    {
      id: 'handysize',
      name: 'Handysize',
      capacity: '25,000 – 45,000 DWT',
      cost: '$1.35M',
      suitability: 'Good',
      statusClass: 'good'
    },
    {
      id: 'supramax',
      name: 'Supramax',
      capacity: '50,000 – 60,000 DWT',
      cost: '$1.25M',
      suitability: 'Good',
      statusClass: 'good'
    },
    {
      id: 'panamax',
      name: 'Panamax',
      capacity: '60,000 – 80,000 DWT',
      cost: '$1.32M',
      suitability: 'Excellent',
      statusClass: 'excellent',
      isRecommended: true
    },
    {
      id: 'capesize',
      name: 'Capesize',
      capacity: '100,000+ DWT',
      cost: '$1.46M',
      suitability: 'Moderate',
      statusClass: 'moderate'
    }
  ];

  return (
    <div className="content-area">
      {/* 1. Stepper Wizard Bar matching reference design */}
      <div className="stepper-wizard">
        <div className="step-node completed" onClick={() => setIsEditing(true)}>
          <div className="step-badge">
            <CheckCircle2 size={14} />
          </div>
          <span>1. Route & Cargo</span>
        </div>

        <div className="step-divider" />

        <div className="step-node active">
          <div className="step-badge">2</div>
          <span>2. Vessel Options</span>
        </div>

        <div className="step-divider" />

        <div className="step-node">
          <div className="step-badge">3</div>
          <span>3. Analysis</span>
        </div>

        <div className="step-divider" />

        <div className="step-node">
          <div className="step-badge">4</div>
          <span>4. Recommendation</span>
        </div>
      </div>

      {/* Progressive Stage Loader Overlay when Running */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 17, 30, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 2.5rem',
            width: '460px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Loader2 className="animate-spin" size={24} style={{ color: 'var(--accent-cyan)' }} />
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Processing Market Intelligence
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Running Baltic Index fixtures & econometric regressions...
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ANALYSIS_STAGES.map((desc, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.78rem' }}>
                  {idx < stageIndex ? (
                    <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                  ) : idx === stageIndex ? (
                    <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '16px', height: '16px', borderRadius: '999px', border: '1px solid var(--border-subtle)', flexShrink: 0 }} />
                  )}
                  <span style={{ color: idx <= stageIndex ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Main 2-Column Split: Left Input Panel + Large Map Panel */}
      <div className="analysis-page-grid">
        {/* Left Column: Input Details Panel */}
        <div className="analysis-input-panel">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Input Details
              </span>
              <button 
                type="button" 
                onClick={() => setIsEditing(!isEditing)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--accent-cyan)', 
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Edit3 size={13} />
                <span>{isEditing ? 'Done' : 'Edit'}</span>
              </button>
            </div>

            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                <div className="fast-input-field">
                  <label>Cargo Type</label>
                  <select 
                    value={formData.cargo} 
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  >
                    <option value="Bulk Commodity">Bulk Commodity</option>
                    <option value="Thermal Coal">Thermal Coal</option>
                    <option value="Iron Ore Fines">Iron Ore Fines</option>
                    <option value="Grain">Grain</option>
                  </select>
                </div>

                <div className="fast-input-field">
                  <label>Quantity (tonnes)</label>
                  <input 
                    type="number" 
                    value={formData.quantity} 
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>

                <div className="fast-input-field">
                  <label>Origin</label>
                  <input 
                    type="text" 
                    value={formData.origin} 
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  />
                </div>

                <div className="fast-input-field">
                  <label>Destination</label>
                  <input 
                    type="text" 
                    value={formData.destination} 
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  />
                </div>

                <div className="fast-input-field">
                  <label>Preferred Period</label>
                  <select 
                    value={formData.deadline} 
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  >
                    <option value="Next 3 Months">Next 3 Months</option>
                    <option value="Next 6 Months">Next 6 Months</option>
                    <option value="Prompt / Spot">Prompt / Spot</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="input-details-list">
                <div className="input-detail-row">
                  <div className="input-detail-icon">
                    <Box size={16} />
                  </div>
                  <div className="input-detail-meta">
                    <span className="input-detail-label">Cargo Type</span>
                    <span className="input-detail-value">{formData.cargo}</span>
                  </div>
                </div>

                <div className="input-detail-row">
                  <div className="input-detail-icon">
                    <Layers size={16} />
                  </div>
                  <div className="input-detail-meta">
                    <span className="input-detail-label">Quantity</span>
                    <span className="input-detail-value">{Number(formData.quantity).toLocaleString()} tonnes</span>
                  </div>
                </div>

                <div className="input-detail-row">
                  <div className="input-detail-icon">
                    <MapPin size={16} />
                  </div>
                  <div className="input-detail-meta">
                    <span className="input-detail-label">Origin</span>
                    <span className="input-detail-value">{formData.origin}</span>
                  </div>
                </div>

                <div className="input-detail-row">
                  <div className="input-detail-icon">
                    <Anchor size={16} />
                  </div>
                  <div className="input-detail-meta">
                    <span className="input-detail-label">Destination</span>
                    <span className="input-detail-value">{formData.destination}</span>
                  </div>
                </div>

                <div className="input-detail-row">
                  <div className="input-detail-icon">
                    <Calendar size={16} />
                  </div>
                  <div className="input-detail-meta">
                    <span className="input-detail-label">Preferred Period</span>
                    <span className="input-detail-value">{formData.deadline}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            type="button" 
            onClick={handleRunAnalysis}
            className="run-analysis-btn"
          >
            <Play size={16} fill="currentColor" />
            <span>Run Analysis</span>
          </button>
        </div>

        {/* Right Column: Large Interactive Map Panel */}
        <div className="large-map-panel">
          <div className="large-map-svg-area">
            <InteractiveRouteMap height={380} routeDetails={data.route_details} />
          </div>

          {/* Floating Route Details Overlay Card repositioned to not overlap route */}
          <div className="map-route-overlay-box" style={{ left: '1.25rem', right: 'auto', top: '1.25rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
              Route Details
            </span>

            <div className="route-stat-item">
              <Navigation size={15} style={{ color: 'var(--accent-cyan)' }} />
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Distance</div>
                <strong>~6,800 NM</strong>
              </div>
            </div>

            <div className="route-stat-item">
              <Clock size={15} style={{ color: '#f59e0b' }} />
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Est. Transit Time</div>
                <strong>{data.route_details.transit_time}</strong>
              </div>
            </div>

            <div className="route-stat-item">
              <ShieldCheck size={15} style={{ color: '#10b981' }} />
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Port Conditions</div>
                <strong>{data.route_details.port_conditions}</strong>
              </div>
            </div>

            <div className="route-stat-item">
              <CloudSun size={15} style={{ color: 'var(--accent-cyan)' }} />
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Weather Risk</div>
                <strong>{data.route_details.weather_risk}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Available Vessel Options Cards */}
      <div className="vessel-options-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Available Vessel Options
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Select a vessel class to inspect chartering economics and compatibility for {formData.destination}.
            </p>
          </div>

          <button 
            type="button" 
            onClick={() => setCurrentPage('recommendations')} 
            className="panel-link"
          >
            <span>Compare All</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="vessel-cards-row">
          {vesselCards.map((vessel) => {
            const isSelected = selectedVessel === vessel.id;
            return (
              <div 
                key={vessel.id}
                onClick={() => setSelectedVessel(vessel.id)}
                className={`vessel-select-card ${isSelected ? 'selected' : ''}`}
              >
                <div className="vessel-card-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Ship size={18} style={{ color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)' }} />
                    <span className="vessel-name-title">{vessel.name}</span>
                  </div>
                  <span className={`suitability-pill ${vessel.statusClass}`}>
                    {vessel.suitability}
                  </span>
                </div>

                <span className="vessel-capacity-sub">{vessel.capacity}</span>

                <div className="vessel-card-metrics">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="vessel-cost-label">Est. Cost</span>
                    <span className="vessel-cost-val">{vessel.cost}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                    <span>{isSelected ? 'Selected' : 'Select'}</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}