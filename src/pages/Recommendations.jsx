import React from 'react';
import { 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  Ship, 
  Info,
  Check,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Tooltip as RechartsTooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { defaultAnalysisData } from '../services/api';

export default function Recommendations({ setCurrentPage, analysisData }) {
  const data = analysisData || defaultAnalysisData;

  // Rate trend mini series
  const miniTrendData = [
    { month: 'Sep', rate: 24.8 },
    { month: 'Oct', rate: 26.2 },
    { month: 'Nov', rate: 28.0 },
    { month: 'Dec', rate: 29.8 },
    { month: 'Jan', rate: 32.0 },
    { month: 'Feb', rate: 33.5 },
  ];

  return (
    <div className="content-area">
      {/* 1. Subtitle & Status Meta Bar matching mockup */}
      <div className="recommendation-meta-bar">
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Based on your input:{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {data.route_details.corridor}
            </strong>{' '}
            |{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {data.route_details.cargo_quantity}
            </strong>{' '}
            |{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {data.input.deadline}
            </strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {data.timestamp || '11 Sep 2025'}
          </span>
          <div className="recommendation-status-badge">
            <CheckCircle2 size={15} />
            <span>Analysis Complete</span>
          </div>
        </div>
      </div>

      {/* 2. Top Hero Grid: Vessel Photo + Highlight Card + Rate Trend Mini Chart */}
      <div className="recommendation-hero-grid">
        {/* Vessel Photo Preview Card */}
        <div className="vessel-photo-card">
          <img 
            src="/assets/panamax_vessel.jpg" 
            alt="Recommended Panamax Dry Bulk Carrier"
            onError={(e) => { e.target.src = '/tall-ship.jpg'; }}
          />
        </div>

        {/* Vessel Recommendation Highlight Card */}
        <div className="vessel-highlight-card">
          <div>
            <div className="vessel-headline-row">
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
                  Recommended Vessel
                </span>
                <h2 className="vessel-primary-title">{data.metrics.recommended_vessel}</h2>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Capacity: {data.metrics.recommended_vessel_dwt}
                </span>
              </div>

              <div className="best-choice-badge">
                <Award size={14} />
                <span>Best Overall Choice</span>
              </div>
            </div>
          </div>

          <div className="highlight-stats-subgrid">
            <div className="stat-item-col">
              <span className="stat-item-label">Estimated Total Cost</span>
              <span className="stat-item-val" style={{ color: '#38bdf8' }}>
                {data.metrics.estimated_cost_exact || data.metrics.estimated_total_cost}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                (for {Number(data.input.quantity).toLocaleString()} tonnes)
              </span>
            </div>

            <div className="stat-item-col">
              <span className="stat-item-label">Chartering Window</span>
              <span className="stat-item-val">{data.metrics.chartering_window}</span>
              <span style={{ fontSize: '0.65rem', color: '#10b981' }}>
                {data.metrics.chartering_note}
              </span>
            </div>

            <div className="stat-item-col">
              <span className="stat-item-label">Risk Level</span>
              <span className="stat-item-val" style={{ color: '#10b981' }}>
                {data.metrics.risk_level}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                Draft compliant
              </span>
            </div>

            <div className="stat-item-col">
              <span className="stat-item-label">Overall Score</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                <span className="stat-item-val" style={{ color: '#34d399', fontSize: '1.25rem' }}>
                  {data.scores?.overall || 92}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/ 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expected Freight Rate Trend Mini Chart */}
        <div className="trend-mini-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Expected Freight Rate Trend
            </span>
            <span style={{ 
              fontSize: '0.7rem', 
              padding: '0.15rem 0.5rem', 
              borderRadius: '999px', 
              background: 'rgba(244, 63, 94, 0.15)', 
              color: '#f43f5e',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <TrendingUp size={12} />
              <span>Increasing</span>
            </span>
          </div>

          <div style={{ height: '110px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={miniTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[20, 36]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(7,21,36,0.9)', borderColor: 'rgba(56,189,248,0.3)', fontSize: '11px', borderRadius: '6px' }}
                  formatter={(val) => [`$${val}/ton`, 'Rate']}
                />
                <Line type="monotone" dataKey="rate" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 2.5, fill: '#f43f5e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.35, marginTop: '0.4rem' }}>
            Forecast indicates a rising trend in freight rates. Booking in suggested window avoids higher forward costs.
          </p>
        </div>
      </div>

      {/* 3. Vessel Options Comparison Matrix Table */}
      <div className="comparison-matrix-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="panel-title">
            <Ship size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span>Vessel Options Comparison Matrix</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Evaluated against Paradip Port berth constraints & cargo volume
          </span>
        </div>

        <table className="matrix-table">
          <thead>
            <tr>
              <th>Vessel Type</th>
              <th>Capacity (DWT)</th>
              <th>Est. Cost (USD)</th>
              <th>Port Suitability</th>
              <th>Risk Level</th>
              <th>Overall Score</th>
            </tr>
          </thead>
          <tbody>
            {data.vessel_options.map((vessel) => {
              const isRecommended = vessel.is_recommended;
              return (
                <tr key={vessel.id} className={isRecommended ? 'highlighted-row' : ''}>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{vessel.name}</span>
                    {isRecommended && (
                      <span className="matrix-badge-recommended">Recommended</span>
                    )}
                  </td>
                  <td>{vessel.capacity}</td>
                  <td style={{ fontWeight: 600, color: isRecommended ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
                    ${vessel.est_cost_range}
                  </td>
                  <td>
                    <span className={`suitability-pill ${
                      vessel.port_suitability === 'Excellent' ? 'excellent' : (vessel.port_suitability === 'Good' ? 'good' : 'moderate')
                    }`}>
                      {vessel.port_suitability}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: vessel.risk_level === 'Low' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                      {vessel.risk_level}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isRecommended ? '#34d399' : 'var(--text-secondary)' }}>
                        {vessel.overall_score}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ 100</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Why This Recommendation? Tri-Fold Block */}
      <div className="why-recommendation-grid">
        {/* Column 1: Key Reasons Checklist */}
        <div className="panel-box">
          <div className="panel-title">
            <CheckCircle2 size={16} style={{ color: '#10b981' }} />
            <span>Key Reasons</span>
          </div>

          <div className="reasons-list">
            {data.why_recommendation.map((reason, idx) => (
              <div key={idx} className="reason-item">
                <Check size={16} className="reason-check-icon" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Cost - Risk - Sustainability Donut Gauge */}
        <div className="panel-box">
          <div className="panel-title">
            <Award size={16} style={{ color: 'var(--accent-purple)' }} />
            <span>Cost – Risk – Sustainability Score</span>
          </div>

          <div className="donut-gauge-container">
            {/* SVG Donut Ring */}
            <div className="donut-svg-wrapper">
              <svg width="120" height="120" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
                
                {/* Cost segment 35% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#2563eb" strokeWidth="9" 
                  strokeDasharray="83.5 238.7" strokeDashoffset="0" transform="rotate(-90 50 50)" />
                
                {/* Risk segment 25% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="9" 
                  strokeDasharray="59.7 238.7" strokeDashoffset="-83.5" transform="rotate(-90 50 50)" />
                
                {/* Efficiency segment 20% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#38bdf8" strokeWidth="9" 
                  strokeDasharray="47.7 238.7" strokeDashoffset="-143.2" transform="rotate(-90 50 50)" />
                
                {/* Sustainability segment 20% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="9" 
                  strokeDasharray="47.7 238.7" strokeDashoffset="-190.9" transform="rotate(-90 50 50)" />
              </svg>

              <div className="donut-center-label">
                <span className="donut-score-number">{data.scores?.overall || 92}</span>
                <span className="donut-score-total">/ 100</span>
              </div>
            </div>

            {/* Legend */}
            <div className="donut-legend">
              <div className="donut-legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#2563eb' }} />
                <span>Cost: <strong>{data.scores?.cost || 35}%</strong></span>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#f59e0b' }} />
                <span>Risk: <strong>{data.scores?.risk || 25}%</strong></span>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#38bdf8' }} />
                <span>Efficiency: <strong>{data.scores?.efficiency || 20}%</strong></span>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#10b981' }} />
                <span>Sustainability: <strong>{data.scores?.sustainability || 20}%</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Explainable AI Decision Factors */}
        <div className="panel-box">
          <div className="panel-title">
            <Info size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span>Explainable AI</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Top Factors Influencing Decision
          </span>

          <div className="explainable-ai-list">
            {data.explainable_ai.map((item, idx) => (
              <div key={idx} className="ai-factor-row">
                <div className="ai-factor-meta">
                  <span className="ai-factor-name">{item.factor}</span>
                  <span className="ai-factor-pct">{item.weight}%</span>
                </div>
                <div className="ai-progress-track">
                  <div 
                    className="ai-progress-fill" 
                    style={{ width: `${(item.weight / 30) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
