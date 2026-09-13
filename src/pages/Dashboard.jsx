import React from 'react';
import { ArrowLeft, TrendingDown, TrendingUp, Calendar, RefreshCw, Ship, Layers } from 'lucide-react';
import ForecastChart from '../components/ForecastChart';
import Recommendation from '../components/Recommendation';

export default function Dashboard({ setCurrentPage, analysisData }) {
  const data = analysisData || {
    input: {
      cargo: 'coal',
      quantity: 300000,
      origin: 'Indonesia',
      destination: 'Paradip',
      deadline: '3 months',
      contract: 'short-term',
      priority: 'balanced',
    },
    current_rate: 15.2,
    forecast_rate: 13.7,
    trend: 'decreasing',
    volatility: 'medium',
    confidence: 0.82,
    recommendation: 'WAIT FOR BETTER MARKET ENTRY',
    savings_amount: 450000,
    historical_rates: [
      { date: '2026-01', rate: 16.2, isForecast: false },
      { date: '2026-02', rate: 15.8, isForecast: false },
      { date: '2026-03', rate: 15.2, isForecast: false },
      { date: '2026-04', rate: 14.5, isForecast: true },
      { date: '2026-05', rate: 13.9, isForecast: true },
      { date: '2026-06', rate: 13.7, isForecast: true },
    ],
  };

  const isDecreasing = data.trend === 'decreasing';
  const delta = (data.forecast_rate - data.current_rate).toFixed(1);

  return (
    <div className="analysis-page-wrapper">
      {/* Top Header */}
      <div className="analysis-header">
        <div>
          <button
            type="button"
            onClick={() => setCurrentPage('new-analysis')}
            className="back-link-btn"
          >
            <ArrowLeft size={14} />
            Modify Cargo Requirements
          </button>
          
          <h1 className="analysis-title">Market Intelligence Workspace</h1>
          
          <div className="corridor-pills-row">
            <span className="corridor-pill">
              <Ship size={12} />
              {data.input.cargo.toUpperCase()}
            </span>
            <span className="corridor-pill">
              {data.input.origin} &rarr; {data.input.destination}
            </span>
            <span className="corridor-pill">
              <Layers size={12} />
              {Number(data.input.quantity).toLocaleString()} MT
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCurrentPage('new-analysis')}
          className="run-btn-compact"
        >
          <RefreshCw size={14} />
          <span>New Run</span>
        </button>
      </div>

      {/* 5-Metric Quick Bar */}
      <div className="dashboard-metric-strip">
        <div className="metric-box">
          <span className="metric-tag">Current Spot Rate</span>
          <div className="metric-num">${data.current_rate} <span className="metric-sub">/ MT</span></div>
          <span className="metric-note">Latest benchmark fixture</span>
        </div>

        <div className="metric-box">
          <span className="metric-tag">Projected Rate</span>
          <div className="metric-num" style={{ color: isDecreasing ? '#10b981' : '#f43f5e' }}>
            ${data.forecast_rate} <span className="metric-sub">/ MT</span>
          </div>
          <span className="metric-note">Target laycan forward rate</span>
        </div>

        <div className="metric-box">
          <span className="metric-tag">Market Trend</span>
          <div className="metric-num" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isDecreasing ? '#10b981' : '#f43f5e' }}>
            {isDecreasing ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
            <span style={{ fontSize: '1.1rem', textTransform: 'capitalize' }}>
              {data.trend} ({delta})
            </span>
          </div>
          <span className="metric-note">Corridor forward directional bias</span>
        </div>

        <div className="metric-box">
          <span className="metric-tag">Volatility Index</span>
          <div className="metric-num" style={{ textTransform: 'capitalize', color: '#f59e0b', fontSize: '1.25rem' }}>
            {data.volatility}
          </div>
          <span className="metric-note">Bunker & fixture fluctuation</span>
        </div>

        <div className="metric-box">
          <span className="metric-tag">Confidence Band</span>
          <div className="metric-num" style={{ color: '#38bdf8' }}>
            {Math.round(data.confidence * 100)}%
          </div>
          <span className="metric-note">Econometric model certainty</span>
        </div>
      </div>

      {/* 2-Column Split: Rate History & Strategic Directive */}
      <div className="dashboard-main-grid">
        <div className="chart-panel-box">
          <div className="panel-header">
            <Calendar size={16} />
            <span>Rate History & Forward Econometric Forecast</span>
          </div>
          <ForecastChart historicalRates={data.historical_rates} />
        </div>

        <div className="recommendation-panel-box">
          <Recommendation 
            recommendation={data.recommendation}
            savings={data.savings_amount}
            currentRate={data.current_rate}
            forecastRate={data.forecast_rate}
            confidence={data.confidence}
            volatility={data.volatility}
            quantity={data.input.quantity}
            isDecreasing={isDecreasing}
          />
        </div>
      </div>
    </div>
  );
}