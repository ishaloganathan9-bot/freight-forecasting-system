import React, { useState } from 'react';
import { FileText, Download, Printer, CheckCircle, Share2, Eye, ShieldCheck, Ship, Calendar } from 'lucide-react';
import { defaultAnalysisData } from '../services/api';

export default function Reports({ setCurrentPage, analysisData }) {
  const data = analysisData || defaultAnalysisData;
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="content-area">
      <div className="panel-box" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Executive Chartering Brief & Reports
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Official procurement dossier generated for {data.route_details.corridor}.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              type="button" 
              onClick={() => window.print()}
              className="back-btn"
            >
              <Printer size={15} />
              <span>Print Brief</span>
            </button>
            <button 
              type="button" 
              onClick={handleDownload}
              className="fast-submit-btn" 
              style={{ margin: 0 }}
            >
              <Download size={15} />
              <span>{downloadSuccess ? 'Downloaded!' : 'Export PDF'}</span>
            </button>
          </div>
        </div>

        {/* Report Preview Document Canvas */}
        <div style={{
          marginTop: '1.5rem',
          background: 'var(--bg-card-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          maxWidth: '840px',
          margin: '1.5rem auto 0',
          boxShadow: 'var(--shadow-card)'
        }}>
          {/* Header of Report */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Ship size={22} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>FreightForecast</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Decision Support Platform &bull; Document Reference #FF-2025-09-11-IND
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>11 September 2025</div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Status: VERIFIED RECOMMENDATION</div>
            </div>
          </div>

          {/* Report Summary Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Corridor</span>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{data.route_details.corridor}</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{data.route_details.distance}</span>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cargo & Volume</span>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{data.input.cargo}</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{Number(data.input.quantity).toLocaleString()} MT</span>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recommended Vessel</span>
              <div style={{ fontWeight: 700, color: '#38bdf8', marginTop: '0.2rem' }}>{data.metrics.recommended_vessel}</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{data.metrics.recommended_vessel_dwt}</span>
            </div>
          </div>

          {/* Key Findings */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
              Strategic Recommendation & Key Directives
            </h4>
            <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                1. <strong>Optimum Laycan Window:</strong> Booking within <strong>{data.metrics.chartering_window}</strong> secures lower expected spot fixtures before anticipated market firming in Q1 2026.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                2. <strong>Financial Advantage:</strong> Projected fixture baseline of <strong>{data.metrics.estimated_cost_exact}</strong> delivers an estimated 6-8% cost hedge against peak forward derivatives.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                3. <strong>Port & Draft Compliance:</strong> Paradip mechanized coal berth parameters accommodate the selected Panamax draft of 14.5m with zero tidal waiting demurrage risk.
              </p>
            </div>
          </div>

          {/* Signoff Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} style={{ color: '#10b981' }} />
              <span>Certified by Maritime Econometric AI Engine</span>
            </div>
            <button 
              type="button" 
              onClick={() => setCurrentPage('recommendations')} 
              className="panel-link"
            >
              <span>Back to Interactive Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
