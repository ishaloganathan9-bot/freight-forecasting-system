import React from 'react';
import { ShieldAlert, ShieldCheck, DollarSign } from 'lucide-react';

export default function Recommendation({ 
  recommendation, 
  savings, 
  currentRate, 
  forecastRate, 
  confidence, 
  volatility, 
  quantity, 
  isDecreasing 
}) {
  const delta = (forecastRate - currentRate).toFixed(1);

  return (
    <div className="recommendation-card-inner">
      <div 
        className="recommendation-badge" 
        style={{
          backgroundColor: isDecreasing ? 'rgba(16, 185, 129, 0.1)' : 'rgba(56, 189, 248, 0.1)',
          borderColor: isDecreasing ? 'rgba(16, 185, 129, 0.3)' : 'rgba(56, 189, 248, 0.3)',
          color: isDecreasing ? '#10b981' : '#38bdf8'
        }}
      >
        {isDecreasing ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
        <span>Chartering Decision Recommendation</span>
      </div>

      <h2 className="recommendation-directive-title">
        {recommendation}
      </h2>

      <p className="recommendation-directive-body">
        Forward supply indications suggest bulk freight rates will ease by ${Math.abs(delta)}/tonne. Delaying fixture entry is projected to capture significant savings[cite: 4].
      </p>

      {/* Structured Factor Breakdown Rows */}
      <div className="intel-breakdown-list">
        <div className="intel-row">
          <span className="intel-q">What is happening?</span>
          <span className="intel-val" style={{ color: isDecreasing ? '#10b981' : '#f43f5e' }}>
            Spot: ${currentRate}/t &bull; {isDecreasing ? 'DECREASING' : 'INCREASING'}
          </span>
        </div>

        <div className="intel-row">
          <span className="intel-q">What is expected?</span>
          <span className="intel-val" style={{ color: '#38bdf8' }}>
            Target: ${forecastRate}/t &bull; {Math.round(confidence * 100)}% Confidence
          </span>
        </div>

        <div className="intel-row">
          <span className="intel-q">What should I consider?</span>
          <span className="intel-val" style={{ textTransform: 'capitalize', color: '#f59e0b' }}>
            {volatility} Route Volatility
          </span>
        </div>

        <div className="intel-row">
          <span className="intel-q">Procurement Impact:</span>
          <span className="intel-val" style={{ color: '#10b981' }}>
            {delta}/t price advantage
          </span>
        </div>
      </div>

      {/* Dark Cost Savings Impact Card */}
      <div className="savings-highlight-box">
        <div className="savings-icon-wrapper">
          <DollarSign size={20} />
        </div>
        <div>
          <span className="savings-label">Est. Cargo Cost Savings</span>
          <div className="savings-value">
            ${Number(savings).toLocaleString()}
          </div>
          <span className="savings-subtext">
            Calculated over {Number(quantity).toLocaleString()} MT tonnage basis
          </span>
        </div>
      </div>
    </div>
  );
}