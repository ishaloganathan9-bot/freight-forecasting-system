import React, { useState } from 'react';
import { 
  TrendingUp, 
  Ship, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  Navigation,
  Clock, 
  Box, 
  FileText, 
  Sparkles, 
  Layers, 
  Calendar,
  CheckCircle,
  BarChart2,
  ExternalLink,
  Leaf
} from 'lucide-react';
import ForecastChart from '../components/ForecastChart';
import InteractiveRouteMap from '../components/InteractiveRouteMap';
import { defaultAnalysisData, generateMockResponse } from '../services/api';

export default function Dashboard({ setCurrentPage, analysisData, setAnalysisData }) {
  const data = analysisData || defaultAnalysisData;

  // Fast-analysis quick state
  const [cargoType, setCargoType] = useState(data.input.cargo || 'Bulk Commodity');
  const [origin, setOrigin] = useState(data.input.origin || 'Australia');
  const [destination, setDestination] = useState(data.input.destination || 'Paradip Port, India');
  const [period, setPeriod] = useState(data.input.deadline || 'Next 3 Months');
  const [quantity, setQuantity] = useState(data.input.quantity || 50000);

  const handleQuickAnalysis = (e) => {
    e.preventDefault();
    const updated = generateMockResponse({
      cargo: cargoType,
      origin: origin,
      destination: destination,
      deadline: period,
      quantity: quantity
    });
    setAnalysisData(updated);
    setCurrentPage('recommendations');
  };

  return (
    <div className="content-area">
      {/* 1. Hero Banner with Ship Photo & Quick Formulation */}
      <div className="dashboard-hero-banner">
        <div className="hero-banner-text">
          <div>
            <h2 className="hero-greeting-title">
              Intelligent Freight Forecasting & Chartering Decision System
            </h2>
            <p className="hero-greeting-sub">
              From data to decisions &mdash; optimize your vessel chartering and bulk cargo procurement.
            </p>
          </div>

          {/* Inline Rapid Procurement Form */}
          <form onSubmit={handleQuickAnalysis}>
            <div className="fast-analysis-row">
              <div className="fast-input-field">
                <label>Cargo Type</label>
                <select value={cargoType} onChange={(e) => setCargoType(e.target.value)}>
                  <option value="Bulk Commodity">Bulk Commodity</option>
                  <option value="Thermal Coal">Thermal Coal</option>
                  <option value="Iron Ore Fines">Iron Ore Fines</option>
                  <option value="Grain / Agri">Grain / Agri</option>
                  <option value="Bauxite">Bauxite</option>
                </select>
              </div>

              <div className="fast-input-field">
                <label>Origin</label>
                <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
                  <option value="Australia">Australia</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Qatar">Qatar</option>
                  <option value="South Africa">South Africa</option>
                </select>
              </div>

              <div className="fast-input-field">
                <label>Destination</label>
                <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                  <option value="Paradip Port, India">Paradip Port, India</option>
                  <option value="Visakhapatnam, India">Visakhapatnam, India</option>
                  <option value="Chennai, India">Chennai, India</option>
                  <option value="Qingdao, China">Qingdao, China</option>
                </select>
              </div>

              <div className="fast-input-field">
                <label>Preferred Period</label>
                <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                  <option value="Next 3 Months">Next 3 Months</option>
                  <option value="Next 6 Months">Next 6 Months</option>
                  <option value="Prompt / Spot">Prompt / Spot</option>
                </select>
              </div>

              <div className="fast-input-field">
                <label>Quantity (tonnes)</label>
                <input 
                  type="number" 
                  value={quantity} 
                  step="5000"
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="fast-submit-btn" style={{ width: '100%', margin: 0 }}>
                  <span>Get Recommendation</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="hero-banner-image">
          <img 
            src="/assets/bulk_carrier_sunset.jpg" 
            alt="Commercial Bulk Carrier Vessel"
            onError={(e) => { e.target.src = '/tall-ship.jpg'; }}
          />
        </div>
      </div>

      {/* 2. Expanded Landscape Freight Rate Forecast Section */}
      <div className="dashboard-analytics-grid">
        <div className="panel-box" style={{ width: '100%', minHeight: '380px' }}>
          <div className="panel-header-row">
            <div className="panel-title">
              <TrendingUp size={16} style={{ color: 'var(--accent-cyan)' }} />
              <span>Freight Rate Forecast</span>
            </div>
            <button 
              type="button" 
              onClick={() => setCurrentPage('recommendations')} 
              className="panel-link"
            >
              <span>View Details</span>
              <ArrowRight size={13} />
            </button>
          </div>
          <ForecastChart historicalRates={data.historical_rates} />
        </div>
      </div>

      {/* 4. Recent Analyses Table (Images 2 & 3) */}
      <div className="panel-box" style={{ marginBottom: '1.5rem' }}>
        <div className="panel-header-row">
          <div className="panel-title">
            <Layers size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span>Recent Corridor Analyses</span>
          </div>
          <button 
            type="button" 
            onClick={() => setCurrentPage('history')} 
            className="panel-link"
          >
            <span>View All ({data.recent_analyses.length})</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Corridor Route</th>
                <th>Cargo Quantity</th>
                <th>Recommended Vessel</th>
                <th>Forecast Trend</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_analyses.map((row, idx) => (
                <tr key={idx} className={idx === 0 ? 'highlighted-row' : ''}>
                  <td>{row.date}</td>
                  <td><strong>{row.route}</strong></td>
                  <td>{row.cargo} MT</td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.vessel}</span>
                    {idx === 0 && <span className="matrix-badge-recommended">Optimal</span>}
                  </td>
                  <td>
                    <span style={{ 
                      color: row.trendDir === 'up' ? '#10b981' : (row.trendDir === 'down' ? '#f43f5e' : '#f59e0b'),
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      {row.trendDir === 'up' && '↑'}
                      {row.trendDir === 'down' && '↓'}
                      {row.trendDir === 'neutral' && '→'}
                      {row.trend}
                    </span>
                  </td>
                  <td>
                    <button 
                      type="button"
                      onClick={() => setCurrentPage('recommendations')}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.72rem',
                        color: 'var(--accent-cyan)',
                        cursor: 'pointer'
                      }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Bottom Section: Quick Actions + Sustainability Banner */}
      <div className="dashboard-bottom-grid">
        {/* Quick Actions Tiles */}
        <div className="quick-actions-card">
          <div className="panel-title">
            <Sparkles size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span>Quick Actions</span>
          </div>

          <div className="quick-actions-row">
            {/* Action 1 */}
            <div 
              className="action-tile-btn"
              onClick={() => setCurrentPage('new-analysis')}
            >
              <div className="action-tile-icon purple">
                <BarChart2 size={16} />
              </div>
              <div>
                <div className="action-tile-title">Start New Analysis</div>
                <div className="action-tile-desc">Get recommendations for your route</div>
              </div>
              <ArrowRight size={14} className="action-tile-arrow" />
            </div>

            {/* Action 2 */}
            <div 
              className="action-tile-btn"
              onClick={() => setCurrentPage('history')}
            >
              <div className="action-tile-icon blue">
                <Calendar size={16} />
              </div>
              <div>
                <div className="action-tile-title">View History</div>
                <div className="action-tile-desc">Check past analyses and reports</div>
              </div>
              <ArrowRight size={14} className="action-tile-arrow" />
            </div>
          </div>
        </div>

        {/* Sustainability Banner */}
        <div className="sustainability-banner">
          <div className="sustainability-content">
            <span className="sustainability-tag">
              <Leaf size={14} />
              From Ocean to Opportunity
            </span>
            <h3 className="sustainability-heading">Smarter Decisions. Greener Oceans.</h3>
            <p className="sustainability-desc">
              Our forecasting models factor in operational vessel efficiency and emission benchmarks for greener chartering.
            </p>
          </div>

          <div className="sustainability-thumb">
            <img 
              src="/assets/bulk_carrier_sunset.jpg" 
              alt="Sustainable maritime bulk logistics"
              onError={(e) => { e.target.src = '/tall-ship.jpg'; }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}