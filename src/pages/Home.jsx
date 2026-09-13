import React from 'react';
import { ArrowRight, BarChart3, Compass, ShieldCheck } from 'lucide-react';

export default function Home({ setCurrentPage }) {
  return (
    <main className="home-page-container">
      {/* Background Canvas: Atmospheric Sky, Scaled Feathered Ship, and Sea Mist */}
      <div className="ship-canvas-backdrop" />
      <div className="ship-canvas-layer" />
      <div className="ship-canvas-overlay" />

      {/* Hero Header Area */}
      <section className="hero-content">
        {/* Centered title reduced to fit in 2 lines */}
        <h1 className="hero-heading">
          Intelligent Freight & Chartering
          <span className="hero-heading-sub">
            Make smarter bulk-cargo procurement decisions with market intelligence.
          </span>
        </h1>

        {/* Centered subtext description */}
        <p className="hero-description">
          Analyze freight requirements, understand forward market direction, and make data-driven chartering decisions for dry bulk commodities across key global trade corridors.
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setCurrentPage('new-analysis')}
          className="primary-cta-btn"
        >
          Start Freight Analysis
          <ArrowRight size={16} />
        </button>
      </section>

      {/* Transparent Overlay Cards showing the Ocean & Hull Beneath */}
      <section className="features-container">
        <div className="features-grid">
          <div className="feature-card">
            <div 
              className="feature-icon-badge" 
              style={{ background: 'rgba(20, 184, 166, 0.2)', color: '#2dd4bf', border: '1px solid rgba(20, 184, 166, 0.35)' }}
            >
              <Compass size={20} />
            </div>
            <h3>Route-Specific Projections</h3>
            <p>
              Real-time projection models tailored and weighted across major loading and discharge dry bulk trade routes.
            </p>
          </div>

          <div className="feature-card">
            <div 
              className="feature-icon-badge" 
              style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.35)' }}
            >
              <BarChart3 size={20} />
            </div>
            <h3>Charter Timing Signals</h3>
            <p>
              Actionable fixture indications evaluating spot float strategies versus long-term contract lock-ins.
            </p>
          </div>

          <div className="feature-card">
            <div 
              className="feature-icon-badge" 
              style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.35)' }}
            >
              <ShieldCheck size={20} />
            </div>
            <h3>Confidence & Volatility Guard</h3>
            <p>
              Quantified statistical confidence bands accounting for historical rate volatility and bunker swings.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}